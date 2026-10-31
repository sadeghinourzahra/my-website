# Sticky Notes Board Deployment Script
# Target: ubuntu@94.183.176.108

Write-Host "Syncing files to server..." -ForegroundColor Cyan
scp index.html style.css app.js ubuntu@94.183.176.108:/var/www/sticky/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Reloading Nginx..." -ForegroundColor Cyan
    ssh ubuntu@94.183.176.108 "sudo systemctl reload nginx"
    Write-Host "Deployment completed successfully! URL: http://94.183.176.108/" -ForegroundColor Green
} else {
    Write-Host "Failed to sync files to server." -ForegroundColor Red
}
