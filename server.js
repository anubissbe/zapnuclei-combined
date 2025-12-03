const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// ============================================
// INTENTIONALLY VULNERABLE ENDPOINTS FOR TESTING
// DO NOT USE IN PRODUCTION!
// ============================================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vulnerable: Reflected XSS - user input directly in response
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  // BAD: Directly embedding user input without sanitization
  res.send(`
    <html>
      <head><title>Search Results</title></head>
      <body>
        <h1>Search Results for: ${query}</h1>
        <p>No results found.</p>
        <a href="/">Back to home</a>
      </body>
    </html>
  `);
});

// Vulnerable: Missing security headers
app.get('/api/user', (req, res) => {
  // BAD: No Content-Type, exposes internal info
  res.json({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'admin',
    internalId: 'INT-12345' // Information disclosure
  });
});

// Vulnerable: Potential SQL injection pattern (simulated)
app.get('/api/products', (req, res) => {
  const id = req.query.id;
  // BAD: In real app, this would be SQL injection vulnerable
  // const query = `SELECT * FROM products WHERE id = ${id}`;
  
  res.json({
    products: [
      { id: 1, name: 'Product A', price: 29.99 },
      { id: 2, name: 'Product B', price: 49.99 }
    ],
    debug: `Query param: ${id}` // BAD: Debug info in response
  });
});

// Vulnerable: Open redirect
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  // BAD: Redirecting to user-supplied URL without validation
  if (url) {
    res.redirect(url);
  } else {
    res.redirect('/');
  }
});

// Vulnerable: Directory listing simulation
app.get('/files', (req, res) => {
  // BAD: Exposing file structure
  res.json({
    files: [
      '/etc/passwd',
      '/var/log/app.log',
      'config/database.yml',
      '.env'
    ]
  });
});

