# ZAP Security Scan Test Application

A sample Node.js application with **intentional security vulnerabilities** for testing OWASP ZAP and Nuclei security scanning workflows.

## ⚠️ WARNING

This application contains intentional security vulnerabilities for educational and testing purposes. **DO NOT deploy to production!**

## Quick Start

```bash
# Install dependencies
npm install

# Start the application
npm start

# App runs on http://localhost:3000
```

## GitHub Actions Workflows

This repository includes several security scanning workflows:

| Workflow | Description |
|----------|-------------|
| `zap-scan.yml` | Basic ZAP scan against external URL |
| `zap-scan-full.yml` | Full ZAP scan with build steps |
| `zap-scan-on-build.yml` | ZAP scan during build (scans localhost) |
| `nuclei-scan.yml` | Nuclei vulnerability scan |
| `security-scan-combined.yml` | Combined ZAP + Nuclei scan |

## Intentional Vulnerabilities

The following vulnerabilities are intentionally included for testing:

1. **Reflected XSS** - `/search?q=<script>alert('xss')</script>`
2. **Open Redirect** - `/redirect?url=https://evil.com`
3. **Information Disclosure** - `/api/user` exposes internal IDs
4. **Missing Security Headers** - No CSP, X-Frame-Options, etc.
5. **Insecure Cookies** - Missing HttpOnly, Secure, SameSite flags
6. **CSRF Vulnerability** - Login form without CSRF token
7. **Sensitive Data in URL** - `/api/account?token=secret`
8. **Error Stack Traces** - Exposed in error responses
9. **Directory Listing** - `/files` exposes file structure

## Expected ZAP Findings

When you run ZAP against this application, expect alerts for:

- Missing Anti-CSRF Tokens
- Cookie Without HttpOnly Flag
- Cookie Without Secure Flag
- Missing Content Security Policy
- Missing X-Frame-Options Header
- Missing X-Content-Type-Options Header
- Application Error Disclosure
- Information Disclosure
- Cross-Site Scripting (Reflected)

## Test Locally

```bash
# Run the app
npm start

# In another terminal, run ZAP Docker scan
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://host.docker.internal:3000 \
  -J report.json
```

## License

MIT - For educational purposes only.
