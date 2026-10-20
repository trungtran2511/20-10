# Sanctuary 20/10

React + TypeScript + Vite + Three.js immersive 3D flower garden.

## Local
```bash
npm ci
npm run dev
npm run build
```

## Deploy to Vercel
1. Create a **new empty** GitHub repository.
2. In this project folder, after the first local commit, run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
3. On Vercel choose **Add New Project → Import Git Repository**.
4. Preset: **Vite**, build command: `npm run build`, output: `dist`, install: `npm ci`.
5. Deploy. Later pushes to `main` trigger automatic redeploys.

**Note:** The HDR environment EXR is ~73 MB. It is kept because the scene imports it. This can slow first-page loading and Git upload.
