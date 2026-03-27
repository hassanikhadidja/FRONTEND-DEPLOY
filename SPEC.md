# SPEC.md — Jeunes Toys Frontend (Technical Specification)

This document complements **[README.md](./README.md)**. It records **layout**, **navigation & search behavior**, **styling approach**, **runtime troubleshooting**, and **implementation details** for developers maintaining the codebase.

---

## 1. Styling strategy: plain CSS (no CSS framework)

### 1.1 Decision

The UI is built with **vanilla CSS** files co-located with components and pages. The project **does not** use Bootstrap, Tailwind CSS, Bulma, Material UI, or Chakra.

### 1.2 Rationale

| Topic | Explanation |
|--------|-------------|
| **Layout freedom** | Marketing and e-commerce pages need a **brand-specific** look: custom hero geometry, floating badges, pill buttons, cart drawer animation (`slideInRight`), and toy-category cards. Frameworks impose their own spacing systems and component shapes; overriding them often takes as long as writing CSS from scratch. |
| **Design tokens** | Shared variables live in `src/styles/global.css` (`:root`): colors (`--blue`, `--yellow`, …), radii (`--radius`, `--radius-sm`), shadows, fonts (`--font-head`, `--font-body`). Pages extend these tokens rather than fighting a third-party theme. |
| **Bundle & runtime** | No unused framework CSS is shipped; load is limited to app CSS + Google Fonts. |
| **Maintainability** | Each feature’s styles sit beside its JS (`Home.css` + `Home.js`), which makes refactors localized. |

### 1.3 Global vs local CSS

| File | Role |
|------|------|
| `src/styles/global.css` | Imports fonts; defines `:root` tokens; resets; `.container`, `.page-wrapper`, `.btn*`, `.alert*`, keyframes (`float`, `fadeInUp`, `spin`, `slideInRight`, `pulse`). |
| `src/styles/App.css` | App shell tweaks if any. |
| `src/pages/*.css`, `src/components/*.css` | Page/component-specific rules; may override or extend globals. |

### 1.4 Development vs production preview

- **Development:** `npm start` — webpack dev server, hot reload.
- **If dev server fails:** `npm run build` then `npx serve -s build` — serves the **production** bundle from `build/` with SPA history fallback so deep links work.

---

## 2. Design & layout

### 2.1 Application shell

**`src/App.js`**

- Wraps the tree in Redux `Provider` and `BrowserRouter`.
- Layout: `Navbar` → `<main className="main-content">` → `Routes` → `Footer` → `Chatbot`.
- All pages inherit **fixed navbar** height via `.page-wrapper` padding in `global.css`.

### 2.2 Home page (`/`)

**`src/pages/Home.js` + `Home.css`**

Vertical composition:

1. **Hero (`section.hero`)**  
   - Decorative background shapes (`.hero-shapes`, `.hs*`).  
   - `.container.hero-inner`: **two columns** on wide screens — text + CTAs + stat row; image column with `.hero-img-wrap`, main image, three floating `.hbadge` labels.  
   - Primary CTA scrolls to `#products`; secondary links to `/about`.

2. **Features (`section.features`)**  
   - Four-column grid (responsive) of `.feature-card` items (icon, title, description).

3. **Products (`section#products`)**  
   - Section header (“Our Toy Collection”).  
   - Loading: `.spinner-wrap`.  
   - Error: `.alert.alert-error` — still allows demo data.  
   - **`<ProductList products={displayProducts} />`** where `displayProducts` is Redux `products` if non-empty, else static `DEMO` array in `Home.js`.

4. **Bottom CTA (`section.home-cta`)**  
   - Contrasting gradient band; Contact + About links.

### 2.3 Product list & cards (embedded in Home)

**`src/components/ProductList.js` + `ProductList.css`**

- Filter bar: search input, category **pills**, sort `<select>`.
- **Grid:** `.pl-grid` of `ProductCard` components; staggered animation delay per item.

**`src/components/ProductCard.js` + `ProductCard.css`**

- Entire card wrapped in `Link` to `/product/:id`.
- Image, category badge, truncated description, price (DA), stars, age badge, educational ribbon if applicable.
- Add-to-cart button uses `e.preventDefault()` + `e.stopPropagation()` so the link does not fire.

### 2.4 Product detail page (`/product/:id`)

**`src/pages/ProductDetails.js` + `ProductDetails.css`**

- **Breadcrumb** row: Home → category → current name.
- **`.detail-grid`** (responsive two columns):
  - **Image column:** Main image from `images[activeIdx]`; optional ‹ › navigation and `activeIdx + 1 / N` counter; thumbnail strip; stock status bar.
  - **Info column:** Category, SKU, title, rating + `nbr_commande`, price, age block, description, sizes, tags, primary add-to-cart, secondary link home, trust badges.
- **Recommendations:** `related` products (prefer same category), `MiniCard` grid, “View All Toys” to `/`.

**Data loading:**

- If `isAuthenticated`, dispatches `fetchProductById(id)`.
- Ensures `fetchAllProducts` if list empty.
- Clears `currentProduct` on unmount.
- Fallback: `currentProduct` or match from `products` or **DEMO** list by `id`.

---

## 3. Navigation & search (implementation)

### 3.1 Global navigation

**`src/components/Navbar.js` + `Navbar.css`**

