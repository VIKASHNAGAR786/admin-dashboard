# Deployment & Scaling Guide

Guide for deploying the NestJS backend to production and scaling it.

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Database Setup](#database-setup)
4. [Security Configuration](#security-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Logging](#monitoring--logging)
7. [Scaling Strategies](#scaling-strategies)
8. [CI/CD Pipeline](#cicd-pipeline)

---

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd admin-dashboard-api

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Configure .env
# Edit .env with local database credentials

# 5. Create local database
mysql -u root -p
CREATE DATABASE admin_dashboard_db;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 6. Start development server
npm run start:dev
```

---

## Production Deployment

### Option 1: Traditional Server (VPS/EC2)

#### Deployment Steps

```bash
# 1. Connect to server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MySQL
sudo apt-get install -y mysql-server

# 4. Create application directory
sudo mkdir -p /var/www/api
sudo chown $USER:$USER /var/www/api
cd /var/www/api

# 5. Clone repository
git clone <repository-url> .

# 6. Install dependencies
npm install --production

# 7. Build application
npm run build

# 8. Create .env file
nano .env
# Copy production environment variables

# 9. Setup MySQL database
sudo mysql -u root -p < setup-database.sql

# 10. Start application with PM2
npm install -g pm2
pm2 start dist/main.js --name "admin-api"
pm2 startup
pm2 save
```

#### Setup Database Script

**File:** `setup-database.sql`

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS admin_dashboard_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create database user
CREATE USER IF NOT EXISTS 'api_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON admin_dashboard_prod.* TO 'api_user'@'localhost';

-- Create indexes for performance
USE admin_dashboard_prod;
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_client_status ON client(status);
CREATE INDEX idx_access_key_status ON access_key(status);
CREATE INDEX idx_access_key_clientId ON access_key(clientId);

FLUSH PRIVILEGES;
```

#### Production .env File

```env
# Database (Production)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=api_user
DB_PASSWORD=strong_password_here
DB_DATABASE=admin_dashboard_prod

# JWT (Use strong secret)
JWT_SECRET=generate-strong-secret-min-32-chars-from-crypto-random-bytes
JWT_EXPIRATION=3600

# CORS (Production domain)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=error
```

#### Generate Strong JWT Secret

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

# Start application
CMD ["npm", "run", "start:prod"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: admin_dashboard_prod
      MYSQL_USER: api_user
      MYSQL_PASSWORD: strong_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: api_user
      DB_PASSWORD: strong_password
      DB_DATABASE: admin_dashboard_prod
      JWT_SECRET: your-secret-key-min-32-chars
      CORS_ORIGIN: http://localhost:4200
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

volumes:
  mysql_data:
```

#### Deploy with Docker

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Option 3: Cloud Platforms

#### AWS EC2 + RDS

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Create RDS MySQL instance
# 3. Configure security groups
# 4. Deploy application similarly to VPS setup
# 5. Use environment variables for DB connection
```

#### Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
heroku create your-app-name

# 4. Set environment variables
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USERNAME=db_user
heroku config:set DB_PASSWORD=strong_password
heroku config:set JWT_SECRET=your-secret-key

# 5. Add Procfile
echo "web: npm run start:prod" > Procfile

# 6. Deploy
git push heroku main
```

#### Azure App Service

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create App Service plan
az appservice plan create --name myAppServicePlan \
  --resource-group myResourceGroup --sku FREE --is-linux

# Create web app
az webapp create --resource-group myResourceGroup \
  --plan myAppServicePlan --name myWebApp --runtime "NODE|18-lts"

# Deploy code
az webapp deployment source config-zip --resource-group myResourceGroup \
  --name myWebApp --src <zip-file>
```

---

## Database Setup

### User Privileges

```sql
-- Create API user with minimal privileges
CREATE USER 'api_user'@'%' IDENTIFIED BY 'secure_password';

-- Grant only necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_dashboard_prod.* TO 'api_user'@'%';

-- Remove default privileges
REVOKE ALL PRIVILEGES ON *.* FROM 'api_user'@'%';

-- Re-grant specific privileges
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE TEMPORARY TABLES 
ON admin_dashboard_prod.* TO 'api_user'@'%';

FLUSH PRIVILEGES;
```

### Backup Strategy

#### Automated Backups

```bash
#!/bin/bash
# backup.sh - Daily backup script

BACKUP_DIR="/backups"
DB_HOST="localhost"
DB_USER="api_user"
DB_PASS="password"
DB_NAME="admin_dashboard_prod"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME \
  | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

#### Schedule with Cron

```bash
# Add to crontab (crontab -e)
# Run daily at 2:00 AM
0 2 * * * /path/to/backup.sh
```

#### Restore from Backup

```bash
# Decompress and restore
gunzip < backup_20240212_020000.sql.gz | mysql -u api_user -p admin_dashboard_prod
```

### Connection Pooling

Update `database.config.ts`:

```typescript
const databaseConfig = {
  // ... other config
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
  }
};
```

---

## Security Configuration

### HTTPS Setup

#### Let's Encrypt with Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Get SSL Certificate

```bash
# Generate certificate
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal (every 60 days)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Security Headers

```typescript
import { NestFactory } from '@nestjs/core';
import { helmet } from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet());
  
  // Additional headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  
  await app.listen(3000);
}
```

### Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,        // 1 minute window
      limit: 100,        // 100 requests per minute
    }]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### Input Validation

```typescript
// Already implemented with class-validator
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  password: string;

  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @MinLength(1)
  @MaxLength(100)
  lastName: string;
}
```

---

## Performance Optimization

### Query Optimization

```typescript
// Add indexes to frequently queried columns
export class Client {
  @Index()
  @Column()
  status: string;

  @Index()
  @Column()
  expirationDate: Date;

  @Index()
  @ManyToOne(() => User)
  user: User;
}
```

### Caching with Redis

```bash
npm install redis @nestjs/cache-manager cache-manager-redis
```

```typescript
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // 5 minutes
    }),
  ],
})
export class AppModule {}
```

#### Use Cache in Service

```typescript
@Controller('clients')
export class ClientsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager,
    private clientsService: ClientsService,
  ) {}

  @Get('stats')
  async getStats() {
    const cached = await this.cacheManager.get('client-stats');
    if (cached) return cached;

    const stats = await this.clientsService.getStats();
    await this.cacheManager.set('client-stats', stats, 300000); // 5 min TTL
    
    return stats;
  }
}
```

### Pagination Best Practices

```typescript
// Always paginate large result sets
@Get()
async getClients(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  const maxLimit = 100;
  const safeLimit = Math.min(limit, maxLimit);
  
  return this.clientsService.findAll(page, safeLimit);
}
```

### Database Connection Pool

Already configured in `database.config.ts`:

```typescript
extra: {
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
}
```

### Gzip Compression

```typescript
import { compression } from '@nestjs/common';

app.use(compression());
```

---

## Monitoring & Logging

### Logging Service

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('AppModule');

// Use in services
logger.log('Application started');
logger.error('Database connection failed');
logger.warn('Deprecated endpoint accessed');
```

### Request Logging Middleware

```typescript
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      
      this.logger.log(
        `${method} ${originalUrl} - ${statusCode} - ${duration}ms`
      );
    });

    next();
  }
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Use Sentry error handler
app.use(Sentry.Handlers.errorHandler());
```

### Health Checks

```typescript
@Get('/health')
health() {
  return {
    statusCode: 200,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };
}
```

---

## Scaling Strategies

### Horizontal Scaling (Multiple Instances)

#### Load Balancer Setup

Use Nginx as reverse proxy:

```nginx
upstream api_backend {
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
  
  # Least connections algorithm
  least_conn;
}

