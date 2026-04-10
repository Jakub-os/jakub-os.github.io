$ErrorActionPreference = "Stop"

function Get-RelativeUnixPath([string]$filePath, [string]$rootPath) {
  $resolvedPath = (Resolve-Path -LiteralPath $filePath).Path
  $relativePath = $resolvedPath.Substring($rootPath.Length).TrimStart("\", "/")
  return $relativePath -replace "\\", "/"
}

function Decode-Html([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return ""
  }

  return [System.Net.WebUtility]::HtmlDecode($value)
}

function Encode-Html([string]$value) {
  if ($null -eq $value) {
    return ""
  }

  return [System.Net.WebUtility]::HtmlEncode($value)
}

function Normalize-Whitespace([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return ""
  }

  $normalized = $value -replace "&nbsp;", " "
  $normalized = $normalized -replace "\s+", " "
  return $normalized.Trim()
}

function Normalize-DescriptionLength([string]$value, [int]$maxLength = 160) {
  $normalized = Normalize-Whitespace $value

  if ($normalized.Length -le $maxLength) {
    return $normalized
  }

  $trimmed = $normalized.Substring(0, $maxLength - 3)
  $lastSpace = $trimmed.LastIndexOf(" ")

  if ($lastSpace -gt 100) {
    $trimmed = $trimmed.Substring(0, $lastSpace)
  }

  return ($trimmed.TrimEnd(" ", ",", ";", ":", "-", ".") + "...")
}

function Strip-Html([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return ""
  }

  $withoutStyles = [regex]::Replace($value, "(?is)<style.*?</style>", "")
  $withoutScripts = [regex]::Replace($withoutStyles, "(?is)<script.*?</script>", "")
  $withLineBreaks = [regex]::Replace($withoutScripts, "(?is)<br\s*/?>", " ")
  $withoutTags = [regex]::Replace($withLineBreaks, "(?is)<[^>]+>", " ")
  return Normalize-Whitespace (Decode-Html $withoutTags)
}

function Get-MatchValue([string]$content, [string]$pattern, [int]$groupIndex = 1) {
  $options = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  $match = [regex]::Match($content, $pattern, $options)

  if (-not $match.Success) {
    return ""
  }

  return $match.Groups[$groupIndex].Value
}

function Get-Matches([string]$content, [string]$pattern) {
  $options = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  return [regex]::Matches($content, $pattern, $options)
}

function Set-TitleTag([string]$content, [string]$title) {
  $replacement = "<title>$(Encode-Html $title)</title>"

  if ($content -match "(?is)<title>.*?</title>") {
    return [regex]::Replace($content, "(?is)<title>.*?</title>", $replacement, 1)
  }

  return $content -replace "(?is)(<meta charset=""utf-8"">)", "`$1$replacement"
}

function Set-LinkTag([string]$content, [string]$rel, [string]$href) {
  $replacement = "<link href=""$href"" rel=""$rel"">"
  $pattern = "<link[^>]*rel=""$([regex]::Escape($rel))""[^>]*>"

  if ($content -match $pattern) {
    return [regex]::Replace($content, $pattern, $replacement, 1)
  }

  return $content -replace "(?is)(</head>)", "$replacement`r`n`$1"
}

function Set-MetaTag([string]$content, [string]$attributeName, [string]$attributeValue, [string]$metaValue) {
  $replacement = "<meta content=""$(Encode-Html $metaValue)"" $attributeName=""$attributeValue"">"
  $pattern = "<meta[^>]*$attributeName=""$([regex]::Escape($attributeValue))""[^>]*>"

  if ($content -match $pattern) {
    return [regex]::Replace($content, $pattern, $replacement, 1)
  }

  return $content -replace "(?is)(<meta content=""width=device-width, initial-scale=1"" name=""viewport"">)", "$replacement`r`n`$1"
}

function Set-JsonLd([string]$content, [hashtable]$schema) {
  $json = $schema | ConvertTo-Json -Depth 20
  $replacement = "<script type=""application/ld+json"">`r`n$json`r`n</script>"

  if ($content -match '(?is)<script type="application/ld\+json">.*?</script>') {
    return [regex]::Replace($content, '(?is)<script type="application/ld\+json">.*?</script>', $replacement, 1)
  }

  return $content -replace "(?is)(</head>)", "$replacement`r`n`$1"
}

function Build-Canonical([string]$relativePath) {
  if ($relativePath -eq "index.html") {
    return "https://www.yabi.sk"
  }

  $trimmed = $relativePath -replace "\.html$", ""
  return "https://www.yabi.sk/$trimmed"
}

function Parse-Chips([string]$content, [string]$containerClass) {
  $options = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  $containerPattern = "<div class=""$([regex]::Escape($containerClass))"".*?</div>\s*</div>\s*</div>"
  $container = Get-MatchValue $content $containerPattern
  $chips = @()

  if (-not $container) {
    return @()
  }

  foreach ($match in [regex]::Matches($container, '<div class="medium-uppercase-xs">(.*?)</div>', $options)) {
    $value = Strip-Html $match.Groups[1].Value

    if ($value) {
      $chips += $value
    }
  }

  return $chips
}

function Parse-FaqItems([string]$content) {
  $questions = Get-Matches $content '<div class="medium-uppercase-m faq-question-text">(.*?)</div>'
  $answers = Get-Matches $content '<p[^>]*class="regular-s faq-answer-text">(.*?)</p>'
  $faqItems = @()

  for ($index = 0; $index -lt [Math]::Min($questions.Count, $answers.Count); $index += 1) {
    $question = Strip-Html $questions[$index].Groups[1].Value
    $answer = Strip-Html $answers[$index].Groups[1].Value

    if ($question -and $answer) {
      $faqItems += [ordered]@{
        "@type" = "Question"
        name = $question
        acceptedAnswer = [ordered]@{
          "@type" = "Answer"
          text = $answer
        }
      }
    }
  }

  return $faqItems
}

function Build-OrganizationNode() {
  return [ordered]@{
    "@type" = "Organization"
    name = "YABI Studio"
    url = "https://www.yabi.sk"
    logo = [ordered]@{
      "@type" = "ImageObject"
      url = "https://www.yabi.sk/images/brand/yabi-studio-origami-bird-logo.svg"
    }
  }
}

function Get-PageNodeType([string]$relativePath, [bool]$hasFaq) {
  if ($relativePath -eq "index.html") {
    if ($hasFaq) {
      return @("WebSite", "FAQPage")
    }

    return "WebSite"
  }

  if ($relativePath -eq "o-nas.html") {
    if ($hasFaq) {
      return @("AboutPage", "FAQPage")
    }

    return "AboutPage"
  }

  if ($relativePath -eq "kontaktujte-nas.html") {
    return "ContactPage"
  }

  if ($relativePath -eq "projekty.html") {
    if ($hasFaq) {
      return @("CollectionPage", "FAQPage")
    }

    return "CollectionPage"
  }

  if ($relativePath -eq "blogs/blog-list.html") {
    return "CollectionPage"
  }

  if ($relativePath -like "articles/*") {
    return "BlogPosting"
  }

  if ($relativePath -like "featured-projects/*") {
    return "CreativeWork"
  }

  if ($hasFaq) {
    return @("WebPage", "FAQPage")
  }

  return "WebPage"
}

function Build-PageSchema(
  [string]$relativePath,
  [string]$title,
  [string]$description,
  [string]$canonical,
  [string]$image,
  [string]$content
) {
  $organization = Build-OrganizationNode
  $faqItems = Parse-FaqItems $content
  $hasFaq = $faqItems.Count -gt 0
  $pageType = Get-PageNodeType $relativePath $hasFaq
  $datePublished = Get-MatchValue $content '"datePublished"\s*:\s*"([^"]+)"'
  $dateModified = Get-MatchValue $content '"dateModified"\s*:\s*"([^"]+)"'
  $titleWithoutBrand = $title -replace '\s+\|\s+YABI Studio$', '' -replace '\s+\|\s+Projekt YABI Studio$', ''

  if ($relativePath -like "articles/*") {
    $articleKeywords = Parse-Chips $content "blog_chip_wrap"
    $schema = [ordered]@{
      "@context" = "https://schema.org"
      "@type" = "BlogPosting"
      headline = $titleWithoutBrand
      description = $description
      url = $canonical
      mainEntityOfPage = $canonical
      inLanguage = "sk-SK"
      author = [ordered]@{
        "@type" = "Organization"
        name = "YABI Studio"
        url = "https://www.yabi.sk"
      }
      publisher = $organization
      image = @($image)
    }

    if ($datePublished) {
      $schema.datePublished = $datePublished
    }

    if ($dateModified) {
      $schema.dateModified = $dateModified
    }

    if ($articleKeywords.Count -gt 0) {
      $schema.keywords = $articleKeywords
    }

    return $schema
  }

  if ($relativePath -like "featured-projects/*") {
    $projectKeywords = Parse-Chips $content "chip_block"
    $schema = [ordered]@{
      "@context" = "https://schema.org"
      "@type" = "CreativeWork"
      name = $titleWithoutBrand
      description = $description
      url = $canonical
      mainEntityOfPage = $canonical
      inLanguage = "sk-SK"
      creator = [ordered]@{
        "@type" = "Organization"
        name = "YABI Studio"
        url = "https://www.yabi.sk"
      }
      publisher = $organization
      isPartOf = [ordered]@{
        "@type" = "CollectionPage"
        name = "Projekty"
        url = "https://www.yabi.sk/projekty"
      }
      image = @($image)
    }

    if ($datePublished) {
      $schema.datePublished = $datePublished
    }

    if ($dateModified) {
      $schema.dateModified = $dateModified
    }

    if ($projectKeywords.Count -gt 0) {
      $schema.keywords = $projectKeywords
    }

    return $schema
  }

  $schema = [ordered]@{
    "@context" = "https://schema.org"
    "@type" = $pageType
    name = $titleWithoutBrand
    description = $description
    url = $canonical
    inLanguage = "sk-SK"
    about = [ordered]@{
      "@type" = "Organization"
      name = "YABI Studio"
      url = "https://www.yabi.sk"
    }
  }

  if ($image) {
    $schema.image = @($image)
  }

  if ($hasFaq) {
    $schema.mainEntity = $faqItems
  }

  return $schema
}

function Set-EmailInputAttributes([string]$content) {
  return [regex]::Replace(
    $content,
    '(?is)<input\b(?=[^>]*type="email")[^>]*>',
    {
      param($match)

      $tag = $match.Value

      if ($tag -notmatch 'autocomplete=') {
        $tag = $tag -replace 'type="email"', 'autocomplete="email" type="email"'
      }

      if ($tag -notmatch 'inputmode=') {
        $tag = $tag -replace 'type="email"', 'type="email" inputmode="email"'
      }

      if ($tag -notmatch 'aria-label=') {
        $tag = $tag -replace 'type="email"', 'type="email" aria-label="E-mailov&aacute; adresa"'
      }

      return $tag
    }
  )
}

$rootPath = (Get-Location).Path.TrimEnd("\")
$allHtmlFiles = Get-ChildItem -Recurse -Filter *.html | Sort-Object FullName
$overrides = @{
  "blogs/blog-list.html" = @{
    Title = "Všetko čo potrebujete vedieť o webdizajne | YABI Studio"
    Description = "Pomáhame vám pochopiť webdizajn jednoducho a prakticky. Od základov až po pokročilé tipy, ktoré zlepšia váš web aj biznis."
    Image = "https://www.yabi.sk/images/articles/webdesign-dictionary/webdesign-dictionary-thumbnail.jpg"
    OgType = "website"
  }
  "featured-projects/devio-website.html" = @{
    Title = "Devio Website | Projekt YABI Studio"
    Description = "Interaktívny vzdelávací nástroj pre začínajúcich developerov, ktorý sprístupňuje programovanie prostredníctvom štruktúrovaných lekcií a gamifikovaného postupu."
    Image = "https://www.yabi.sk/images/projects/devio-website/devio-project-main-cover.png"
    OgType = "website"
  }
  "featured-projects/lumi-app.html" = @{
    Title = "Lumi App | Projekt YABI Studio"
    Description = "Mobilná aplikácia, ktorá umožňuje návštevníkom kina objednať si a prispôsobiť občerstvenie vopred, čím skracuje čakanie a zlepšuje celkový zážitok z návštevy kina."
    Image = "https://www.yabi.sk/images/projects/lumi-app/lumi-project-main-cover.png"
    OgType = "website"
  }
  "featured-projects/pathfinder-app.html" = @{
    Title = "Pathfinder App | Projekt YABI Studio"
    Description = "Platforma Pathfinder prepája uchádzačov o zamestnanie, stáž či dobrovoľníctvo s relevantnými príležitosťami cez premyslený a intuitívny produktový dizajn."
    Image = "https://www.yabi.sk/images/projects/pathfinder-app/pathfinder-project-main-cover.png"
    OgType = "website"
  }
}

foreach ($file in $allHtmlFiles) {
  $relativePath = Get-RelativeUnixPath $file.FullName $rootPath
  $content = Get-Content -LiteralPath $file.FullName -Raw

  $content = $content -replace '\.\.//js/webfont\.js', '../js/webfont.js'
  $content = $content -replace 'id="primary-button"', ''
  $content = $content -replace 'Viacej o projekte', 'Viac o projekte'
  $content = $content -replace '7 Septemer 2023', '7 September 2023'
  $content = $content -replace 'N&aacute;&scaron; ciel', 'N&aacute;&scaron; cie&#318;'
  $content = $content -replace 'aria-label="Language switcher"', 'aria-label="Prepínač jazyka"'
  $content = $content -replace 'Thank you! Your submission has been received!', 'Ďakujeme. Vaša správa bola úspešne odoslaná.'
  $content = $content -replace 'Oops! Something went wrong while submitting the form\.', 'Odoslanie sa nepodarilo. Skúste to prosím znova.'
  $content = $content -replace '<a class="yabi-logo" href="/index.html">', '<span class="yabi-logo" aria-hidden="true">'
  $content = $content -replace '</a></div></a>', '</span></div></a>'
  $content = $content -replace '<a class="ig-logo" href="#">', '<span class="ig-logo" aria-hidden="true">'
  $content = $content -replace '<a class="be-logo" href="#">', '<span class="be-logo" aria-hidden="true">'
  $content = $content -replace '<a id="w-node-_4787462d-c649-f22c-db57-108c2225e8a6-2225e88f" href="#" class="link footer">Obchodn&eacute; podmienky</a>', '<span id="w-node-_4787462d-c649-f22c-db57-108c2225e8a6-2225e88f" class="link footer inactive-link" aria-disabled="true">Obchodn&eacute; podmienky</span>'
  $content = $content -replace 'Responz&iacute;vna webov&aacute; str&aacute;nka pre Devio &ndash; vzdel&aacute;vaciu platformu ur&#269;en&uacute; pre za&#269;&iacute;naj&uacute;cich developerov, ktor&aacute; spr&iacute;stup&#328;uje z&aacute;klady programovania j', 'Responz&iacute;vna webov&aacute; str&aacute;nka pre Devio &ndash; vzdel&aacute;vaciu platformu ur&#269;en&uacute; pre za&#269;&iacute;naj&uacute;cich developerov, ktor&aacute; spr&iacute;stup&#328;uje z&aacute;klady programovania jednoducho a preh&#318;adne.'

  $content = [regex]::Replace(
    $content,
    '(?is)<a([^>]*?)href="#"([^>]*class="close_div w-inline-block"[^>]*)>(.*?)</a>(\s*<a href="/o-nas\.html")',
    '<button$1type="button"$2>$3</button>$4'
  )

  $content = [regex]::Replace(
    $content,
    '(?is)<a([^>]*?)href="#"([^>]*class="link-3"[^>]*)>MENU</a>(\s*<div class="menu_wrap">)',
    '<button$1type="button"$2>MENU</button>$3'
  )

  $content = Set-EmailInputAttributes $content

  if ($relativePath -eq "kontaktujte-nas.html" -and $content -notmatch 'textarea[^>]*aria-label=') {
    $content = $content -replace '(<textarea[^>]*name="field"[^>]*class="text_field text_area w-input")', '$1 aria-label="Správa"'
  }

  if ($relativePath -like "featured-projects/*") {
    $projectCardPattern = '<a href="#" class="primary_button w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac o projekte</div><div data-w-id="f197914b-4a7e-8a85-970b-e14b4f95daa7" class="medium-uppercase-xs second-button-text">Viac o projekte</div></div></a>'
    $content = $content -replace '<a href="#" class="primary_button primary-white w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac projektov</div><div class="medium-uppercase-xs second-button-text">Viac projektov</div></div></a>', '<a href="/projekty.html" class="primary_button primary-white w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac projektov</div><div class="medium-uppercase-xs second-button-text">Viac projektov</div></div></a>'
    $content = [regex]::Replace($content, $projectCardPattern, '<a href="/featured-projects/devio-website.html" class="primary_button w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac o projekte</div><div data-w-id="f197914b-4a7e-8a85-970b-e14b4f95daa7" class="medium-uppercase-xs second-button-text">Viac o projekte</div></div></a>', 1)
    $content = [regex]::Replace($content, $projectCardPattern, '<a href="/featured-projects/lumi-app.html" class="primary_button w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac o projekte</div><div data-w-id="f197914b-4a7e-8a85-970b-e14b4f95daa7" class="medium-uppercase-xs second-button-text">Viac o projekte</div></div></a>', 1)
    $content = [regex]::Replace($content, $projectCardPattern, '<a href="/featured-projects/pathfinder-app.html" class="primary_button w-inline-block"><div class="button_text_wrap"><div class="medium-uppercase-xs first-button-text">Viac o projekte</div><div data-w-id="f197914b-4a7e-8a85-970b-e14b4f95daa7" class="medium-uppercase-xs second-button-text">Viac o projekte</div></div></a>', 1)
  }

  $canonical = Build-Canonical $relativePath
  $currentTitle = Decode-Html (Get-MatchValue $content '<title>(.*?)</title>')
  $currentDescription = Decode-Html (Get-MatchValue $content '<meta[^>]*name="description"[^>]*content="([^"]*)"')

  if (-not $currentDescription) {
    $currentDescription = Decode-Html (Get-MatchValue $content '<meta[^>]*content="([^"]*)"[^>]*name="description"')
  }

  $currentImage = Decode-Html (Get-MatchValue $content '<meta[^>]*property="og:image"[^>]*content="([^"]*)"')

  if (-not $currentImage) {
    $currentImage = Decode-Html (Get-MatchValue $content '<meta[^>]*content="([^"]*)"[^>]*property="og:image"')
  }

  $title = $currentTitle
  $description = $currentDescription
  $image = $currentImage
  $ogType = "website"

  if ($relativePath -like "articles/*") {
    $ogType = "article"
  }

  if ($overrides.ContainsKey($relativePath)) {
    $override = $overrides[$relativePath]

    if ($override.Title) {
      $title = $override.Title
    }

    if ($override.Description) {
      $description = $override.Description
    }

    if ($override.Image) {
      $image = $override.Image
    }

    if ($override.OgType) {
      $ogType = $override.OgType
    }
  }

  $content = Set-TitleTag $content $title
  $content = Set-MetaTag $content "name" "description" $description
  $content = Set-MetaTag $content "property" "og:title" $title
  $content = Set-MetaTag $content "property" "og:description" $description
  $content = Set-MetaTag $content "property" "og:image" $image
  $content = Set-MetaTag $content "property" "twitter:title" $title
  $content = Set-MetaTag $content "property" "twitter:description" $description
  $content = Set-MetaTag $content "property" "twitter:image" $image
  $content = Set-MetaTag $content "property" "og:type" $ogType
  $content = Set-LinkTag $content "canonical" $canonical

  $schema = Build-PageSchema -relativePath $relativePath -title $title -description $description -canonical $canonical -image $image -content $content
  $content = Set-JsonLd $content $schema

  Set-Content -LiteralPath $file.FullName -Value $content -Encoding utf8
}
