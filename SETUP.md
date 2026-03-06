# Testing Setup - Quick Reference

## ✅ What's Now Available

### Automated Testing
- **Build Validation**: Every PR is automatically built
- **Markdown Linting**: Blog posts are checked for quality
- **Artifact Uploads**: Built sites are saved for debugging

### PR Preview Deployment
- **Automatic Deployment**: Every PR gets its own preview URL
- **Live Updates**: Preview updates on every push
- **Bot Comments**: Preview URL posted automatically on PR

### Easy Local Development
- **Helper Script**: `./dev.sh` for one-command setup
- **Live Reload**: See changes instantly while developing
- **Documentation**: Complete guides in TESTING.md

## 🚀 Quick Start

### For Contributors

```bash
# Clone the repo
git clone https://github.com/x-limitless-x/blakedrumm.com.git
cd blakedrumm.com

# Create a feature branch
git checkout -b my-feature

# Setup and serve locally (one command!)
./dev.sh setup

# Make your changes, test at http://localhost:4000
# Commit and push
git add .
git commit -m "My awesome changes"
git push origin my-feature

# Create PR - automatic testing and preview deployment!
```

### For Repository Owner

**One-time setup required:**

1. Enable Jekyll CI workflow
   - Visit: https://github.com/x-limitless-x/blakedrumm.com/actions/workflows/codeql-analysis.yml
   - Click "Enable workflow" button

2. That's it! Everything else is automatic.

## 📊 Workflow Status

| Workflow | Status | Purpose |
|----------|--------|---------|
| Jekyll CI | ⚠️ Disabled (needs enable) | Build & lint on PR |
| PR Preview | ✅ Active | Deploy PR previews |
| Deploy Site | ✅ Active | Production deployment |
| Greetings | ✅ Active | Welcome contributors |

## 🎯 What Happens on a PR

```
Developer creates PR
    ↓
GitHub Actions trigger
    ↓
    ├─→ Jekyll CI builds & tests (when enabled)
    │   └─→ Pass/Fail status shown on PR
    │
    └─→ PR Preview deploys to preview URL
        └─→ Bot comments with URL
    ↓
Developer sees preview and test results
    ↓
Makes updates if needed
    ↓
Preview auto-updates
    ↓
All checks pass → Ready to merge!
```

## 📝 Files Changed

### Workflows
- `.github/workflows/codeql-analysis.yml` - Fixed build process
- `.github/workflows/pr-preview.yml` - NEW: PR previews
- `.github/workflows/deploy.yml` - Fixed deprecated syntax

### Documentation
- `TESTING.md` - Complete testing guide
- `CONTRIBUTING.md` - Contribution workflow
- `README.md` - Testing highlights
- `SETUP.md` - This file

### Tools
- `dev.sh` - Development helper script

## 💡 Tips

### Local Testing
```bash
./dev.sh          # Interactive menu
./dev.sh build    # Just build
./dev.sh serve    # Serve with live reload
./dev.sh clean    # Clean artifacts
```

### Troubleshooting
- **Build fails?** Run `./dev.sh clean` then `./dev.sh build`
- **Gems missing?** Run `./dev.sh install`
- **Port 4000 in use?** Stop other Jekyll instances

### Preview URLs
- Format: `https://x-limitless-x.github.io/blakedrumm.com/pr-<NUMBER>/`
- Posted by bot in PR comments
- Updates on each push

## 🔗 Resources

- [Full Testing Guide](TESTING.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## ✨ Benefits

✅ **See changes live** before merging
✅ **Catch errors early** with automated builds
✅ **Easy local testing** with helper script
✅ **Professional workflow** like major open source projects
✅ **Clear documentation** for all contributors

---

**Need help?** Check [TESTING.md](TESTING.md) for detailed information.
