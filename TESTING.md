# Testing and CI/CD Setup for blakedrumm.com

This document explains the automated testing and preview setup for this repository.

## Overview

This repository uses GitHub Actions to automatically:
1. **Build and test** the Jekyll site on every push and pull request
2. **Lint markdown** files to ensure quality
3. **Deploy PR previews** so you can see changes before merging
4. **Deploy to production** when changes are merged to master

## Workflows

### 1. Jekyll CI (`codeql-analysis.yml`)

**Status:** ⚠️ Currently disabled due to inactivity

**Triggers:**
- Push to `master` branch
- Pull requests to `master` branch  
- Weekly schedule (Mondays at 6am UTC)

**What it does:**
- Builds the Jekyll site to ensure it compiles without errors
- Runs markdown linting on all blog posts
- Uploads build artifacts for inspection

**To enable this workflow:**
1. Go to: https://github.com/x-limitless-x/blakedrumm.com/actions/workflows/codeql-analysis.yml
2. Click "Enable workflow"

### 2. PR Preview (`pr-preview.yml`)

**Status:** ✅ Active

**Triggers:**
- When a PR is opened, updated, or reopened

**What it does:**
- Builds the Jekyll site
- Deploys it to `gh-pages-preview` branch under `pr-<NUMBER>/`
- Posts a comment on the PR with the preview URL
- Preview URL format: `https://x-limitless-x.github.io/blakedrumm.com/pr-<NUMBER>/`

**Requirements:**
- GitHub Pages must be enabled for the repository
- The `gh-pages-preview` branch will be auto-created on first run
- Workflow needs write permissions to `contents` and `pull-requests`

### 3. Deploy Site (`deploy.yml`)

**Status:** ✅ Active

**Triggers:**
- Push to `master` branch
- Manual workflow dispatch

**What it does:**
- Reads deployment strategy from `DEPLOY_STRATEGY` file
- Deploys to GitHub Pages (current strategy: `gh-pages`)

### 4. Greetings (`greetings.yml`)

**Status:** ✅ Active

**Triggers:**
- New issues and pull requests

**What it does:**
- Welcomes first-time contributors

## Local Development

### Quick Start (Recommended)

Use the provided helper script for easy setup:

```bash
# Interactive menu
./dev.sh

# Or use direct commands
./dev.sh install   # Install dependencies
./dev.sh build     # Build the site
./dev.sh serve     # Serve locally with live reload
./dev.sh clean     # Clean build artifacts
./dev.sh setup     # Full setup (install + build + serve)
```

### Manual Setup

#### Prerequisites

- Ruby 3.0 or higher
- Bundler

#### Setup Commands

```bash
# Install bundler (if not already installed)
gem install bundler --user-install

# Add gem binaries to PATH
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"

# Configure bundler to install gems locally
bundle config set path vendor/bundle

# Install dependencies
bundle install
```

### Build the site

```bash
# Build once
bundle exec jekyll build

# The built site will be in build/
```

### Serve locally with live reload

```bash
# Serve with automatic rebuilds
bundle exec jekyll serve --livereload

# Visit http://localhost:4000
```

### Clean build artifacts

```bash
# Remove build directory
rm -rf build/

# Remove Jekyll cache
rm -rf .jekyll-cache/
```

## Testing Your Changes

### Before Creating a PR

1. **Build locally** to catch errors early:
   ```bash
   bundle exec jekyll build
   ```

2. **Preview locally** to see your changes:
   ```bash
   bundle exec jekyll serve --livereload
   ```

3. **Check markdown** if you modified posts (optional, CI will do this):
   ```bash
   # Install markdownlint-cli if not already installed
   npm install -g markdownlint-cli
   
   # Lint your markdown files
   markdownlint '_posts/**/*.md'
   ```

### After Creating a PR

1. **Check CI status** - Look for the check marks on your PR
2. **Review the preview** - A bot will comment with a preview URL
3. **Fix any issues** - Push new commits if CI finds problems

## Troubleshooting

### Jekyll CI workflow is disabled

The workflow may be disabled due to inactivity. To enable:
1. Visit: https://github.com/x-limitless-x/blakedrumm.com/actions/workflows/codeql-analysis.yml
2. Click "Enable workflow"

### PR Preview deployment fails

Common issues:
- **Permissions**: Ensure workflow has write access to contents and pull-requests
- **GitHub Pages**: Must be enabled in repository settings
- **Branch protection**: The `gh-pages-preview` branch may need to be excluded from protection rules

### Build fails locally

Common fixes:
```bash
# Clear cache and rebuild
rm -rf .jekyll-cache/ vendor/ .bundle/
bundle install
bundle exec jekyll build
```

## Configuration Files

- `.github/workflows/codeql-analysis.yml` - Jekyll CI workflow
- `.github/workflows/pr-preview.yml` - PR preview deployment
- `.github/workflows/deploy.yml` - Production deployment
- `.github/workflows/greetings.yml` - Welcome bot
- `.github/workflows/markdownlint-config.json` - Markdown linting rules
- `_config.yml` - Jekyll configuration
- `Gemfile` - Ruby dependencies
- `DEPLOY_STRATEGY` - Deployment target (`gh-pages`, `firebase`, or `none`)

## Security

All workflows use minimal required permissions:
- Read access to repository code
- Write access only where needed (deployments, comments)
- Secrets are stored in GitHub repository settings

## Need Help?

- Check workflow runs: https://github.com/x-limitless-x/blakedrumm.com/actions
- View workflow files in `.github/workflows/`
- See `CONTRIBUTING.md` for contribution guidelines
