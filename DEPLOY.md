# SCDFI Deployment Guide
## GitHub (Private Repo) + Vercel (Password-Protected Site)

---

## Prerequisites

You need three things installed on your computer:

1. **Node.js 18+** — https://nodejs.org (download the LTS version)
2. **Git** — https://git-scm.com/downloads
3. **A GitHub account** — https://github.com/signup

To check if you already have them, open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
node --version    # should show v18.x.x or higher
git --version     # should show git version 2.x.x
```

---

## Part 1: Set Up the Project Locally

### Step 1 — Download and unzip

Download `scdci-app.zip` from Claude and unzip it. You should see a folder called `scdci-app`.

### Step 2 — Open Terminal in the project folder

**Mac:**
- Open Terminal (Applications → Utilities → Terminal)
- Type `cd ` (with a space after), then drag the `scdci-app` folder into the Terminal window
- Press Enter

**Windows:**
- Open the `scdci-app` folder in File Explorer
- Click the address bar, type `cmd`, press Enter

### Step 3 — Install dependencies and test

```bash
npm install
npm run dev
```

Your browser should open to `http://localhost:3000` with the SCDFI app running. Click around — try the demo data button in the dashboard. When you're satisfied, press `Ctrl+C` in the terminal to stop the server.

---

## Part 2: Push to GitHub (Private)

### Step 4 — Create a private repo on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `scdci-app`
   - **Description:** `SCDFI — Social-Communication & Developmental Functioning Inventory`
   - **Visibility:** Select **Private** ← important
   - Do NOT check "Add a README" (we already have one)
   - Do NOT add .gitignore (we already have one)
   - Do NOT choose a license (we already have one)
3. Click **Create repository**
4. You'll see a page with setup instructions — leave this tab open

### Step 5 — Initialize git and push

Back in your terminal (still in the `scdci-app` folder):

```bash
git init
git add .
git commit -m "SCDFI v0.3 — 4-informant assessment + profile dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scdci-app.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

If this is your first time pushing to GitHub, it will ask you to authenticate. Follow the prompts — GitHub may open a browser window for you to sign in.

### Step 6 — Verify

Refresh the GitHub page from Step 4. You should see all your files with the README displayed below. The repo should show a 🔒 lock icon indicating it's private.

---

## Part 3: Deploy to Vercel (Free, Password-Protected)

### Step 7 — Create a Vercel account

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize Vercel to access your GitHub account

### Step 8 — Import your project

1. From the Vercel dashboard, click **Add New → Project**
2. You should see `scdci-app` in your repo list — click **Import**
   - If you don't see it, click "Adjust GitHub App Permissions" and grant Vercel access to the repo
3. Vercel auto-detects Vite. The defaults are correct:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**
5. Wait ~30 seconds. You'll see "Congratulations!" when it's done.

Your app is now live at `https://scdci-app.vercel.app` (or similar).

### Step 9 — Add password protection

1. On your project page in Vercel, click **Settings** (top nav)
2. Scroll down to **Password Protection**
   - Note: this is available on Vercel's free plan for preview deployments,
     and on Pro plan ($20/mo) for production. On free plan, you can use
     Vercel's "Deployment Protection" → "Standard Protection" which
     requires a Vercel account to view.
3. **Free alternative:** Add basic auth in the app itself (I can add this if you want)

### Step 10 — Test from another device

Open the Vercel URL on your phone or another computer. The app should load and work identically — assessment, dashboard, JSON save/load, print.

---

## Part 4: Ongoing Workflow

### Making changes

After editing any files locally:

```bash
# Test locally first
npm run dev

# When satisfied, push to GitHub
git add .
git commit -m "Brief description of what changed"
git push
```

Vercel auto-deploys every push to `main`. Your live site updates in ~30 seconds.

### Adding collaborators

**GitHub (code access):**
- Repo → Settings → Collaborators → Add people

**Vercel (deployment management):**
- Project → Settings → Members → Invite

---

## Troubleshooting

**"npm: command not found"**
→ Install Node.js from https://nodejs.org, then restart your terminal

**"git: command not found"**
→ Install Git from https://git-scm.com/downloads, then restart your terminal

**"Permission denied" on git push**
→ GitHub needs authentication. Run `gh auth login` (if you have GitHub CLI)
   or set up a Personal Access Token:
   https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

**Vercel build fails**
→ If it works locally (`npm run build`) but fails on Vercel, check the
   Vercel build logs for the specific error. Most common: Node version
   mismatch. In Vercel Settings → General → Node.js Version, set to 18.x.

**"Cannot find module" errors**
→ Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

---

*SCDFI v0.3 • RTN Communication & Literacy*
*Rachel Terra Norton, MS, CCC-SLP • rachelslp.org*