| Mechanism | Behavior |
|-----------|----------|
| **React Router** | `NavLink` for Home (`end`), About, Contact (“Find Us”), Dashboard (admin). |
| **Logo** | `Link to="/"` with `/car-icon.png` + wordmark. |
| **Scroll state** | `scrolled` class after `window.scrollY > 20` for shadow/border. |
| **Cart** | State `cartOpen`; button opens **drawer** (not a route). Overlay click closes; drawer lists `CartItem` rows with qty +/- and remove; shows total and link to `/checkout`. |
| **Auth** | Logged in: name + optional `admin-chip`, Logout. Logged out: Login, Sign Up. |
| **Mobile** | `.menu-toggle` opens `.mobile-menu` with duplicate links + logout. |

**Guards:**

- `src/pages/AdminRoute.js` — redirects to `/login` if not authenticated; shows “Access Denied” if not `role === 'admin'`.
- `src/pages/PublicOnlyRoute.js` — redirects away from login/register if already logged in.

### 3.2 Search & filters (catalog)

Implemented **only** in **`ProductList.js`** — local React state, **no** URL query params:

| Control | State | Logic |
|---------|--------|--------|
| Search | `search` string | Filters where `name` or `description` contains query (case-insensitive). |
| Category | `category` string | `'all'` or exact `product.category` from data-driven pill list. |
| Sort | `sortBy` | `default` \| `price-asc` \| `price-desc` \| `rating`. |
| Count | derived | Renders “Showing **n** toys”. |
| Empty | — | Icon, copy, button to reset search + category to `all`. |

**Important:** This is **not** a site-wide search bar in the navbar; it is the **catalog toolbar** on the home page’s product section.

---

## 4. Routing reference

| Path | Component | Notes |
|------|-----------|--------|
| `/` | `Home` | Hero, features, ProductList, CTA |
| `/product/:id` | `ProductDetails` | Gallery + detail + recommendations |
| `/checkout` | `Checkout` | Redirects if cart empty (unless success state) |
| `/about` | `AboutUs` | |
| `/contact` | `Contact` | |
| `/privacy` | `Privacy` | |
| `/terms` | `Terms` | |
| `/login` | `Login` | `PublicOnlyRoute` |
| `/register` | `Register` | `PublicOnlyRoute` |
| `/dashboard` | `Dashboard` | `AdminRoute` |
| `*` | `NotFound` | |

---

## 5. State management (Redux)

**`src/redux/store.js`** combines:

- **`auth`** — `login`, `register`, `logout`; persists `jt_token` / `jt_user`; rehydrates user from storage.
- **`products`** — list fetch, optional `fetchProductById`, CRUD for admin; handles `{ msg }`-only API responses where applicable.
- **`cart`** — `items` array; add/remove/update quantity.
- **`orders`** — `placeOrder`, `fetchAllOrders`, `updateOrderStatus`, `deleteOrder`; `lastOrder` for checkout success UI.

---

## 6. HTTP API (summary)

**Instance:** `src/services/api.js` — `baseURL`, JWT header, FormData-safe Content-Type, 401 clears storage.

| Area | Base paths | Notes |
|------|------------|--------|
| Users | `/user/register`, `/user/login`, `/user/getcurrentuser`, `/user` (admin list) | |
| Products | `/product`, `/product/:id` | POST/PATCH use `FormData` for images |
| Orders | `/order`, `/order/:id` | PATCH body `{ status }` for admin updates |

Full tables and payloads: see earlier sections in this file and **`Checkout.js`** for order body shape; **`algeria.js`** for `DELIVERY_CONFIG`.

---

## 7. Chatbot

**`src/components/Chatbot.js`**

- Google **Gemini** REST API (`generateContent`).
- Requires **`REACT_APP_GEMINI_API_KEY`** in `.env`.
- System prompt defines Toby persona; must not invent order facts.

---

## 8. File inventory (source)

Below is a **complete listing** of application source files under `src/` (excluding `build/` and `node_modules/`). Third-party `public/` assets are listed separately.

### 8.1 `src/` JavaScript & CSS

```
src/index.js
src/App.js

src/components/
  Navbar.js, Navbar.css
  Footer.js, Footer.css
  ProductCard.js, ProductCard.css
  ProductList.js, ProductList.css
  Chatbot.js, Chatbot.css

src/pages/
  Home.js, Home.css
  ProductDetails.js, ProductDetails.css
  Checkout.js, Checkout.css
  Login.js, Register.js, Auth.css
  Dashboard.js, Dashboard.css, Dashboard-img-manager.css
  AboutUs.js, AboutUs.css
  Contact.js, Contact.css
  Privacy.js, Terms.js, Legal.css
  NotFound.js
  AdminRoute.js
  PublicOnlyRoute.js
  PrivateRoute.js
  OrdersTab.js

src/redux/
  store.js
  authSlice.js
  productSlice.js
  cartSlice.js
  orderSlice.js

src/services/
  api.js
  authApi.js
  productApi.js
  orderApi.js
  userApi.js

src/data/
  algeria.js

src/styles/
  global.css
  App.css
```

### 8.2 `public/` static assets

```
public/index.html
public/manifest.json
public/robots.txt
public/car-icon.png
public/logo.png
```

### 8.3 Root config (typical CRA)

```
package.json
package-lock.json
.gitignore
.env                    (local; gitignored — define REACT_APP_*)
README.md
SPEC.md
```

---

*End of SPEC.md*
