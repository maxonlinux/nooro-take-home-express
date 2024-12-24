## Getting started

This README covers the setup for testing purposes only. It does not address production deployment.

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

- Pull the latest version of MySQL

  ```bash
  docker pull mysql:latest
  ```

- Setup container

  ```bash
  docker run --name NooroMySQL -e MYSQL_ROOT_PASSWORD=nooro -e MYSQL_USER=nooro -e MYSQL_DATABASE=todo -e MYSQL_PASSWORD=nooro -p 3306:3306 -d mysql:latest
  ```

- Check if container is running

  ```bash
  docker ps
  ```

### 4. Adjust the `DATABASE_URL` variable in `.env` file accordingly

Update the .env file with your database connection string:

```
DATABASE_URL="mysql://nooro:nooro@localhost:3306/todo"
```

### 5. Create and Sync the Database Schema (Development Only)

This command will push the Prisma schema to the MySQL database. Do not use this in production environments.

```bash
npx prisma db push
```

### 6. Build the project

```bash
npm run build
```

### 7. Run the project

```bash
npm run start
```
