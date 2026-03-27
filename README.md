# Jeunes Toys

**Algerian-made plastic toys · React storefront · Admin dashboard · Cash on delivery**

This repository is the **frontend** for Jeunes Toys: a Create React App that combines a marketing-style home page, a searchable product catalog, product detail pages with galleries, checkout with wilaya-based delivery rules, authentication, and an admin area for products, users, and orders.

---

## Table of contents

1. [Why plain CSS (no Bootstrap)](#why-plain-css-no-bootstrap)
2. [Design & layout overview](#design--layout-overview)
3. [Navigation & search](#navigation--search)
4. [Architecture — folders & files](#architecture--folders--files)
5. [Tech stack](#tech-stack)
6. [Getting started](#getting-started)
7. [If `npm start` does not work](#if-npm-start-does-not-work)
8. [Environment variables](#environment-variables)
9. [Backend API](#backend-api)
10. [Further reading](#further-reading)

---

## Why plain CSS (no Bootstrap)

This project is styled with **hand-written CSS** — per-page and per-component stylesheets plus shared tokens in `src/styles/global.css` — **without** Tailwind, Bootstrap, Material UI, or similar frameworks.

**Reasons:**

- **Creative control:** Toy brands need a playful, distinctive look (Fredoka headings, pill buttons, floating hero badges, cart drawer animations). Frameworks push you toward their grid, spacing scale, and component shapes; custom CSS lets every section match the brand exactly.
- **Smaller mental overhead for this codebase:** You read one `.css` file next to each component and see the full styling story. No utility-class noise or fighting default theme variables.
- **Performance & bundle:** No unused framework CSS shipped to the browser; only what you write (plus Google Fonts) is loaded.
- **Learning & ownership:** The team owns breakpoints, animations (`float`, `fadeInUp`, `slideInRight`), and design tokens (`--blue`, `--yellow`, `--radius`) explicitly.

Trade-off: responsive rules and consistency are **your** responsibility; the project uses repeatable patterns (`.container`, `.btn`, `.page-wrapper`) to stay coherent.

---

## Design & layout overview

### Global shell

Every route shares:

- **Fixed navbar** (`Navbar.js` + `Navbar.css`) — logo, links, auth, cart trigger, mobile menu.
- **`<main class="main-content">`** — page content (`App.js`).
- **Footer** — links and legal.
- **Chatbot** — fixed bottom-right (Toby).

Base layout variables live in `src/styles/global.css` (`--font-head`, `--font-body`, colors, shadows, radii). Page wrappers use `.page-wrapper` with top padding so content clears the fixed bar.

### Home page (`/`)

**Files:** `src/pages/Home.js`, `src/pages/Home.css`

Layout is **vertical sections** inside `.home-page`:

| Section | Purpose |
|--------|---------|
| **Hero** | Full-width band with decorative `.hero-shapes`, two-column `.hero-inner`: left = badge (“Proudly Made in Algeria”), H1 with gradient span, subtitle, primary CTA (“Shop Toys” → `#products`) and secondary (“Learn More” → `/about`), **hero stats** (three pills). Right = `.hero-visual` with main image and floating mini-badges (Age 2+, Fast Delivery, Gift Ready). Hero uses `float` animation on imagery. |
| **Features** | White strip, four **feature cards** in a grid (Safety, Colors, Made in Algeria, Educational) with icons and short copy. |
| **Products** | `#products` anchor — section title + `ProductList` (search, category pills, sort, grid of `ProductCard`). Shows a spinner while loading; on API error, an alert appears and **demo products** still fill the grid. |
| **CTA** | Dark gradient **home-cta** band: headline + Contact / Our Story buttons. |

So: **landing story → trust strip → shoppable grid → conversion CTA**.

### Product listing cards (`ProductCard`)

**Files:** `src/components/ProductCard.js`, `ProductCard.css`

Each card is a **link** to `/product/:id` with image (multi-image badge if applicable), category pill, truncated description, price in DA, rating stars, age badge, “Add to cart” with `stopPropagation` so it does not navigate when adding.

### Product detail page (`/product/:id`)

**Files:** `src/pages/ProductDetails.js`, `ProductDetails.css`

Layout:

1. **Breadcrumb** — `Home › category › product name`.
2. **Two-column `.detail-grid`** (stacks on small screens):
   - **Left (`detail-img-col`):** Main viewer (`aspect-ratio` friendly) with optional **prev/next** arrows and **image counter** when multiple images; **thumbnail row** below; **stock bar** (green/red).
   - **Right (`detail-info`):** Category + SKU, title, star rating + order count, large price + DA, age recommendation, long description, size pills, tag pills, **Add to Basket** + **Keep Shopping**, **trust badges** (CE, delivery, returns).
3. **Recommendations** — “You Might Also Like”: up to four `MiniCard` items (same category prioritized), each navigates to `/product/:id` and scrolls to top.

**Data:** Logged-in users trigger `fetchProductById`; the list is also loaded if empty. If the API fails, embedded **DEMO** products allow offline-style browsing.

---

## Navigation & search

### Site navigation (routing)

**File:** `src/App.js` — `react-router-dom` `Routes`:

- **Public:** `/`, `/product/:id`, `/checkout`, `/about`, `/contact`, `/privacy`, `/terms`
- **Auth (guest only):** `/login`, `/register` via `PublicOnlyRoute`
- **Admin:** `/dashboard` via `AdminRoute` (must be logged in **and** `user.role === 'admin'`)
- **404:** `*` → `NotFound`

**Navbar** uses `NavLink` for active styling on: Home, About, Find Us (Contact), and Dashboard (admins only). **Logo** always goes `/`. **Cart** is not a route: it opens a **right-hand drawer** (`slideInRight`) over a dimmed overlay. **Mobile:** hamburger toggles `.mobile-menu` with the same links plus auth actions.

### Search & catalog filters (not in the navbar)

Search is **scoped to the product grid** on the home page, implemented in **`ProductList.js`** (not a global site search):

- **Text search:** Case-insensitive match on **product `name` and `description`** (`filter` + `includes`).
- **Category pills:** Dynamic list = `all` + every distinct `category` from the current product array; filters grid to one category or all.
- **Sort:** `default`, price ascending/descending, **best rated** (by `rating`).
- **Result count:** “Showing **N** toys” updates live.
- **Empty state:** Message + **Show All** resets search + category.

So: **navigation = React Router + navbar + cart drawer**; **search = local state inside `ProductList`** over the Redux-fed product list (or demo fallback).

---

## Architecture — folders & files

Project root (CRA):

```text
jeunes-toys/
├── package.json
├── package-lock.json
├── .gitignore
├── .env                          # local secrets (not committed) — REACT_APP_* for CRA
├── README.md
├── SPEC.md
├── public/
│   ├── index.html                # HTML shell, %PUBLIC_URL%
│   ├── manifest.json
│   ├── robots.txt
│   ├── car-icon.png              # navbar logo asset
│   └── logo.png
├── src/
│   ├── index.js                  # ReactDOM.createRoot, entry
│   ├── App.js                    # Provider, BrowserRouter, routes, layout shell
│   │
│   ├── components/               # shared UI
│   │   ├── Navbar.js / Navbar.css
│   │   ├── Footer.js / Footer.css
│   │   ├── ProductCard.js / ProductCard.css
│   │   ├── ProductList.js / ProductList.css   # search, filters, sort, grid
│   │   └── Chatbot.js / Chatbot.css           # Gemini Toby
│   │
│   ├── pages/
│   │   ├── Home.js / Home.css
│   │   ├── ProductDetails.js / ProductDetails.css
│   │   ├── Checkout.js / Checkout.css
│   │   ├── Login.js / Register.js / Auth.css
│   │   ├── Dashboard.js / Dashboard.css / Dashboard-img-manager.css
│   │   ├── AboutUs.js / AboutUs.css
│   │   ├── Contact.js / Contact.css
│   │   ├── Privacy.js / Terms.js / Legal.css
│   │   ├── NotFound.js
│   │   ├── AdminRoute.js         # guard: admin only
│   │   ├── PublicOnlyRoute.js    # guard: guests only (login/register)
│   │   ├── PrivateRoute.js       # legacy/reusable pattern if needed
│   │   └── OrdersTab.js          # optional extracted orders UI (reference)
│   │
│   ├── redux/
│   │   ├── store.js              # configureStore, reducers
│   │   ├── authSlice.js
│   │   ├── productSlice.js
│   │   ├── cartSlice.js
│   │   └── orderSlice.js
│   │
│   ├── services/                 # HTTP — thin axios wrappers
│   │   ├── api.js                # axios instance, baseURL, JWT, 401 handling
│   │   ├── authApi.js
│   │   ├── productApi.js
│   │   ├── orderApi.js
│   │   └── userApi.js
│   │
│   ├── data/
│   │   └── algeria.js            # wilayas, communes, DELIVERY_CONFIG
│   │
│   └── styles/
│       ├── global.css            # CSS variables, fonts, .btn, .container, keyframes
│       └── App.css               # app shell tweaks
│
└── build/                        # produced by `npm run build` (not source)
```

**Entry:** `src/index.js` mounts **`src/App.js`**. Ignore any duplicate `App.js` at the repository root unless you have wired the project differently — standard CRA uses only the `src/` tree.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19 |
| Routing | React Router 7 |
| State | Redux Toolkit |
| HTTP | Axios |
| Styling | Plain CSS (component/page co-located) |
| Build | Create React App (`react-scripts`) |
| Chatbot AI | Google Gemini (env key) |

---

## Getting started

```bash
npm install
npm start
```

Opens **http://localhost:3000** with hot reload.

---

## If `npm start` does not work

Sometimes port **3000** is busy, Node version mismatches occur, or the dev server fails on Windows paths. You can still **produce and preview a production build**:

```bash
npm run build
npx serve -s build
```

- **`npm run build`** runs `react-scripts build` and outputs static files to **`build/`**.
- **`serve -s build`** (install globally with `npm i -g serve` if you prefer) serves that folder with **SPA fallback** so client-side routes like `/product/123` reload correctly.

Default URL is often **http://localhost:3000** (serve picks a free port; check the terminal output).

Use this same `build/` folder for static hosting (Netlify, Vercel static, etc.).

---

## Environment variables

Create **`.env`** in the project root (same level as `package.json`):

```env
REACT_APP_GEMINI_API_KEY=your_google_ai_studio_key
```

Used by `Chatbot.js` for Toby. Variables must be prefixed with **`REACT_APP_`** to be visible in Create React App.

Restart the dev server after changing `.env`.

---

## Backend API

The Axios **`baseURL`** is set in `src/services/api.js` (deployed REST API on Vercel). All authenticated requests send `Authorization: Bearer <token>` from `localStorage` (`jt_token`).

See **[SPEC.md](./SPEC.md)** for endpoint tables, order status values, checkout payload shape, and delivery rules.

---

## Further reading

- **[SPEC.md](./SPEC.md)** — Detailed specification: design tokens, routes, Redux, API contracts, checkout, admin dashboard, chatbot.

---

<p align="center"><strong>Jeunes Toys</strong> — safe, colorful toys for curious minds.</p>


