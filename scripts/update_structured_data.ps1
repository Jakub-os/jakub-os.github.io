$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$siteUrl = "https://www.yabi.sk"
$logoUrl = "$siteUrl/images/brand/yabi-studio-origami-bird-logo.svg"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Get-CleanText {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return ""
  }

  $text = [regex]::Replace($Value, "<[^>]+>", " ")
  $text = [System.Net.WebUtility]::HtmlDecode($text)
  $text = $text.Replace([char]0x200D, " ")
  $text = [regex]::Replace($text, "\s+", " ")
  return $text.Trim()
}

function Make-AbsoluteUrl {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return ""
  }

  $url = $Value.Trim()
  if (-not $url -or $url.ToLowerInvariant() -eq "none") {
    return ""
  }
  if ($url.StartsWith("https://") -or $url.StartsWith("http://")) {
    return $url
  }
  if ($url.StartsWith("//")) {
    return "https:$url"
  }
  if ($url.StartsWith("../")) {
    return "$siteUrl/$($url.Substring(3))"
  }
  if ($url.StartsWith("./")) {
    return "$siteUrl/$($url.Substring(2))"
  }
  if ($url.StartsWith("/")) {
    return "$siteUrl$url"
  }
  return "$siteUrl/$($url.TrimStart('/'))"
}

