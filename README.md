## Getting started

This README covers the setup for testing purposes only.

### 1. Clone the Repo

```bash
git clone https://github.com/maxonlinux/nooro-take-home-express.git
cd nooro-take-home-express
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MySQL Database with Docker

Pull the latest version of MySQL

```bash
docker pull mysql:latest
```

Setup container

```bash
docker run --name NooroMySQL -e MYSQL_ROOT_PASSWORD=nooro -e MYSQL_USER=nooro -e MYSQL_DATABASE=todo -e MYSQL_PASSWORD=nooro -p 3306:3306 -d mysql:latest
```

Check if container is running

```bash
docker ps
```

### 4. Adjust the `DATABASE_URL` variable in `.env` file as follows

Update the .env file with your database connection string:

```
DATABASE_URL="mysql://nooro:nooro@localhost:3306/todo"
```

### 5. Sync the Database Schema

#### Option 1: Quick Setup (Development Only)

This command will push the Prisma schema to the MySQL database

> [!WARNING]  
> For development and testing purposes only. Do not use the below command in production

```bash
npx prisma db push
```

#### Option 2: A more robust and production-ready approach (using migrations)

Access the MySQL instance and enter root password when prompted

```bash
docker exec -it NooroMySQL mysql -uroot -p
```

Now you have 2 ways:

1. Grant all privileges for user `nooro` on the entire database _(not recommended, not covered by this guide)_
2. Manually create a shadow database _(see instructions below)_

#### Manually create a shadow database

Create new database with name `todo_shadow`

```SQL
CREATE DATABASE todo_shadow;
```

Grant privileges for user `nooro` on shadow database

```SQL
GRANT ALL PRIVILEGES ON todo_shadow.* TO 'nooro'@'%';
FLUSH PRIVILEGES;
```

Exit MySQL shell

```SQL
exit
```

Add the shadow db URL to `.env`

```
SHADOW_DATABASE_URL="mysql://nooro:nooro@localhost:3306/todo_shadow"
```

Modify `schema.prisma`

```
datasource db {
  provider          = "mysql"
  url               = env("DATABASE_URL")
+ shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

Run migration

```bash
npx prisma migrate dev
```

> [!NOTE]  
> For production environments you may want to additionally run the command below

```bash
npx prisma migrate deploy
```

### 6. Build the project

```bash
npm run build
```

### 7. Run the project

```bash
npm run start
```

## Deployment

This guide covers only minimal and basic deployment instructions. For real production deployment please consider configuring the other important things like SSL, firewall, etc.

> [!IMPORTANT]
> Make sure your clean database is up and running on your server

### 1. Configure your DNS records

#### Create A record that points to your server IP (example below)

```text
A api 192.168.1.100
```

### 2. Install and Setup Nginx

#### Install Nginx for your OS

On Ubuntu or Debian, install Nginx using:

```bash
sudo apt update
sudo apt install nginx
```

For CentOS or RHEL-based systems:

```bash
sudo yum install nginx
```

For other OS pls see the relevant documentation

#### Adjust the firewall (Ubuntu)

```bash
sudo ufw allow 'Nginx Full'
```

#### Check if web server is running

```bash
systemctl status nginx
```

#### Create a new config and open it with `nano`

> [!IMPORTANT]
> If you already created the config file for Next.js, you can skip this step and just append it with the code from the next step

```bash
sudo nano /etc/nginx/sites-available/your-domain
```

#### Configure Nginx as proxy-pass (example below)

```nginx
  server {
      server_name api.your-domain;

      location / {
          proxy_pass http://localhost:3001;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      listen 80;
  }
```

#### Enable your new config

> [!IMPORTANT]
> Skip this step if you already have the config file

```
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
```

#### Check if your config is valid

```bash
sudo nginx -t
```

#### Restart Nginx to apply changes

```bash
sudo systemctl restart nginx
```

### 3. Clone the Repo to the Server and Follow the Steps from Getting Started Section

Follow the steps in the Getting Started section to complete the setup.

### 4. Install PM2 for Process Management

To ensure that your Node.js app runs continuously (even after server restarts), you'll need a process manager like PM2.

#### Install PM2 globally

```bash
npm install -g pm2
```

#### Start your project using PM2

```bash
pm2 start "npm run start" --name ExpressTodoApp
```

#### Ensure PM2 starts automatically on boot

```bash
pm2 startup
```

#### Save the PM2 process list

```bash
pm2 save
```

#### Check Application Logs with PM2

You can view logs for your application by running

```bash
pm2 logs ExpressTodoApp
```

## Next Steps

To enable an HTTPS connection with an SSL certificate, you may want to use `Let's Encrypt` with `Certbot` or route your server through a service like `Cloudflare`. These configurations are not covered in this guide. Please refer to the documentation and set them up on your own.
