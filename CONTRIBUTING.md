# Contributing to ZAP & Nuclei Combined Security Scanner

Thank you for your interest in contributing to this project! We welcome contributions from the community.

## 🤝 Ways to Contribute

- **Bug Reports**: Report issues or unexpected behavior
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve or expand documentation
- **Testing**: Help test new features and report feedback

## 🐛 Reporting Issues

Before creating an issue, please:

1. Check if the issue already exists
2. Provide detailed steps to reproduce
3. Include environment information (OS, Node.js version, etc.)
4. Attach relevant logs or screenshots

## 🔧 Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/zapnuclei-combined.git
   cd zapnuclei-combined
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the test application**
   ```bash
   npm start
   ```

4. **Run security scans locally** (optional)
   - Requires Docker for ZAP and Nuclei
   - See README.md for detailed setup

## 📝 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**
   - Ensure the app still runs: `npm start`
   - Test workflows if you modified them
   - Check for security scan compatibility

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new security check for API endpoints"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎯 Contribution Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and small

### Workflow Changes
- Test changes with the inline build workflow
- Ensure SARIF output remains valid
- Verify GitHub Code Scanning integration works
- Document any new configuration options

### Documentation
- Update README.md for user-facing changes
- Add inline comments for complex code
- Include examples for new features
- Keep documentation up-to-date

### Security Considerations
- This is a security testing tool - be extra careful with changes
- Validate that vulnerabilities are still properly detected
- Ensure new features don't introduce actual security issues
- Test with both ZAP and Nuclei scanners

## 🔍 Testing

### Manual Testing
1. Run the vulnerable app: `npm start`
2. Trigger security scans via GitHub Actions
3. Verify SARIF reports are generated correctly
4. Check GitHub Code Scanning shows results

### Automated Testing
- GitHub Actions workflows run automatically on PRs
- Monitor workflow execution time (should stay under 3 minutes)
- Verify all security findings are detected

## 📋 Security Vulnerability Disclosure

If you discover a security vulnerability in this tool (not the intentional test vulnerabilities), please:

1. **Do not** create a public issue
2. Email the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## 💡 Feature Ideas

Some areas where contributions would be valuable:

- Additional vulnerability test cases
- Support for other security scanners
- Performance optimizations
- Better SARIF formatting
- Integration with other CI/CD platforms
- Enhanced reporting features

## ❓ Questions?

- Create an issue with the "question" label
- Check existing issues for similar questions
- Review the README.md documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make security testing more accessible! 🚀**