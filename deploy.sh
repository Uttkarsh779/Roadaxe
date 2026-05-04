#!/bin/bash

# Ignore errors
set +e

echo "🚀 Starting RoadX Deployment..."

export DEBIAN_FRONTEND=noninteractive

# 1. Update and Install Dependencies
echo "📦 Updating system and installing dependencies..."
apt-get update -y || true
apt-get install -y curl git nginx build-essential

# 2. Install Node.js 20
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# 3. Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "🟢 Installing PM2..."
    npm install -g pm2
fi

# 4. Prepare Directory
echo "📂 Preparing web directory..."
mkdir -p /var/www/roadx
cd /var/www/roadx

# 5. Clone/Update Code
if [ -d ".git" ]; then
    echo "🔄 Updating code from GitHub..."
    git pull origin main
else
    echo "📥 Cloning code from GitHub..."
    git clone https://github.com/Uttkarsh779/Roadaxe.git .
fi

# 6. Setup Backend
echo "⚙️ Setting up Backend..."
cd backend
npm install --production

# Create .env
cat <<EOT > .env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://uttkarshtiwari03_db_user:9DHy82to6PPh0OyS@cluster0.f3cjdqg.mongodb.net/roadx?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_2026_roadx
JWT_EXPIRES_IN=90d
RAZORPAY_KEY_ID=rzp_live_ZhD9sVedb8aubQ
RAZORPAY_KEY_SECRET=t5ud6GDoafcqFV5ZMBM8KY7v
FRONTEND_URL=https://roadx.in
CLOUDINARY_CLOUD_NAME=dvcjqpq4d
CLOUDINARY_API_KEY=998997975465998
CLOUDINARY_API_SECRET=A2dlsbghwYMeFaGsHTsWsuh8vOw
EOT

# Start/Restart Backend
pm2 delete roadx-backend || true
pm2 start server.js --name "roadx-backend"
pm2 save

# 7. Setup Frontend
echo "⚙️ Setting up Frontend..."
cd ../frontend
npm install
# Set Production API URL
echo "VITE_API_URL=https://roadx.in" > .env
npm run build

# 8. Configure Nginx
echo "🌐 Configuring Nginx..."
cat <<EOT > /etc/nginx/sites-available/roadx
server {
    listen 80;
    server_name roadx.in www.roadx.in;

    root /var/www/roadx/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOT

ln -sf /etc/nginx/sites-available/roadx /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default || true

nginx -t
systemctl restart nginx

# 9. SSL with Certbot
echo "🔒 Setting up SSL..."
apt-get install -y certbot python3-certbot-nginx
# Certbot will be run manually or we can try non-interactively if email is provided
# certbot --nginx -d roadx.in -d www.roadx.in --non-interactive --agree-tos -m roadx@roadx.in

echo "✅ Deployment Complete! Visit http://roadx.in"
