Write-Host "Starting simple static file server at http://localhost:8080"
Write-Host "Press Ctrl+C to stop."

$path = "$PSScriptRoot"
$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:8080/")
$http.Start()

while ($http.IsListening) {
    $context = $http.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $filename = $request.Url.LocalPath.TrimStart('/')
    if ($filename -eq "") { $filename = "standalone_demo.html" }
    
    $filepath = Join-Path $path $filename
    
    if (Test-Path $filepath) {
        $content = [System.IO.File]::ReadAllBytes($filepath)
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
        Write-Host "Served: $filename" -ForegroundColor Green
    } else {
        $response.StatusCode = 404
        Write-Host "404 Not Found: $filename" -ForegroundColor Red
    }
    
    $response.Close()
}
