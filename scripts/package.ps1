$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = Split-Path -Parent $PSScriptRoot
$archivePath = Join-Path $projectRoot 'coco-music-hall.zip'
$allowedFolders = @('api','lib','public','scripts','sql','tests')
$allowedFiles = @('package.json','package-lock.json','server.js','vercel.json','README.md','VERIFICATION.md','.env.example','.gitignore')
$sourceFiles = @()
foreach ($folder in $allowedFolders) { $sourceFiles += Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -File -Recurse }
foreach ($file in $allowedFiles) { $sourceFiles += Get-Item -LiteralPath (Join-Path $projectRoot $file) }
$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
$zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $sourceFiles) {
    $entryName = $file.FullName.Substring($projectRoot.Length + 1).Replace('\','/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName) | Out-Null
  }
} finally { $zip.Dispose(); $stream.Dispose() }
Write-Output $archivePath