server {
  listen 80;
  location / {
    proxy_pass http://api_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

#### Start Multiple Instances with PM2

```bash
# ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/main.js',
      instances: 4,              // Number of CPU cores
      exec_mode: 'cluster',       // Use cluster mode
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ]
};

# Start with PM2
pm2 start ecosystem.config.js
```

### Vertical Scaling (Bigger Server)

- Increase RAM
- Add CPU cores
- Upgrade storage (SSD)
- Optimize Node.js heap size

```bash
node --max-old-space-size=4096 dist/main.js
```

### Database Scaling

#### Read Replicas

```typescript
// MySQL Replication setup
// Configure master-slave replication in MySQL

// Read from replica
const readConnection = await mysql.createConnection({
  host: 'replica.db.example.com',
  user: 'api_user',
  password: 'password',
  database: 'admin_dashboard'
});

// Write to master
const writeConnection = await mysql.createConnection({
  host: 'master.db.example.com',
  user: 'api_user',
  password: 'password',
  database: 'admin_dashboard'
});
```

#### Database Sharding

Distribute data across multiple databases:

```typescript
// Client shard key: clientId % 4
const shardId = clientId % 4;
const dbName = `admin_dashboard_shard_${shardId}`;
```

---

## CI/CD Pipeline

### GitHub Actions

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.DEPLOY_HOST }} >> ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key user@${{ secrets.DEPLOY_HOST }} "cd /var/www/api && git pull && npm install && npm run build && pm2 restart api"
```

---

## Monitoring Checklist

- [ ] Setup error logging (Sentry)
- [ ] Monitor API response times
- [ ] Track database query performance
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Setup uptime monitoring
- [ ] Track failed login attempts
- [ ] Monitor JWT token issuance
- [ ] Track access key usage
- [ ] Monitor database backups
- [ ] Setup alerting for critical issues

---

## Troubleshooting Production

### High CPU Usage
- Check for infinite loops
- Profile with Node.js profiler
- Verify database queries are optimized
- Check for memory leaks

### High Memory Usage
- Increase Node.js heap size
- Check for memory leaks with heap dumps
- Implement caching to reduce memory allocation
- Use Redis for session/cache storage

### Slow Requests
- Check database query performance
- Implement pagination
- Add database indexes
- Enable caching
- Use CDN for static assets

### Database Connection Issues
- Verify connection pool configuration
- Check database server resources
- Monitor connection count
- Implement connection retry logic

---

**Last Updated:** February 12, 2026  
**Status:** Production Ready  
**API Version:** 1.0.0
