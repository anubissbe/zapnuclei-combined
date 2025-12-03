# Security Policy

## Supported Versions

This project maintains security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

### Security Issues in the Tool Itself

If you discover a security vulnerability in the scanning tool, workflow, or infrastructure (not the intentional test vulnerabilities), please report it responsibly:

1. **Do NOT create a public GitHub issue**
2. **Email the maintainers** privately with details
3. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if known)

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Assessment**: Within 1 week
- **Fix Development**: Depends on severity and complexity
- **Public Disclosure**: After fix is released and users have time to update

### Severity Guidelines

- **Critical**: Remote code execution, privilege escalation in CI/CD
- **High**: Information disclosure of real credentials/secrets
- **Medium**: Denial of service, workflow disruption
- **Low**: Minor information leaks, non-exploitable bugs

## Security Best Practices for Users

### Repository Setup

1. **Enable GitHub Advanced Security**
   - Code scanning alerts
   - Secret scanning
   - Dependency alerts

2. **Secure Workflow Configuration**
   - Use specific action versions (not `@main`)
   - Limit workflow permissions
   - Review third-party actions

3. **Secret Management**
   - Use GitHub Secrets for sensitive data
   - Never commit real credentials to test files
   - Rotate test credentials regularly

### Running Security Scans

1. **Isolate Test Environment**
   - Don't run on production systems
   - Use containerized scanning when possible
   - Limit network access for vulnerable test apps

2. **Monitor Scan Results**
   - Review SARIF uploads regularly
   - Investigate unexpected findings
   - Validate that expected vulnerabilities are detected

## Known Intentional Vulnerabilities

⚠️ **This repository contains intentional security vulnerabilities for testing purposes**

### Test Application Vulnerabilities (server.js)

The following vulnerabilities are **INTENTIONAL** and part of the testing framework:

- **Cross-Site Scripting (XSS)** in search functionality
- **Open Redirect** via URL parameter
- **Information Disclosure** through API endpoints
- **Missing Security Headers** (CSP, HSTS, etc.)
- **Insecure Cookie Configuration**
- **CSRF** vulnerabilities in forms
- **File/Directory Exposure** (.env, .git, backups)
- **API Documentation Leakage** (Swagger, GraphQL)
- **Configuration File Exposure** (JSON configs)

These vulnerabilities should be detected by ZAP and Nuclei scans and are not security issues to be reported.

## Security Scanning Coverage

### What We Test For

- **OWASP ZAP**: Web application vulnerabilities (DAST)
- **Nuclei**: Infrastructure and configuration issues
- **Combined Coverage**: 137+ vulnerability types detected

### What We Don't Test For

- **Static Code Analysis** (SAST) - consider adding CodeQL
- **Dependency Vulnerabilities** - consider Dependabot
- **Container Security** - consider Trivy or Snyk
- **Infrastructure as Code** - consider Checkov

## Incident Response

If a security incident occurs:

1. **Immediate Actions**
   - Assess the scope and impact
   - Contain the issue if possible
   - Document the timeline

2. **Communication**
   - Notify affected users if applicable
   - Coordinate with GitHub Security if needed
   - Prepare public disclosure when appropriate

3. **Recovery**
   - Implement fixes
   - Verify resolution
   - Update security measures

## Compliance and Standards

This project aims to follow:

- **OWASP** security testing guidelines
- **NIST** cybersecurity framework principles  
- **GitHub** security best practices
- **SARIF** 2.1.0 specification for security results

## Security Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Nuclei Templates](https://github.com/projectdiscovery/nuclei-templates)
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [SARIF Specification](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)

---

**Thank you for helping keep this security tool secure! 🔒**