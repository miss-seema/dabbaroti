#!/bin/bash
# Dabba Roti - Hostinger Production Deployment Script
set -e

echo "=========================================================="
echo "🍲 Dabba Roti - Deploying to Production on Hostinger"
echo "=========================================================="

# 1. Pull latest code (if using git)
if [ -d ".git" ]; then
  echo "📥 Pulling latest code from GitHub..."
  git pull origin main
fi

# 2. Install Root, Client and Server dependencies
echo "📦 Installing npm dependencies..."
npm install
npm install --prefix server
npm install --prefix client

# 3. Build React Production Client
echo "🔨 Building React production client..."
npm run build

# 4. Check if PM2 is installed, start or reload
if command -v pm2 &> /dev/null; then
  echo "🚀 Managing Node.js process with PM2..."
  if pm2 describe dabbaroti > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production
  else
    pm2 start ecosystem.config.js --env production
    pm2 save
  fi
  echo "✅ Application restarted with PM2!"
else
  echo "⚠️ PM2 not found. You can start the server using: npm start"
fi

echo "=========================================================="
echo "🎉 Dabba Roti successfully deployed and live!"
echo "=========================================================="
