# 🌐 Dabba Roti – Hostinger Live Production Deployment Guide

This guide covers everything needed to deploy **Dabba Roti** ([www.dabbaroti.com](https://www.dabbaroti.com)) live on **Hostinger**.

---

## 📌 Available Deployment Methods on Hostinger

Hostinger supports two main deployment environments for full-stack Node.js + React applications:
- **Option A: Hostinger Shared / Cloud Hosting (via hPanel Node.js Selector)** *(Easiest & Most Popular)*
- **Option B: Hostinger VPS (Ubuntu / Debian with PM2 & Nginx)** *(Best for High Traffic & Full Control)*

---

## 🚀 Option A: Hostinger Cloud / Web Hosting (via hPanel)

Hostinger's hPanel includes a built-in **Node.js** application manager.

### Step 1: Push Code or Upload to Hostinger
1. In Hostinger hPanel, go to **Websites** → Select your domain (`dabbaroti.com`).
2. You can either:
   - **Method 1 (Git - Recommended)**: Go to **Advanced** → **Git**.
     - Repository: `https://github.com/miss-seema/dabbaroti.git`
     - Branch: `main`
     - Install directory: `/public_html` (or a subfolder like `/app`)
     - Click **Create & Deploy**.
   - **Method 2 (File Manager)**: Zip your project files (excluding `node_modules`), upload to `public_html` in File Manager, and extract.

### Step 2: Configure the Node.js Application in hPanel
1. In hPanel, search for **Node.js** or go to **Advanced** → **Node.js**.
2. Click **Create Application**:
   - **Node.js version**: Choose `20.x` or `18.x`.
   - **Application mode**: `Production`
   - **Application root**: `/home/uXXXX/domains/dabbaroti.com/public_html`
   - **Application startup file**: `server.js` *(A root `server.js` has already been created in this repository)*
3. Click **Create**.

### Step 3: Install Dependencies & Build
1. In the Node.js manager interface, click **NPM Install** (or access terminal via SSH).
2. Run the build command in the terminal or SSH:
   ```bash
   npm run build
   ```
   *(This compiles the React client to `dist/` with `.htaccess` automatically included)*.

### Step 4: Environment Variables in hPanel
Under **Environment Variables** in the Node.js application section, add:
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dabbaroti?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_random_jwt_secret_key_2026
RAZORPAY_KEY_ID=your_live_razorpay_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_key_secret
```

### Step 5: Start Application
Click **Start** or **Restart** on the Node.js panel. The app will be live on your domain!

---

## 🖥️ Option B: Hostinger VPS (Ubuntu / Debian)

If you are using a Hostinger VPS (KVM 1 / KVM 2 / KVM 4), follow these steps:

### 1. Connect to VPS via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### 2. Install Node.js, Git, Nginx & PM2
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Install PM2 globally
sudo npm install -g pm2
```

### 3. Clone Repository
```bash
cd /var/www
git clone https://github.com/miss-seema/dabbaroti.git
cd dabbaroti
```

### 4. Create Production Environment File (`.env`)
```bash
cp server/.env.example server/.env
nano server/.env
```
Update with your live credentials:
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dabbaroti?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key
RAZORPAY_KEY_ID=rzp_live_your_actual_key
RAZORPAY_KEY_SECRET=your_actual_secret
```

### 5. Run the Automated Hostinger Deployment Script
We included an automated deployment script `deploy-hostinger.sh`:
```bash
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```
This script automatically:
- Installs all dependencies across root, server, and client.
- Builds the optimized production React bundle.
- Starts or reloads the application using PM2 (`ecosystem.config.js`).

### 6. Configure PM2 Startup on Boot
```bash
pm2 save
pm2 startup
# Copy and run the generated command shown by PM2
```

### 7. Configure Nginx Reverse Proxy & SSL
1. Copy the included Nginx configuration:
   ```bash
   sudo cp hostinger-nginx.conf /etc/nginx/sites-available/dabbaroti
   sudo ln -s /etc/nginx/sites-available/dabbaroti /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

2. Install Free SSL Certificate via Let's Encrypt (Certbot):
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d dabbaroti.com -d www.dabbaroti.com
   ```

---

## 🗄️ Database Setup (MongoDB Atlas)

Since Hostinger shared hosting does not run a local MongoDB service, use **MongoDB Atlas** (100% Free M0 Tier):
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up/log in.
2. Click **Create a Database** → Select **M0 (Free)**.
3. Under **Security** → **Database Access**, create a user (e.g. `dabbaroti_admin`) and password.
4. Under **Network Access**, click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Hostinger can connect.
5. Click **Connect** → **Drivers** (Node.js) → Copy the connection string:
   ```
   mongodb+srv://dabbaroti_admin:<password>@cluster0.abcde.mongodb.net/dabbaroti?retryWrites=true&w=majority
   ```
6. Add this string as `MONGODB_URI` in your production environment variables.

---

## 📁 Key Files Added for Hostinger

| File | Purpose |
| :--- | :--- |
| **[client/public/.htaccess](file:///Users/seemadevi/Projects/dabbaroti/client/public/.htaccess)** | Apache/LiteSpeed URL rewrites, SPA routing (prevents 404 on refresh), Gzip compression, and security headers. Automatically bundled into `dist/`. |
| **[server.js](file:///Users/seemadevi/Projects/dabbaroti/server.js)** | Application root entry point required by Hostinger hPanel Node.js Selector. |
| **[ecosystem.config.js](file:///Users/seemadevi/Projects/dabbaroti/ecosystem.config.js)** | Production cluster configuration for PM2 process manager on Hostinger VPS. |
| **[hostinger-nginx.conf](file:///Users/seemadevi/Projects/dabbaroti/hostinger-nginx.conf)** | Production Nginx reverse proxy configuration with caching, gzip, and SPA fallback. |
| **[deploy-hostinger.sh](file:///Users/seemadevi/Projects/dabbaroti/deploy-hostinger.sh)** | Executable bash deployment script for one-command installation, build, and PM2 restart. |
