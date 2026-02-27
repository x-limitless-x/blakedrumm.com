#!/bin/bash
# Helper script for local development and testing

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Blake Drumm's Blog - Development Helper${NC}"
echo ""

# Check Ruby version
echo "Checking Ruby version..."
if ! command -v ruby &> /dev/null; then
    echo -e "${RED}Error: Ruby is not installed${NC}"
    exit 1
fi

ruby_version=$(ruby -v)
echo -e "${GREEN}✓${NC} $ruby_version"
echo ""

# Setup bundler path
echo "Setting up bundle path..."
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
echo -e "${GREEN}✓${NC} Added gem binaries to PATH"
echo ""

# Function to install dependencies
install_deps() {
    echo "Installing dependencies..."
    
    # Install bundler if needed
    if ! command -v bundle &> /dev/null; then
        echo "Installing bundler..."
        gem install bundler --user-install
    fi
    
    # Configure bundle path
    bundle config set path vendor/bundle
    
    # Install gems
    bundle install
    
    echo -e "${GREEN}✓${NC} Dependencies installed"
    echo ""
}

# Function to build the site
build_site() {
    echo "Building Jekyll site..."
    bundle exec jekyll build
    echo -e "${GREEN}✓${NC} Build complete! Output in build/"
    echo ""
}

# Function to serve the site
serve_site() {
    echo "Starting Jekyll server with live reload..."
    echo -e "${YELLOW}Visit: http://localhost:4000${NC}"
    echo "Press Ctrl+C to stop"
    echo ""
    bundle exec jekyll serve --livereload
}

# Function to clean build artifacts
clean_site() {
    echo "Cleaning build artifacts..."
    rm -rf build/ _site/ .jekyll-cache/
    echo -e "${GREEN}✓${NC} Cleaned"
    echo ""
}

# Main menu
show_menu() {
    echo "What would you like to do?"
    echo "  1) Install dependencies"
    echo "  2) Build the site"
    echo "  3) Serve the site locally (with live reload)"
    echo "  4) Clean build artifacts"
    echo "  5) Full setup (install deps + build + serve)"
    echo "  6) Exit"
    echo ""
    read -p "Enter choice [1-6]: " choice
    
    case $choice in
        1) install_deps ;;
        2) build_site ;;
        3) serve_site ;;
        4) clean_site ;;
        5) 
            install_deps
            build_site
            serve_site
            ;;
        6) 
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
}

# If no arguments, show menu
if [ $# -eq 0 ]; then
    show_menu
else
    # Handle command line arguments
    case "$1" in
        install|i)
            install_deps
            ;;
        build|b)
            build_site
            ;;
        serve|s)
            serve_site
            ;;
        clean|c)
            clean_site
            ;;
        setup)
            install_deps
            build_site
            serve_site
            ;;
        *)
            echo "Usage: $0 [install|build|serve|clean|setup]"
            echo ""
            echo "Commands:"
            echo "  install, i  - Install dependencies"
            echo "  build, b    - Build the site"
            echo "  serve, s    - Serve the site locally"
            echo "  clean, c    - Clean build artifacts"
            echo "  setup       - Full setup (install + build + serve)"
            echo ""
            echo "Run without arguments for interactive menu"
            exit 1
            ;;
    esac
fi
