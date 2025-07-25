# PowerShell script to convert TypeScript files to JavaScript
$files = @(
    "src\app\autocomplete-system\page.tsx",
    "src\app\browser-history\page.tsx", 
    "src\app\gps-navigation\page.tsx",
    "src\app\social-network\page.tsx",
    "src\app\undo-redo-editor\page.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Remove TypeScript type annotations and interfaces
        $content = $content -replace ":\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=[\s,\)\]=])", ""
        $content = $content -replace "interface\s+\w+\s*\{[^}]*\}", ""
        $content = $content -replace "type\s+\w+\s*=\s*[^;]+;", ""
        $content = $content -replace "<[^>]+>(?=\s*\()", ""
        $content = $content -replace "export\s+type\s+[^;=]+[;=][^}]*}", ""
        $content = $content -replace "import\s+type\s+[^;]+;", ""
        $content = $content -replace "as\s+\w+", ""
        
        # Create new .jsx file
        $newFile = $file -replace "\.tsx$", ".jsx"
        Set-Content $newFile $content -Encoding UTF8
        
        # Remove old .tsx file
        Remove-Item $file
        
        Write-Host "Converted $file to $newFile"
    }
}
