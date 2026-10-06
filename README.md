# YaShoes — Premium Footwear Store

YaShoes is a full-fledged contemporary footwear e-commerce application featuring performance running shoes, hand-lasted leather court sneakers, technical trail shoes, an interactive 3D shoe customizer studio, biomechanical comparison dock, Member Account & Loyalty rewards system, printable GST tax invoices, and multi-step checkout with INR (₹) as the default currency.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9+ (comes with Node.js) or **pnpm** / **yarn**

---

## 1. Installation & Dependency Resolution

Clone or extract the repository, open your terminal / command prompt in the project directory (`C:\Users\HP\Downloads\yashoes---premium-footwear-store`), and install dependencies:

```bash
# Recommended command:
npm install --legacy-peer-deps
```

> **Note on ERESOLVE peer dependency error**:
> If you previously ran `npm install` and saw `npm error code ERESOLVE (peerOptional esbuild from vite)`, this happens in npm 7+ when peer dependency versions have strict ranges across plugins. Running:
> ```bash
> npm install --legacy-peer-deps
> ```
> resolves all packages cleanly without conflict.

---

## 2. Running the Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will start at:
- **Local URL**: [http://localhost:3000](http://localhost:3000)

Open your browser at `http://localhost:3000` to interact with YaShoes.

---

## 3. Production Build

To build the optimized static production bundle:

```bash
# Build production bundle
npm run build

# Preview the production build locally
npm run preview
```

The compiled output will be generated in the `dist/` directory, ready to deploy to any web host (Vercel, Netlify, Cloud Run, Cloudflare Pages, Firebase Hosting, AWS S3/CloudFront).

---

## 4. Key E-Commerce & Account Features

### 👤 Member Account System & Atelier Pass
- **Authentication**: Sign In, Sign Up (with 500 Welcome Bonus Club Points), Password Recovery, and 1-Click Demo Login (`Aarav Sharma`).
- **Profile & Biometrics**: Manage personal details, phone, email, preferred shoe size (e.g. US 10), width ('Regular' / 'Wide'), and foot arch type ('Neutral' / 'High Arch' / 'Flat Feet').
- **Address Book**: Manage multiple delivery addresses (Home, Office/Studio), set defaults, add new addresses.
- **YaShoes Club Rewards**: Tier system (Bronze, Silver, Gold, Platinum VIP), point balance, 1-click reward voucher redemption.
- **Order History**: Review order history directly in your account with live transit stages.
- **Returns & Exchanges**: Dedicated portal to request size exchanges or returns with live status tracking.

### ⚖️ Biomechanical Footwear Comparison Dock
- Compare up to 3 footwear models side-by-side.
- Compares weight, heel-to-toe drop, cushioning class, intended terrain, upper material, midsole compound, and outsole traction.

### 🧾 GST Tax Invoices & Bills of Supply
- Generates official tax invoices complete with GSTIN ID, Bill of Supply, breakdown of subtotal, SGST/CGST taxes, and shipping.
- 1-click **Print / Save as PDF** button with dedicated print styling.

### 🕒 Recently Viewed Footwear Shelf
- Automatically records and displays recently viewed shoes for fast re-engagement.

### 💳 Indian Rupee (₹) & Multi-Currency Switcher
- Default currency set to **INR (₹)** with Indian number formatting (`en-IN`).
- Supports **USD ($)**, **EUR (€)**, and **GBP (£)** with real-time rate conversion.

### 🎨 3D Bespoke Customizer & 30s Fit Quiz
- Real-time colorway customizer with custom initials monogramming.
- 30-second interactive quiz for runners and daily walkers to find their optimal shoe.

---

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Syne* + *Plus Jakarta Sans*)
