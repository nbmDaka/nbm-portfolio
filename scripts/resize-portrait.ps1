Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\assets\portrait-src.jpg'
$dst = Join-Path $PSScriptRoot '..\public\portrait.jpg'
$img = [System.Drawing.Image]::FromFile($src)
$w = 768
$h = [int]($img.Height * $w / $img.Width)
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82L)
$bmp.Save($dst, $codec, $params)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
Write-Output "portrait.jpg written: $w x $h"
