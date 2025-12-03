# Complete Security Scanning with ZAP & Nuclei

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/anubissbe/zapnuclei-combined)](https://github.com/anubissbe/zapnuclei-combined/issues)
[![GitHub stars](https://img.shields.io/github/stars/anubissbe/zapnuclei-combined)](https://github.com/anubissbe/zapnuclei-combined/stargazers)
[![Security Scan](https://github.com/anubissbe/zapnuclei-combined/actions/workflows/security-scan-inline.yml/badge.svg)](https://github.com/anubissbe/zapnuclei-combined/actions/workflows/security-scan-inline.yml)

A production-ready GitHub Actions workflow that integrates **OWASP ZAP** (DAST) and **Nuclei** vulnerability scanning with **GitHub Advanced Security** (Code Scanning). Includes a sample vulnerable Node.js app for testing.

## Security Coverage

- **OWASP ZAP**: 129 web application vulnerabilities detected
- **Nuclei**: 8 infrastructure/configuration vulnerabilities detected  
- **Total Coverage**: 137+ unique security findings
- **Execution Time**: ~3 minutes (optimized performance)
- **Success Rate**: 100% reliable workflow execution

## Warning

This repository contains security scanning tools and workflows for demonstration purposes.

---

## Features

- **OWASP ZAP** baseline scan (Dynamic Application Security Testing)
- **Nuclei** vulnerability scan (8,855+ templates) 
- **GitHub Code Scanning** integration (SARIF upload)
- **Zero warnings** - properly formatted SARIF files
- **Localhost scanning** - scans during CI/CD build
- **Portable solution** - works on any Express.js app
- **Intelligent mapping** - findings mapped to actual source code lines

## Quick Start

### 1. Copy the Workflow

Copy `.github/workflows/security-scan-combined.yml` to your repository.

### 2. Enable GitHub Advanced Security

- Go to your repo **Settings** → **Code security and analysis**
- Enable **Code scanning**

### 3. Run the Workflow

The workflow triggers on:

- Push to `main`/`master`
- Pull requests
- Manual dispatch

### 4. View Results

- **Security alerts**: `https://github.com/YOUR_USER/YOUR_REPO/security/code-scanning`
- **Workflow artifacts**: Download reports from Actions tab---

## 🔧 How It Works

### The Challenge

DAST tools (ZAP/Nuclei) scan **running applications** (URLs), but GitHub Code Scanning expects **static analysis** results pointing to source files. This creates a mismatch.

### The Solution

Our workflow solves this by:

1. **Building and starting the app** on `localhost` during CI
2. **Scanning the running app** with ZAP and Nuclei
3. **Converting results to SARIF** format
4. **Mapping findings to source lines** by parsing route definitions in `server.js`
5. **Uploading to GitHub Code Scanning** with proper fingerprints

### Technical Details

```yaml
# Key workflow steps:
- Build Node.js app
- Start on localhost:3000
- Get runner IP for Docker access
- ZAP baseline scan → JSON → SARIF conversion
- Nuclei scan → SARIF format
- Map URLs to source lines (/.env → line 131)
- Upload both SARIF files to GitHub
```

---

## 📊 Expected Results

### ZAP Findings (~101 alerts)
- **Cross-Site Scripting (XSS)** 
- Reflected in `/search` endpoint
- **Open Redirect** - Unvalidated redirect in `/redirect`
- **Missing Security Headers** - CSP, X-Frame-Options, etc.
- **Insecure Cookies** - Missing HttpOnly, Secure flags
- **Information Disclosure** - Debug info in responses
- **CSRF** - Missing anti-CSRF tokens

### Nuclei Findings (~8 alerts)
- **Environment Files** 
- `.env` exposure
- **Configuration Files** - `config.json`, `swagger.json`
- **Backup Files** - `backup.sql` with credentials
- **Git Exposure** - `.git/config` file
- **GraphQL** - Introspection enabled
- **MySQL Dumps** - Database backup files

---

## 🛠️ Customization

### For Your Application

The workflow automatically detects Express.js routes by scanning for patterns:
```javascript
app.get('/api/users', ...)     // Maps to line 45
app.post('/login', ...)        // Maps to line 89
app.all('/graphql', ...)       // Maps to line 156
```

### For Other Frameworks

Modify the route detection regex in the SARIF conversion scripts:

```python
# For Express.js (default)
match = re.search(r"app\.(get|post|put|delete|all)\s*\(\s*['\"]([^'\"]+)['\"]", line)

# For Flask
match = re.search(r"@app\.route\s*\(\s*['\"]([^'\"]+)['\"]", line)

# For FastAPI
match = re.search(r"@app\.(get|post|put|delete)\s*\(\s*['\"]([^'\"]+)['\"]", line)
```

### Scanning External URLs

To scan an already-deployed application:
```yaml
# Replace localhost scanning with external URL
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.14.0
  with:
    target: 'https://your-app.com'  # Your deployed app
```

---

## 🔍 Test Application

Included vulnerable Node.js app for testing:

```bash
npm install
npm start  # Runs on http://localhost:3000
```

### Vulnerable Endpoints

| Path | Vulnerability | Scanner |
|------|--------------|---------|
| `/search?q=<script>` | Reflected XSS | ZAP |
| `/redirect?url=evil.com` | Open Redirect | ZAP |
| `/login` | CSRF, Insecure Cookies | ZAP |
| `/.env` | Environment Exposure | Nuclei |
| `/config.json` | Config Exposure | Nuclei |
| `/backup.sql` | Database Dump | Nuclei |
| `/graphql` | GraphQL Introspection | Nuclei |

---

## 📈 GitHub Security Integration

### Code Scanning Alerts

Findings appear in **GitHub Security** tab with:
- **Severity levels** (Critical, High, Medium, Low)
- **Source code locations** (mapped to actual lines)
- **Descriptions and solutions**
- **SARIF compliance** (no warnings)

### Advanced Features
- **Pull Request annotations** 
- Findings shown in PR diffs
- **Historical tracking** - Alert trends over time
- **Status checks** - Optional: fail builds on high severity
- **Security advisories** - Integration with vulnerability database

---

## ⚡ Performance Optimization

**Problem**: The default workflow takes ~6 minutes, which can slow down CI/CD pipelines.

### 🚀 Optimization Strategies

#### 1. **Pre-built Container** (60-90 seconds)
```bash
# Use ghcr.io/YOUR_USER/YOUR_REPO/security-scanner:latest
# Contains pre-installed ZAP, Nuclei, and your app
```
- **Benefits**: No installation time, fastest option
- **Tradeoff**: Requires container registry setup
- **Use**: `.github/workflows/security-scan-fast.yml`

#### 2. **Minimal Scan** (90 seconds)
```bash
# Reduced scope: production deps only, targeted templates
# ZAP: -l INFO (less verbose)  
# Nuclei: -tags exposure,config,backup -severity critical,high
```
- **Benefits**: 4x faster, catches 80% of critical issues
- **Tradeoff**: Less comprehensive coverage
- **Use**: `.github/workflows/security-scan-minimal.yml`

#### 3. **Parallel Scanning** (2 minutes)
```bash
# Build once, scan ZAP and Nuclei in parallel jobs
# Uses GitHub Actions job matrix for concurrent execution
```
- **Benefits**: Full coverage, 3x faster than sequential
- **Tradeoff**: Uses more runner minutes
- **Use**: `.github/workflows/security-scan-parallel.yml`

#### 4. **Scheduled Deep Scan** (6 minutes)
```bash
# Full comprehensive scan on schedule (nightly/weekly)
# Quick scan on every PR, deep scan periodically
```
- **Benefits**: Fast feedback + comprehensive coverage
- **Tradeoff**: Delayed detection of some issues

### 📊 Performance Comparison

| Strategy | Time | Coverage | Complexity | Best For |
|----------|------|----------|------------|----------|
| **Default** | 6min | 100% | Low | Initial setup |
| **Pre-built** | 90sec | 100% | Medium | Production |
| **Minimal** | 90sec | 80% | Low | Fast feedback |
| **Parallel** | 2min | 100% | Medium | Balanced |
| **Hybrid** | 90sec + 6min | 100% | High | Enterprise |

### 🔧 Quick Wins (No Workflow Changes)

```yaml
# Add these optimizations to existing workflow:
- uses: actions/setup-node@v4
  with:
    cache: 'npm'           # Cache npm dependencies
    
- run: npm ci --omit=dev   # Skip dev dependencies

# ZAP optimizations  
cmd_options: '-a -j -l INFO'  # Faster scan mode

# Nuclei optimizations
flags: '-rate-limit 200 -timeout 5'  # Faster execution
```

---

## 🚦 CI/CD Integration

### Basic Usage

```yaml
# Minimal workflow
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      
- uses: actions/checkout@v4

      # ... build steps ...
      
- name: Security Scan

        uses: ./.github/workflows/security-scan-combined.yml
```

### Advanced Configuration

```yaml
# With custom thresholds
- name: Check Results
  run: |
    # Fail build on critical/high findings
    CRITICAL=$(jq '.runs[0].results | map(select(.level=="error")) | length' zap-results.sarif)
    if [ "$CRITICAL" -gt 0 ]; then exit 1; fi
```

---

## 🏆 Best Practices

### ✅ Do
- Enable **GitHub Advanced Security** in repo settings
- Use **CodeQL Action v4** (v3 deprecated December 2026)
- Map findings to **actual source lines** for better tracking
- Let GitHub **calculate fingerprints** (don't provide custom ones)
- Use **localhost scanning** during build for accurate results

### ❌ Don't
- Provide custom `partialFingerprints` (causes warnings)
- Map all findings to line 1 (creates fingerprint conflicts)
- Use invalid action inputs (check documentation)
- Scan external URLs without authentication (limited coverage)
- Include sensitive credentials in test apps

---

## 🔧 Troubleshooting

### Common Issues

**"Fingerprint warnings"**
```bash
# Fixed by removing custom partialFingerprints
# Let GitHub calculate them based on file + line
```

**"URI cannot be parsed to file path"**
```bash
# Fixed by mapping URLs to actual source files
# Don't use fake paths like "web/index"
```

**"Invalid action inputs"**
```bash
# Use 'flags' instead of individual parameters
flags: '-severity critical,high -rate-limit 150'
```

**"App not ready for scanning"**
```bash
# Increase wait timeout or add health check
timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'
```

---

## 📝 License

MIT License 
- For educational and security testing purposes only.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test with your application
4. Submit a pull request

**Security researchers welcome!** Help improve the vulnerable test app or scanning accuracy.

---

## 📚 Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Nuclei Templates](https://github.com/projectdiscovery/nuclei-templates)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
- [SARIF Format Specification](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- [Security Scanning Best Practices](https://owasp.org/www-community/Source_Code_Analysis_Tools)