function Get-SingleMatch {
  param(
    [string]$Text,
    [string]$Pattern
  )

  $match = [regex]::Match($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if ($match.Success) {
    return $match.Groups[1].Value
  }
  return ""
}

function Get-Body {
  param([string]$Html)

  $match = [regex]::Match($Html, "<body[\s\S]*", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if ($match.Success) {
    return $match.Value
  }
  return $Html
}

function Get-FirstNonEmptyParagraph {
  param([string]$Html)

  $body = Get-Body $Html
  function Is-UsefulParagraph {
    param([string]$Paragraph)

    return (
      $Paragraph -and
      $Paragraph -notin @("&zwj;", "Thank you! Your submission has been received!", "Oops! Something went wrong while submitting the form.") -and
      -not $Paragraph.StartsWith(".yabi-logo") -and
      -not $Paragraph.StartsWith(".ig-logo") -and
      -not $Paragraph.StartsWith(".be-logo") -and
      -not $Paragraph.StartsWith("O nás Kontakt Projekty Služby Blog") -and
      -not $Paragraph.StartsWith("MENU O nás")
    )
  }

  $preferredBlocks = [regex]::Matches($body, '<div class="(?:rich-text-block )?w-richtext">([\s\S]*?)</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($block in $preferredBlocks) {
    $preferredMatches = [regex]::Matches($block.Groups[1].Value, "<p[^>]*>(.*?)</p>", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($match in $preferredMatches) {
      $paragraph = Get-CleanText $match.Groups[1].Value
      if (Is-UsefulParagraph $paragraph) {
        return $paragraph
      }
    }
  }

  $matches = [regex]::Matches($body, "<p[^>]*>(.*?)</p>", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $matches) {
    $paragraph = Get-CleanText $match.Groups[1].Value
    if (Is-UsefulParagraph $paragraph) {
      return $paragraph
    }
  }

  return ""
}

function Get-ScriptMatch {
  param([string]$Html)

  return [regex]::Match($Html, '<script type="application/ld\+json">\s*(.*?)\s*</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

function Get-DistinctImageUrls {
  param([string]$Html)

  $images = New-Object System.Collections.Generic.List[string]

  function Add-ImageCandidate {
    param([string]$Value)

    $candidate = Make-AbsoluteUrl $Value
    if (-not $candidate) {
      return
    }

    $normalized = $candidate.ToLowerInvariant()
    if ($normalized -notmatch '\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$') {
      return
    }
    if (
      $normalized -match '/images/icons/' -or
      $normalized -match 'favicon' -or
      $normalized -match 'apple-touch-icon' -or
      $normalized -match 'logo'
    ) {
      return
    }

    if (-not $images.Contains($candidate)) {
      $images.Add($candidate)
    }
  }

  $metaMatches = [regex]::Matches($Html, '<meta content="([^"]+)" (?:property|name)="(?:og:image|twitter:image)">', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $metaMatches) {
    Add-ImageCandidate $match.Groups[1].Value
  }

  $body = Get-Body $Html

  $bgMatches = [regex]::Matches($body, 'background-image:url\((["'']?)([^)"'']+)\1\)')
  foreach ($match in $bgMatches) {
    Add-ImageCandidate $match.Groups[2].Value
  }

  $imgMatches = [regex]::Matches($body, '<img[^>]+src="([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $imgMatches) {
    Add-ImageCandidate $match.Groups[1].Value
  }

  return @($images)
}

function Get-ArticleKeywords {
  param([string]$Html)

  $region = Get-SingleMatch $Html '<div class="blog_chip_wrap">(.*?)<div class="hero_title'
  if (-not $region) {
    return @()
  }

  $keywords = New-Object System.Collections.Generic.List[string]
  $matches = [regex]::Matches($region, '<div class="medium-uppercase-xs">(.*?)</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $matches) {
    $keyword = Get-CleanText $match.Groups[1].Value
    if ($keyword -and $keyword.ToLowerInvariant() -ne "newsletter" -and -not $keywords.Contains($keyword)) {
      $keywords.Add($keyword)
    }
  }
  return @($keywords)
}

function New-Organization {
  return [ordered]@{
    "@type" = "Organization"
    name = "YABI Studio"
    url = $siteUrl
  }
}

function New-Publisher {
  return [ordered]@{
    "@type" = "Organization"
    name = "YABI Studio"
    url = $siteUrl
    logo = [ordered]@{
      "@type" = "ImageObject"
      url = $logoUrl
    }
  }
}

function ConvertTo-JsonLd {
  param($Object)

  return ($Object | ConvertTo-Json -Depth 100)
}

function Set-SchemaBlock {
  param(
    [string]$Html,
    [string]$SchemaJson
  )

  $block = "<script type=`"application/ld+json`">`n$SchemaJson`n</script>"
  $match = Get-ScriptMatch $Html
  if ($match.Success) {
    return $Html.Substring(0, $match.Index) + $block + $Html.Substring($match.Index + $match.Length)
  }
  return $Html.Replace("</head>", "$block</head>")
}

function Normalize-SchemaString {
  param(
    [string]$SchemaText,
    [string]$CanonicalUrl,
    [string]$Description
  )

  $normalized = [regex]::Replace(
    $SchemaText,
    '"(url|item|mainEntityOfPage)"\s*:\s*"([^"]+)"',
    {
      param($match)
      $key = $match.Groups[1].Value
      $value = Make-AbsoluteUrl $match.Groups[2].Value
      return '"' + $key + '": "' + $value + '"'
    }
  )

  $normalized = $normalized -replace '"name"\s*:\s*"Yabi"', '"name": "YABI Studio"'
  $normalized = [regex]::Replace(
    $normalized,
    'https://cdn\.prod\.website-files\.com/6991c6ee048fced6a26d0751/6991c6ee048fced6a26d07d5_logo\.svg',
    $logoUrl
  )
  $normalized = $normalized.Replace('https://www\.yabi\.sk/images/brand/yabi-studio-origami-bird-logo\.svg', $logoUrl)
  $normalized = [regex]::Replace($normalized, '"url"\s*:\s*""', '"url": "' + $CanonicalUrl + '"')

  if ($Description) {
    $escaped = [System.Text.RegularExpressions.Regex]::Escape($Description)
    $normalized = [regex]::Replace($normalized, '"description"\s*:\s*""', '"description": "' + ($Description -replace '"', '\"') + '"')
  }

  return [System.Net.WebUtility]::HtmlDecode($normalized)
}

function Build-ArticleSchema {
  param(
    [string]$Html,
    [string]$ExistingSchemaText,
    [string]$CanonicalUrl,
    [string]$Title,
    [string]$Description
  )

  $summary = $Description
  if (-not $summary) {
    $summary = Get-FirstNonEmptyParagraph $Html
  }

  $published = Get-SingleMatch $ExistingSchemaText '"datePublished"\s*:\s*"([^"]+)"'
  $modified = Get-SingleMatch $ExistingSchemaText '"dateModified"\s*:\s*"([^"]+)"'
  $images = Get-DistinctImageUrls -Html $Html
  $articleSlug = Get-SingleMatch $CanonicalUrl '/articles/([^/?#]+)'
  if ($articleSlug) {
    $scopedImages = @($images | Where-Object { $_ -like "*/images/articles/$articleSlug/*" })
    if ($scopedImages.Count -gt 0) {
      $images = $scopedImages
    }
  }
  if ($images.Count -gt 5) {
    $images = $images[0..4]
  }

  if ($images.Count -eq 0) {
    $imageValue = $null
  } elseif ($images.Count -eq 1) {
    $imageValue = [ordered]@{
      "@type" = "ImageObject"
      url = $images[0]
    }
  } else {
    $imageValue = @()
    foreach ($image in $images[0..([Math]::Min(4, $images.Count - 1))]) {
      $imageValue += [ordered]@{
        "@type" = "ImageObject"
        url = $image
      }
    }
  }

  $schema = [ordered]@{
    "@context" = "https://schema.org"
    "@type" = "BlogPosting"
    headline = $Title
    description = $summary
    url = $CanonicalUrl
    mainEntityOfPage = $CanonicalUrl
    inLanguage = "sk-SK"
    author = New-Organization
    publisher = New-Publisher
  }
  if ($imageValue) {
    $schema.image = $imageValue
  }

  if ($published) {
    $schema.datePublished = $published
  }
  if ($modified) {
    $schema.dateModified = $modified
  }

  $keywords = Get-ArticleKeywords $Html
  if ($keywords.Count -gt 0) {
    $schema.keywords = $keywords
  }

  return $schema
}

function Build-ProjectSchema {
  param(
    [string]$Html,
    [string]$ExistingSchemaText,
    [string]$CanonicalUrl,
    [string]$Title,
    [string]$Description
  )

  $projectSummary = Get-CleanText (Get-SingleMatch $Html '<div class="label white">Zhrnutie</div>\s*<div class="paragraph">(.*?)</div>')
  $summary = if ($projectSummary) { $projectSummary } else { $Description }
  if (-not $summary) {
    $summary = Get-FirstNonEmptyParagraph $Html
  }

  $published = Get-SingleMatch $ExistingSchemaText '"datePublished"\s*:\s*"([^"]+)"'
  $modified = Get-SingleMatch $ExistingSchemaText '"dateModified"\s*:\s*"([^"]+)"'
  $aboutName = Get-SingleMatch $ExistingSchemaText '"about"\s*:\s*\{[\s\S]*?"name"\s*:\s*"([^"]+)"'
  $aboutDescription = Get-SingleMatch $ExistingSchemaText '"about"\s*:\s*\{[\s\S]*?"description"\s*:\s*"([^"]+)"'
  $textValue = Get-SingleMatch $ExistingSchemaText '"articleBody"\s*:\s*"([^"]+)"'
  if (-not $textValue) {
    $textValue = Get-SingleMatch $ExistingSchemaText '"text"\s*:\s*"([^"]+)"'
  }

  $images = Get-DistinctImageUrls -Html $Html
  $projectSlug = Get-SingleMatch $CanonicalUrl '/featured-projects/([^/?#]+)'
  if ($projectSlug) {
    $scopedImages = @($images | Where-Object { $_ -like "*/images/projects/$projectSlug/*" })
    if ($scopedImages.Count -gt 0) {
      $images = $scopedImages
    }
  }
  if ($images.Count -gt 7) {
    $images = $images[0..6]
  }

  $schema = [ordered]@{
    "@context" = "https://schema.org"
    "@type" = "CreativeWork"
    name = $Title
    description = $summary
    url = $CanonicalUrl
    mainEntityOfPage = $CanonicalUrl
    inLanguage = "sk-SK"
    creator = New-Organization
    publisher = New-Publisher
    isPartOf = [ordered]@{
      "@type" = "CollectionPage"
      name = "Projekty"
      url = "$siteUrl/projekty"
    }
  }

  if ($images.Count -gt 0) {
    $schema.image = $images
  }
  if ($published) {
    $schema.datePublished = $published
  }
  if ($modified) {
    $schema.dateModified = $modified
  }
  if ($summary) {
    $schema.about = [ordered]@{
      "@type" = "Thing"
      name = $Title
      description = $summary
    }
  } elseif ($aboutName -or $aboutDescription) {
    $schema.about = [ordered]@{
      "@type" = "Thing"
      name = $(if ($aboutName) { Get-CleanText $aboutName } else { $Title })
      description = $(if ($aboutDescription) { Get-CleanText $aboutDescription } else { $summary })
    }
  }
  if ($textValue) {
    $schema.text = Get-CleanText $textValue
  }

  return $schema
}

function Build-BlogListSchema {
  param([string]$Html)

  $canonicalUrl = Get-SingleMatch $Html '<link href="([^"]+)" rel="canonical">'
  $heroTitle = Get-CleanText (Get-SingleMatch $Html '<h1 class="h1_secondary_blog">(.*?)</h1>')
  $heroDescription = Get-CleanText (Get-SingleMatch $Html '<p class="hero_description">(.*?)</p>')
  if (-not $heroTitle) {
    $heroTitle = "Blog"
  }
  if (-not $heroDescription) {
    $heroDescription = "Clanky o webdizajne, UX, SEO a Webflowe."
  }

  $items = New-Object System.Collections.Generic.List[object]
  $seen = New-Object System.Collections.Generic.HashSet[string]
  $matches = [regex]::Matches((Get-Body $Html), '<a[^>]+href="(/articles/[^"]+)"[^>]*>(.*?)</a>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $matches) {
    $url = Make-AbsoluteUrl $match.Groups[1].Value
    if (-not $url -or $seen.Contains($url)) {
      continue
    }

    $anchorHtml = $match.Groups[2].Value
    $headline = Get-CleanText (Get-SingleMatch $anchorHtml '<h[1-6][^>]*>(.*?)</h[1-6]>')
    if (-not $headline) {
      continue
    }

    [void]$seen.Add($url)

    $item = [ordered]@{
      "@type" = "ListItem"
      position = $items.Count + 1
      url = $url
      name = $headline
    }

    $image = Make-AbsoluteUrl (Get-SingleMatch $anchorHtml '<img[^>]+src="([^"]+)"')
    if ($image) {
      $item.image = $image
    }

    $description = Get-CleanText (Get-SingleMatch $anchorHtml '<p class="article_description dark">(.*?)</p>')
    if ($description) {
      $item.description = $description
    }

    $dateValue = Get-CleanText (Get-SingleMatch $anchorHtml '<p class="date_label dark">(.*?)</p>')
    if ($dateValue) {
      $item.datePublished = $dateValue
    }

    $items.Add($item)
  }

  $itemListElements = $items.ToArray()

  return [ordered]@{
    "@context" = "https://schema.org"
    "@type" = "CollectionPage"
    name = $heroTitle
    description = $heroDescription
    url = $canonicalUrl
    inLanguage = "sk-SK"
    isPartOf = [ordered]@{
      "@type" = "WebSite"
      name = "YABI Studio"
      url = $siteUrl
    }
    mainEntity = [ordered]@{
      "@type" = "ItemList"
      numberOfItems = $items.Count
      itemListElement = $itemListElements
    }
  }
}

$htmlFiles = Get-ChildItem -Path $root -Recurse -Filter *.html | Sort-Object FullName
$updatedCount = 0

foreach ($file in $htmlFiles) {
  $html = [System.IO.File]::ReadAllText($file.FullName)
  $schemaMatch = Get-ScriptMatch $html
  $existingSchemaText = if ($schemaMatch.Success) { $schemaMatch.Groups[1].Value } else { "" }

  $canonicalUrl = Get-SingleMatch $html '<link href="([^"]+)" rel="canonical">'
  $title = Get-CleanText (Get-SingleMatch $html '<title>(.*?)</title>')
  $description = Get-CleanText (Get-SingleMatch $html '<meta content="([^"]*)" name="description">')

  $relativePath = $file.FullName.Substring($root.Length + 1).Replace("\", "/")

  if ($relativePath -eq "blogs/blog-list.html") {
    $schemaJson = ConvertTo-JsonLd (Build-BlogListSchema $html)
    $updatedHtml = Set-SchemaBlock -Html $html -SchemaJson $schemaJson
  }
  elseif ($relativePath.StartsWith("articles/")) {
    $schemaJson = ConvertTo-JsonLd (Build-ArticleSchema -Html $html -ExistingSchemaText $existingSchemaText -CanonicalUrl $canonicalUrl -Title $title -Description $description)
    $updatedHtml = Set-SchemaBlock -Html $html -SchemaJson $schemaJson
  }
  elseif ($relativePath.StartsWith("featured-projects/")) {
    $schemaJson = ConvertTo-JsonLd (Build-ProjectSchema -Html $html -ExistingSchemaText $existingSchemaText -CanonicalUrl $canonicalUrl -Title $title -Description $description)
    $updatedHtml = Set-SchemaBlock -Html $html -SchemaJson $schemaJson
  }
  else {
    if (-not $schemaMatch.Success) {
      throw "Missing structured data block in $relativePath"
    }
    $normalizedSchema = Normalize-SchemaString -SchemaText $existingSchemaText -CanonicalUrl $canonicalUrl -Description $description
    $updatedHtml = Set-SchemaBlock -Html $html -SchemaJson $normalizedSchema
  }

  if ($updatedHtml -ne $html) {
    [System.IO.File]::WriteAllText($file.FullName, $updatedHtml, $utf8NoBom)
    $updatedCount += 1
  }
}

Write-Output "Updated structured data in $updatedCount HTML files."
