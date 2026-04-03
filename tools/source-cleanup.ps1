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

function Get-MatchValue([string]$content, [string]$pattern, [int]$groupIndex = 1) {
  $options = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  $match = [regex]::Match($content, $pattern, $options)

  if (-not $match.Success) {
    return ""
  }

  return $match.Groups[$groupIndex].Value
}

function Set-TitleTag([string]$content, [string]$title) {
  $replacement = "<title>$(Encode-Html $title)</title>"

  if ($content -match "(?is)<title>.*?</title>") {
    return [regex]::Replace($content, "(?is)<title>.*?</title>", $replacement, 1)
  }

  return $content
}

function Set-MetaTag([string]$content, [string]$attributeName, [string]$attributeValue, [string]$metaValue) {
  $replacement = "<meta content=""$(Encode-Html $metaValue)"" $attributeName=""$attributeValue"">"
  $pattern = "<meta[^>]*$attributeName=""$([regex]::Escape($attributeValue))""[^>]*>"

  if ($content -match $pattern) {
    return [regex]::Replace($content, $pattern, $replacement, 1)
  }

  return $content
}

function Set-JsonLdObject([string]$content, [object]$schema) {
  $json = $schema | ConvertTo-Json -Depth 100
  $replacement = "<script type=""application/ld+json"">`r`n$json`r`n</script>"

  if ($content -match '(?is)<script type="application/ld\+json">.*?</script>') {
    return [regex]::Replace($content, '(?is)<script type="application/ld\+json">.*?</script>', $replacement, 1)
  }

  return $content
}

function Update-JsonLdText([string]$content, [hashtable]$updates) {
  $options = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline
  $match = [regex]::Match($content, '<script type="application/ld\+json">(.*?)</script>', $options)

  if (-not $match.Success) {
    return $content
  }

  try {
    $schema = $match.Groups[1].Value | ConvertFrom-Json -Depth 100
  } catch {
    return $content
  }

  foreach ($entry in $updates.GetEnumerator()) {
    if ($schema.PSObject.Properties[$entry.Key]) {
      $schema.($entry.Key) = $entry.Value
    }
  }

  return Set-JsonLdObject $content $schema
}

