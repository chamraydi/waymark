# Waymark — Adventure, Verified

> The first adventure platform where every check-in is verified by a real human, powered by World ID.

Built for **World Build Labs Hackathon 2026** by Raydi Cham.

---

## 🚀 Deploy to Vercel in 5 minutes

### Step 1 — Push to GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repo called `waymark`
2. Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd waymark
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/waymark.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `waymark` repo
4. Click **Deploy** — that's it!

Your live URL will be: `https://waymark-[your-username].vercel.app`

---

## 🌍 Connect World ID (optional for demo, required for production)

1. Go to [developer.worldcoin.org](https://developer.worldcoin.org)
2. Create a new app, get your **App ID**
3. In Vercel → Project → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_WLD_APP_ID = app_your_id_here
   ```
4. Redeploy

Then update `/components/CheckinModal.tsx` — the comment block shows exactly where to drop in the `<IDKitWidget>`.

---

## 🛠 Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Leaflet / React-Leaflet** (OpenStreetMap)
- **World ID / IDKit** (verification)
- **World Chain** (on-chain proof of presence)

---

## What's built

| Feature | Status |
|---|---|
| Trail discovery map | ✅ Live |
| World ID check-in flow | ✅ Live (mock, ready for real SDK) |
| Trail conditions reporting | ✅ Live |
| Health dashboard (vision) | ✅ Live |
| WLD token rewards | 🔜 V2 |
| GPS activity tracking | 🔜 V2 |
| Wearable sync (Garmin, Whoop) | 🔜 V2 |
| Marathon checkpoint mode | 🔜 V2 |