// Vulnerable: Cookie without secure flags
app.get('/login', (req, res) => {
  // BAD: Cookie without HttpOnly, Secure, SameSite
  res.cookie('session', 'abc123xyz', { 
    maxAge: 900000
    // Missing: httpOnly: true, secure: true, sameSite: 'strict'
  });
  res.send(`
    <html>
      <head><title>Login</title></head>
      <body>
        <h1>Login Page</h1>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username">
          <input type="password" name="password" placeholder="Password">
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// Vulnerable: Form without CSRF protection
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // BAD: No CSRF token validation
  res.send(`<html><body><h1>Welcome ${username}!</h1></body></html>`);
});

// Vulnerable: Sensitive data in URL
app.get('/api/account', (req, res) => {
  const token = req.query.token; // BAD: Token in URL (gets logged)
  res.json({ status: 'authenticated', token: token });
});

// Health check (safe endpoint)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// NUCLEI-SPECIFIC VULNERABLE ENDPOINTS
// ============================================

// Exposed .env file (Nuclei: exposure templates)
app.get('/.env', (req, res) => {
  // BAD: Exposing environment variables
  res.type('text/plain').send(`
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=super_secret_password_123
API_KEY=sk-1234567890abcdef
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
JWT_SECRET=my-jwt-secret-key
  `.trim());
});

// Exposed git config (Nuclei: git-config-exposure)
app.get('/.git/config', (req, res) => {
  res.type('text/plain').send(`
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
[remote "origin"]
    url = https://github.com/company/private-repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[user]
    email = developer@company.com
  `.trim());
});

// Exposed package.json with dependencies (technology detection)
app.get('/package.json', (req, res) => {
  res.json({
    name: 'vulnerable-app',
    version: '1.0.0',
    dependencies: {
      'express': '^4.17.1',
      'lodash': '^4.17.15', // Known vulnerable version
      'jquery': '^2.2.4'     // Known vulnerable version
    }
  });
});

// phpinfo style endpoint (Nuclei: technology detection)
app.get('/debug/info', (req, res) => {
  // BAD: Exposing system information
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PATH: process.env.PATH
    },
    cwd: process.cwd()
  });
});

// Exposed backup file (Nuclei: backup-file templates)
app.get('/backup.sql', (req, res) => {
  res.type('text/plain').send(`
-- MySQL dump
-- Database: production_db
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(255),
  password_hash VARCHAR(255),
  email VARCHAR(255)
);
INSERT INTO users VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin@company.com');
  `.trim());
});

// Server status page (Nuclei: server-status)
app.get('/server-status', (req, res) => {
  res.send(`
    <html>
    <head><title>Server Status</title></head>
    <body>
      <h1>Apache Server Status</h1>
      <p>Server Version: Apache/2.4.41 (Ubuntu)</p>
      <p>Server Uptime: 45 days 12 hours</p>
      <p>Total Accesses: 1234567</p>
      <p>CPU Usage: 45%</p>
    </body>
    </html>
  `);
});

// Exposed config file (Nuclei: config exposure)
app.get('/config.json', (req, res) => {
  res.json({
    database: {
      host: 'db.internal.company.com',
      port: 5432,
      username: 'app_user',
      password: 'db_password_123'
    },
    redis: {
      host: 'redis.internal.company.com',
      password: 'redis_secret'
    },
    smtp: {
      host: 'smtp.company.com',
      user: 'noreply@company.com',
      password: 'smtp_password'
    }
  });
});

// Admin panel (Nuclei: exposed-panels)
app.get('/admin', (req, res) => {
  res.send(`
    <html>
    <head><title>Admin Panel</title></head>
    <body>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel</p>
      <ul>
        <li><a href="/admin/users">Manage Users</a></li>
        <li><a href="/admin/settings">Settings</a></li>
        <li><a href="/admin/logs">View Logs</a></li>
      </ul>
    </body>
    </html>
  `);
});

// Exposed logs (Nuclei: log-file exposure)
app.get('/logs/access.log', (req, res) => {
  res.type('text/plain').send(`
192.168.1.100 - admin [03/Dec/2025:10:15:32] "POST /login HTTP/1.1" 200 password=admin123
192.168.1.101 - user1 [03/Dec/2025:10:16:45] "GET /api/users HTTP/1.1" 200 token=eyJhbGc...
10.0.0.50 - - [03/Dec/2025:10:17:00] "GET /admin HTTP/1.1" 401 Authorization: Basic YWRtaW46cGFzc3dvcmQ=
  `.trim());
});

// Swagger/API docs exposed (Nuclei: swagger-api)
app.get('/swagger.json', (req, res) => {
  res.json({
    swagger: '2.0',
    info: {
      title: 'Internal API',
      version: '1.0.0',
      description: 'Internal company API - DO NOT EXPOSE'
    },
    host: 'api.internal.company.com',
    basePath: '/v1',
    paths: {
      '/users': { get: { summary: 'List all users' } },
      '/admin/delete': { delete: { summary: 'Delete user (admin only)' } }
    }
  });
});

// GraphQL endpoint (Nuclei: graphql-introspection)
app.all('/graphql', (req, res) => {
  // BAD: Introspection enabled
  if (req.body?.query?.includes('__schema')) {
    res.json({
      data: {
        __schema: {
          types: [
            { name: 'User', fields: ['id', 'email', 'password', 'role'] },
            { name: 'Query', fields: ['users', 'adminUsers', 'secrets'] }
          ]
        }
      }
    });
  } else {
    res.json({ data: { message: 'GraphQL endpoint' } });
  }
});

// Metrics endpoint (Nuclei: prometheus-metrics)
app.get('/metrics', (req, res) => {
  res.type('text/plain').send(`
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/admin"} 1523
http_requests_total{method="POST",path="/login"} 8934

# HELP app_secrets_count Number of secrets (SHOULD NOT EXPOSE)
app_secrets_count 42

# HELP db_connections Active database connections
db_connections{host="db.internal.company.com"} 15
  `.trim());
});

// Actuator endpoints (Nuclei: spring-actuator)
app.get('/actuator/env', (req, res) => {
  res.json({
    activeProfiles: ['production'],
    propertySources: [
      {
        name: 'systemEnvironment',
        properties: {
          'DATABASE_URL': { value: 'postgres://admin:password@db:5432/prod' },
          'SECRET_KEY': { value: 'production-secret-key-12345' }
        }
      }
    ]
  });
});

// WP-config style exposure (Nuclei: wordpress templates)
app.get('/wp-config.php.bak', (req, res) => {
  res.type('text/plain').send(`
<?php
define('DB_NAME', 'wordpress_db');
define('DB_USER', 'wp_admin');
define('DB_PASSWORD', 'wordpress_password_123');
define('DB_HOST', 'localhost');
define('AUTH_KEY', 'put your unique phrase here');
define('SECURE_AUTH_KEY', 'another-secret-key');
  `.trim());
});

// CORS misconfiguration (Nuclei: cors-misconfig)
app.get('/api/cors-test', (req, res) => {
  // BAD: Reflecting any origin
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.json({ sensitive: 'data', user: 'admin' });
});

// Error handler that leaks info
app.use((err, req, res, next) => {
  // BAD: Exposing stack trace
  res.status(500).json({
    error: err.message,
    stack: err.stack // Never expose in production!
  });
});

app.listen(PORT, () => {
  console.log(`Test app running on http://localhost:${PORT}`);
  console.log('WARNING: This app has intentional vulnerabilities for testing!');
});