function Normalize-EmailInputs([string]$content) {
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

function Normalize-BackArrowClipPaths([string]$content) {
  $script:backArrowClipCounter = 0

  return [regex]::Replace(
    $content,
    '(?is)<svg\b[^>]*viewbox="0 0 12 12"[^>]*>.*?clip0_2467_4218.*?clip1_2467_4218.*?</svg>',
    {
      param($match)

      $script:backArrowClipCounter++
      $suffix = "_$($script:backArrowClipCounter)"
      $svg = $match.Value -replace 'clip0_2467_4218', "clip0_2467_4218$suffix"
      $svg = $svg -replace 'clip1_2467_4218', "clip1_2467_4218$suffix"
      return $svg
    }
  )
}

$rootPath = (Get-Location).Path.TrimEnd("\")
$allHtmlFiles = Get-ChildItem -Recurse -Filter *.html | Sort-Object FullName
$inactiveLanguageSwitcher = '<div class="language_switcher" aria-label="Prep&iacute;na&#269; jazyka zatia&#318; nie je akt&iacute;vny"><button type="button" class="language_switch_link" disabled aria-disabled="true" tabindex="-1">SK</button><span class="language_switch_separator">/</span><button type="button" class="language_switch_link" disabled aria-disabled="true" tabindex="-1">EN</button></div>'
$overrides = @{
  "index.html" = @{
    Description = Decode-Html "Navrhujeme a staviame modern&eacute; weby vo Webflowe. Sp&aacute;jame strat&eacute;giu, UX dizajn a v&yacute;kon, aby v&aacute;&scaron; web r&aacute;stol spolu s biznisom."
  }
  "o-nas.html" = @{
    Description = Decode-Html "Sme YABI Studio, Webflow &scaron;t&uacute;dio z Bratislavy. Sp&aacute;jame strat&eacute;giu, UX a prec&iacute;znu realiz&aacute;ciu, aby weby vyzerali dobre a prin&aacute;&scaron;ali v&yacute;sledky."
  }
  "kontaktujte-nas.html" = @{
    Description = Decode-Html "Ozvite sa YABI Studiu a za&#269;nime v&aacute;&scaron; nov&yacute; web vo Webflowe. Radi premen&iacute;me v&iacute;ziu na funk&#269;n&eacute; digit&aacute;lne rie&scaron;enie."
  }
  "projekty.html" = @{
    Description = Decode-Html "Pozrite si uk&aacute;&#382;ky webov a digit&aacute;lnych rie&scaron;en&iacute; od YABI Studia. Projekty sp&aacute;jaj&uacute; strat&eacute;giu, UX a vizu&aacute;lny dizajn s d&ocirc;razom na v&yacute;sledok."
  }
  "sluzby.html" = @{
    Description = Decode-Html "Navrhujeme a realizujeme weby vo Webflowe, UX dizajn a digit&aacute;lnu strat&eacute;giu. Staviame rie&scaron;enia, ktor&eacute; podporuj&uacute; rast aj konverzie."
  }
  "blogs/blog-list.html" = @{
    Title = Decode-Html "V&scaron;etko &#269;o potrebujete vedie&#357; o webdizajne | YABI Studio"
    Description = Decode-Html "Pom&aacute;hame v&aacute;m pochopi&#357; webdizajn jednoducho a prakticky. Od z&aacute;kladov a&#382; po pokro&#269;il&eacute; tipy, ktor&eacute; zlep&scaron;ia v&aacute;&scaron; web aj biznis."
  }
  "articles/webdesign-dictionary.html" = @{
    Description = Decode-Html "Praktick&yacute; slovn&iacute;k webdesignu, ktor&yacute; zrozumite&#318;ne vysvet&#318;uje z&aacute;kladn&eacute; pojmy, procesy a prvky modern&eacute;ho webu."
  }
  "featured-projects/devio-website.html" = @{
    Description = Decode-Html "Responz&iacute;vna vzdel&aacute;vacia platforma pre za&#269;&iacute;naj&uacute;cich developerov, ktor&aacute; spr&iacute;stup&#328;uje z&aacute;klady programovania cez preh&#318;adn&yacute; UX a &scaron;trukt&uacute;rovan&yacute; obsah."
  }
  "featured-projects/lumi-app.html" = @{
    Description = Decode-Html "Mobiln&aacute; aplik&aacute;cia pre kino, ktor&aacute; umo&#382;&#328;uje objedna&#357; si a prisp&ocirc;sobi&#357; ob&#269;erstvenie vopred, skracuje &#269;akanie a zlep&scaron;uje z&aacute;&#382;itok z n&aacute;v&scaron;tevy."
  }
  "featured-projects/pathfinder-app.html" = @{
    Description = Decode-Html "Pathfinder prep&aacute;ja uch&aacute;dza&#269;ov o pr&aacute;cu, st&aacute;&#382;e a dobrovo&#318;n&iacute;ctvo s relevantn&yacute;mi pr&iacute;le&#382;itos&#357;ami cez intuit&iacute;vny produktov&yacute; dizajn."
  }
}

foreach ($file in $allHtmlFiles) {
  $relativePath = Get-RelativeUnixPath $file.FullName $rootPath
  $content = Get-Content -LiteralPath $file.FullName -Raw

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

  $content = $content -replace '<nav class="w-layout-blockcontainer nav_container w-container">', '<nav class="w-layout-blockcontainer nav_container w-container" aria-label="Hlavn&aacute; navig&aacute;cia">'
  $content = $content -replace '<div class="menu_mobile">', '<div class="menu_mobile" id="mobile-menu-1" aria-hidden="true" aria-modal="true" role="dialog">'
  $content = $content -replace '<button data-w-id="a3636ed1-4d27-67ce-4856-18e380ca27ea" type="button" class="close_div w-inline-block">', '<button data-w-id="a3636ed1-4d27-67ce-4856-18e380ca27ea" type="button" class="close_div w-inline-block" aria-label="Zavrie&#357; menu">'
  $content = $content -replace '<button data-w-id="5eb6ed82-8716-3cdb-1451-874104497a40" type="button" class="link-3">MENU</button>', '<button data-w-id="5eb6ed82-8716-3cdb-1451-874104497a40" type="button" class="link-3" aria-label="Otvori&#357; menu" aria-controls="mobile-menu-1" aria-expanded="false" aria-haspopup="dialog">MENU</button>'

  $content = [regex]::Replace(
    $content,
    '(?is)<div class="language_switcher"[^>]*>\s*<button type="button" class="language_switch_link"[^>]*>SK</button>\s*<span class="language_switch_separator">/</span>\s*<button type="button" class="language_switch_link"[^>]*>EN</button>\s*</div>',
    $inactiveLanguageSwitcher
  )

  $content = Normalize-BackArrowClipPaths $content
  $content = Normalize-EmailInputs $content
  $content = [regex]::Replace($content, '(?is)(<input\b[^>]*type="email"[^>]*?)aria-label="[^"]*"', '$1aria-label="E-mailov&aacute; adresa"')
  $content = [regex]::Replace($content, '(?is)(<textarea\b[^>]*class="text_field text_area w-input"[^>]*?)aria-label="[^"]*"', '$1aria-label="Spr&aacute;va"')

  if ($relativePath -eq "kontaktujte-nas.html" -and $content -notmatch 'textarea[^>]*aria-label=') {
    $content = $content -replace '(<textarea[^>]*name="field"[^>]*class="text_field text_area w-input")', '$1 aria-label="Spr&aacute;va"'
  }

  if ($relativePath -eq "kontaktujte-nas.html") {
    $content = [regex]::Replace(
      $content,
      '(?is)<div class="w-form-formrecaptcha g-recaptcha g-recaptcha-error g-recaptcha-disabled g-recaptcha-invalid-key"></div>',
      '<div class="w-form-formrecaptcha" hidden aria-hidden="true"></div>'
    )
  }

  $content = [regex]::Replace(
    $content,
    '(?is)<div class="success-message-2 w-form-done"><div>.*?</div></div>',
    '<div class="success-message-2 w-form-done"><div>&#270;akujeme. Va&scaron;a spr&aacute;va bola &uacute;spe&scaron;ne odoslan&aacute;.</div></div>'
  )

  $content = [regex]::Replace(
    $content,
    '(?is)<div class="error_message_2 w-form-fail"><div>.*?</div></div>',
    '<div class="error_message_2 w-form-fail"><div>Odoslanie sa nepodarilo. Sk&uacute;ste to pros&iacute;m znova.</div></div>'
  )

  $content = [regex]::Replace(
    $content,
    '(?is)<div class="sucess_message_wrap w-form-done"><div class="success_message_block">.*?</div></div>',
    '<div class="sucess_message_wrap w-form-done"><div class="success_message_block">&#270;akujeme. Va&scaron;a spr&aacute;va bola &uacute;spe&scaron;ne odoslan&aacute;.</div></div>'
  )

  $content = [regex]::Replace(
    $content,
    '(?is)<div class="error_message w-form-fail"><div>.*?</div></div>',
    '<div class="error_message w-form-fail"><div>Odoslanie sa nepodarilo. Sk&uacute;ste to pros&iacute;m znova.</div></div>'
  )

  $content = [regex]::Replace($content, '(?is)alt="[^"]*"\s+class="image-4"', 'alt="Logo YABI Studio v tvare origami vt&aacute;ka" class="image-4"')
  $content = [regex]::Replace($content, '(?is)alt="[^"]*"\s+class="yabi_values_image"', 'alt="Kol&aacute;&#382; hodn&ocirc;t a procesu YABI Studio" class="yabi_values_image"')
  $content = [regex]::Replace($content, '(?is)alt="[^"]*"\s+class="yabi_tools_image"', 'alt="Uk&aacute;&#382;ka n&aacute;strojov a workflow YABI Studio vo Webflow" class="yabi_tools_image"')
  $content = [regex]::Replace($content, '(?is)alt="[^"]*"\s+class="article_image_1-2"', 'alt="" class="article_image_1-2"')
  $content = [regex]::Replace($content, '(?is)(<img\b[^>]*?)alt="[^"]*"([^>]*class="article_image")', '$1alt=""$2')
  $content = [regex]::Replace($content, '(?is)(<img\b[^>]*?)alt="[^"]*"([^>]*class="featured_article_image")', '$1alt=""$2')
  $content = [regex]::Replace($content, '(?is)(<img\b[^>]*?)alt="[^"]*"([^>]*class="cms_thumbnail")', '$1alt=""$2')
  $content = [regex]::Replace($content, '(?is)(<img\b[^>]*?)alt="[^"]*"([^>]*class="icon_cms")', '$1alt=""$2')
  $content = [regex]::Replace($content, '(?is)alt="[^"]*"\s+src="images/about/(all-in-one-webflow-icon|content-control-webflow-icon|web-performance-icon)\.svg"', 'alt="" src="images/about/$1.svg"')

  if ($relativePath -eq "sluzby.html") {
    $content = [regex]::Replace($content, '(?is)(<img\b[^>]*?)alt="[^"]*"([^>]*class="image-3")', '$1alt=""$2')
  }

  $currentTitle = Decode-Html (Get-MatchValue $content '<title>(.*?)</title>')
  $currentDescription = Decode-Html (Get-MatchValue $content '<meta[^>]*name="description"[^>]*content="([^"]*)"')

  if (-not $currentDescription) {
    $currentDescription = Decode-Html (Get-MatchValue $content '<meta[^>]*content="([^"]*)"[^>]*name="description"')
  }

  $title = $currentTitle
  $description = $currentDescription

  if ($overrides.ContainsKey($relativePath)) {
    $override = $overrides[$relativePath]

    if ($override.Title) {
      $title = $override.Title
    }

    if ($override.Description) {
      $description = $override.Description
    }
  }

  $description = Normalize-DescriptionLength $description
  $content = Set-TitleTag $content $title
  $content = Set-MetaTag $content "name" "description" $description
  $content = Set-MetaTag $content "property" "og:title" $title
  $content = Set-MetaTag $content "property" "og:description" $description
  $content = Set-MetaTag $content "property" "twitter:title" $title
  $content = Set-MetaTag $content "property" "twitter:description" $description

  $jsonUpdates = @{
    description = $description
  }

  if ($title) {
    $jsonUpdates.name = ($title -replace '\s+\|\s+YABI Studio$', '' -replace '\s+\|\s+Projekt YABI Studio$', '')
    $jsonUpdates.headline = ($title -replace '\s+\|\s+YABI Studio$', '' -replace '\s+\|\s+Projekt YABI Studio$', '')
  }

  $content = Update-JsonLdText $content $jsonUpdates

  if ($description) {
    $descriptionJson = ($description | ConvertTo-Json -Compress)
    $content = [regex]::Replace($content, '(?is)("description"\s*:\s*)"[^"]*"', ('$1' + $descriptionJson), 1)
  }

  if ($relativePath -eq "blogs/blog-list.html") {
    $blogListSchema = [ordered]@{
      "@context" = "https://schema.org"
      "@type" = "CollectionPage"
      name = Decode-Html "V&scaron;etko &#269;o potrebujete vedie&#357; o webdizajne"
      description = Decode-Html "Pom&aacute;hame v&aacute;m pochopi&#357; webdizajn jednoducho a prakticky. Od z&aacute;kladov a&#382; po pokro&#269;il&eacute; tipy, ktor&eacute; zlep&scaron;ia v&aacute;&scaron; web aj biznis."
      url = "https://www.yabi.sk/blogs/blog-list"
      inLanguage = "sk-SK"
      about = [ordered]@{
        "@type" = "Organization"
        name = "YABI Studio"
        url = "https://www.yabi.sk"
      }
      image = @("https://www.yabi.sk/images/articles/webdesign-dictionary/webdesign-dictionary-thumbnail.jpg")
    }

    $content = Set-JsonLdObject $content $blogListSchema
  }

  Set-Content -LiteralPath $file.FullName -Value $content -Encoding utf8
}
