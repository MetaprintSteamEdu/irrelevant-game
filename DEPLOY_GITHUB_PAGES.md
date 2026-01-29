# GitHub Pages Deployment Guide

Follow these steps to deploy your Next.js project to GitHub Pages.

## Phase 1: Code Configuration (Switch to Standard Mode)
You need to update `next.config.mjs` with the following settings:

```javascript
const nextConfig = {
  output: "export", // Enables static export
  images: {
    unoptimized: true, // Required for static sites
  },
  // If your repo is NOT named "username.github.io", 
  // uncomment the line below and replace 'your-repo-name'
  // basePath: '/your-repo-name', 
};
```

## Phase 2: GitHub Repository Settings
1. Push your code changes to GitHub.
2. Go to your repository on **GitHub.com**.
3. Navigate to **Settings** > **Pages**.
4. Under **Build and deployment** > **Source**, select **"GitHub Actions"**.

## Phase 3: Configure GitHub Action
1. GitHub will display a suggestion for "Next.js". Click **Configure**.
2. This will open an editor for a file named `.github/workflows/nextjs.yml`.
3. You don't usually need to change anything in this file. Click **Commit changes**.
4. Go to the **Actions** tab to watch your deployment build.

Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`!