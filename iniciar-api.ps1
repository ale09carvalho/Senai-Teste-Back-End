# NutriVitta IMC API - Script de inicialização
$nodePath = "C:\Users\Power\.config\herd\bin\nvm\v25.9.0"

if (-not (Test-Path "$nodePath\node.exe")) {
    Write-Host "ERRO: Node.js nao encontrado em $nodePath" -ForegroundColor Red
    Write-Host "Tente ativar pelo Herd: nvm use 25.9.0" -ForegroundColor Yellow
    exit 1
}

$env:PATH = "$nodePath;" + $env:PATH

Set-Location $PSScriptRoot

Write-Host "Node: $(node --version)" -ForegroundColor Green
Write-Host "NPM:  $(npm --version)" -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

Write-Host "Iniciando API NutriVitta em http://localhost:3000" -ForegroundColor Cyan
npm run dev
