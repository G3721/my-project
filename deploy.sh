#!/bin/bash

# Simple deployment script for GitHub Pages
echo "Deploying to GitHub Pages..."

# Add all files
git add .

# Commit changes
git commit -m "Deploy website"

# Push to GitHub
git push origin master

# Tell user to enable GitHub Pages in repository settings
echo "Deployment complete!"
echo "To finish setup:"
echo "1. Go to your repository settings on GitHub"
echo "2. Scroll down to the 'Pages' section"
echo "3. Under 'Source', select 'Deploy from a branch'"
echo "4. Choose 'master' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
echo "Your site will be available at https://G3721.github.io/my-project/"