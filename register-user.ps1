# Register Admin User Script

$email = "vikash123@example.com"
$password = "Test@123"
$firstName = "Vikash"
$lastName = "Nagar"

Write-Host "Registering user: $email" -ForegroundColor Yellow

$body = @{
    email = $email
    password = $password
    firstName = $firstName
    lastName = $lastName
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing

    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    $response | ConvertTo-Json | Write-Host
    
    Write-Host ""
    Write-Host "You can now login with:" -ForegroundColor Green
    Write-Host "Email: $email"
    Write-Host "Password: $password"
}
catch {
    Write-Host "❌ Error registering user:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
