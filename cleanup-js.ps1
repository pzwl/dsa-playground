# More comprehensive TypeScript to JavaScript conversion
$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove interface definitions (multi-line)
    $content = $content -replace "(?s)interface\s+\w+\s*\{.*?\}", ""
    
    # Remove type definitions
    $content = $content -replace "(?s)type\s+\w+\s*=.*?;", ""
    
    # Remove export type statements
    $content = $content -replace "export\s+type\s+[^;]+;", ""
    
    # Remove type imports
    $content = $content -replace "import\s+type\s+[^;]+;", ""
    
    # Remove type annotations on parameters and variables
    $content = $content -replace ":\s*[\w\[\]<>|&\s]+(?=[\s,\)\]=])", ""
    
    # Remove generic type parameters
    $content = $content -replace "<[\w\[\],\s]+>(?=\s*\()", ""
    
    # Remove 'as Type' assertions
    $content = $content -replace "\s+as\s+\w+", ""
    
    # Remove standalone type lines that might remain
    $content = $content -replace "^\s*[\w\s]+;\s*$", "" -split "`n" | Where-Object { $_.Trim() -ne "" } | Join-String -Separator "`n"
    
    # Clean up multiple empty lines
    $content = $content -replace "(`n\s*){3,}", "`n`n"
    
    Set-Content $file.FullName $content -Encoding UTF8
    Write-Host "Cleaned $($file.FullName)"
}
