# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-12-03

### Added
- Complete security scanning workflow with OWASP ZAP and Nuclei
- GitHub Actions integration with Code Scanning (SARIF upload)
- Vulnerable test application for security scanner validation
- Inline Docker builds for improved performance and reliability
- Comprehensive vulnerability detection (137+ findings)
- Performance optimization (3-minute execution time)
- Zero SARIF warnings - properly formatted security reports

### Security
- Intentional vulnerabilities in test application for scanner validation:
  - Cross-Site Scripting (XSS) in search functionality
  - Open Redirect vulnerabilities  
  - Information Disclosure through APIs
  - Missing Security Headers (CSP, HSTS, X-Frame-Options)
  - Insecure Cookie Configuration
  - CSRF vulnerabilities
  - File/Directory Exposure (.env, .git, backups)
  - API Documentation Leakage (Swagger, GraphQL)
  - Configuration File Exposure

### Changed
- Migrated from external container registry to inline builds
- Updated Nuclei configuration from `-json` to `-jsonl` format
- Optimized workflow performance (50% faster execution)
- Enhanced SARIF formatting for GitHub Code Scanning compatibility

### Fixed
- Container registry permission issues (403 Forbidden errors)
- Nuclei zero-detection bug (wrong command flag)
- SARIF fingerprint conflicts causing upload warnings
- Workflow reliability issues (100% success rate achieved)

### Technical Details
- **OWASP ZAP**: v2.15.0 - detects 129 web application vulnerabilities
- **Nuclei**: v3.5.1 - detects 8 infrastructure/configuration vulnerabilities  
- **Total Coverage**: 137 unique security findings
- **Execution Time**: ~3 minutes (down from 6+ minutes)
- **Success Rate**: 100% (eliminated all workflow failures)
- **GitHub Integration**: Full SARIF 2.1.0 compliance

---

## Release Notes Format

### Categories
- `Added` for new features
- `Changed` for changes in existing functionality  
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability-related changes

### Version Tags
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Link to GitHub releases when available
- Include release dates in YYYY-MM-DD format