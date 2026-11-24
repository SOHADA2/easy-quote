# 아이콘 만들기: powershell -File tools\make-icons.ps1 -Text 대성 -Out daesung   (Text 없으면 '견적', Out 없으면 루트)
param([string]$Text = "", [string]$Out = "")
$root = Split-Path -Parent $PSScriptRoot
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$tmp = "$env:TEMP\eq-icon-src.png"
$url = "file:///" + ($root.Replace([char]92,'/')) + "/tools/icon.html"
if ($Text) { $url += "?t=" + [uri]::EscapeDataString($Text) }
& $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=512,512 --screenshot="$tmp" $url 2>$null | Out-Null
Start-Sleep -Milliseconds 500
Add-Type -AssemblyName System.Drawing
$dir = if ($Out) { Join-Path $root $Out } else { $root }
New-Item -ItemType Directory -Force $dir | Out-Null
$src = [System.Drawing.Image]::FromFile($tmp)
foreach ($s in 512,192,180) {
  $bmp = New-Object System.Drawing.Bitmap $s, $s
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $s, $s); $g.Dispose()
  $bmp.Save("$dir\icon-$s.png", [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
$src.Dispose()
"아이콘 만듦: $dir"
