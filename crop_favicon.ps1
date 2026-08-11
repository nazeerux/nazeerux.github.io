Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\NASEER\.gemini\antigravity-ide\brain\d6269c4a-1737-4684-821d-26b2090a7bc2\media__1786466076545.png'
$dstPath = 'd:\portfolio\favicon.png'

$img = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $img.Width
$height = $img.Height

# Center crop box around face (56% X, 28% Y)
$cropDim = [int]([Math]::Min($width, $height) * 0.50)
$cropX = [int]($width * 0.56 - $cropDim / 2)
$cropY = [int]($height * 0.28 - $cropDim / 2)

if ($cropX -lt 0) { $cropX = 0 }
if ($cropY -lt 0) { $cropY = 0 }
if ($cropX + $cropDim -gt $width) { $cropX = $width - $cropDim }
if ($cropY + $cropDim -gt $height) { $cropY = $height - $cropDim }

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropDim, $cropDim)
$cropped = $img.Clone($rect, $img.PixelFormat)

$final = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($final)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g.DrawImage($cropped, 0, 0, 512, 512)

$final.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()
$cropped.Dispose()
$final.Dispose()
$g.Dispose()
Write-Host "Favicon successfully created!"
