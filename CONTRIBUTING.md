## Contributions:

Contributions are more than just welcome! Fork this repo and create a new branch, then submit a pull request.

### How to Contribute

1. **Fork the repository**
   - Fork it at [https://github.com/x-limitless-x/blakedrumm.com/fork](https://github.com/x-limitless-x/blakedrumm.com/fork)

2. **Create your feature branch**
   ```bash
   git checkout -b my-new-feature
   ```

3. **Make your changes and test locally**
   ```bash
   # Quick way - use the helper script
   ./dev.sh setup
   
   # Or manually:
   # Install dependencies
   gem install bundler --user-install
   export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
   bundle config set path vendor/bundle
   bundle install
   
   # Build and test
   bundle exec jekyll build
   bundle exec jekyll serve --livereload
   ```
   
   Visit `http://localhost:4000` to preview your changes.

4. **Commit your changes**
   ```bash
   git commit -am 'Add some feature'
   ```

5. **Push to your branch**
   ```bash
   git push origin my-new-feature
   ```

6. **Create a Pull Request**
   - Open a PR against the `master` branch
   - Your PR will automatically:
     - Run build tests to ensure the site compiles
     - Lint your markdown files
     - Deploy a preview to `https://x-limitless-x.github.io/blakedrumm.com/pr-<NUMBER>/`
   - Wait for all checks to pass before requesting a review

### Testing

All pull requests are automatically tested with:
- **Jekyll Build**: Ensures the site builds successfully
- **Markdown Linting**: Checks markdown formatting in blog posts
- **Preview Deployment**: Deploys a live preview of your changes

You can view the preview deployment by checking the bot comment on your PR.

### Local Development

To run the site locally:

**Quick way (recommended):**
```bash
# Use the helper script
./dev.sh setup
```

**Manual way:**
```bash
# First time setup
gem install bundler --user-install
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
bundle config set path vendor/bundle
bundle install

# Serve the site locally (rebuilds on file changes)
bundle exec jekyll serve --livereload

# Or just build without serving
bundle exec jekyll build
```

The built site will be in the `build/` directory.
