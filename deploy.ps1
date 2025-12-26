# Deploy script for sahtee-hospital-dashboard
$ErrorActionPreference = "Stop"

# Get the script directory (where this file is located)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the script directory
Set-Location $scriptPath

Write-Host "Current directory: $(Get-Location)"
Write-Host "Running npm run deploy..."

# Run deploy
npm run deploy

