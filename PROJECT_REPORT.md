# Jeunes Toys — Frontend Technical Report

| | |
|---|---|
| **Project** | Jeunes Toys — E-commerce Web Application (Frontend) |
| **Version** | 1.0 |
| **Period** | March 2026 |
| **Stack** | React 19 · Redux Toolkit · React Router 7 · Axios · Plain CSS (Create React App) |

---

## 1. Executive Summary

Jeunes Toys is a single-page storefront for a children’s plastic-toy brand based in **Bab Ezzouar, Algiers**, Algeria. The frontend is a React application with **no CSS framework**: styling uses shared design tokens in `global.css` and co-located stylesheets per page and component.

The app connects to a **REST API** deployed on **Vercel** (Node.js / Express / MongoDB-style backend). End users browse and search products, view detail pages with image galleries, manage a **client-side cart**, complete **checkout** with Algerian wilaya and commune fields, and use contact and legal pages. **Administrators** manage the catalog (create, edit, delete products with **multipart image uploads**), view registered users, and handle **orders** (status updates and deletion).

A floating assistant (**Toby**) uses the **Google Gemini** API for conversational help. Environment variables for Gemini are loaded via Create React App (`REACT_APP_*`).

---

## 2. Scope Delivered

### 2.1 User-facing

- **Home:** Marketing hero, feature strip, product catalog with **search** (name and description), **category filters**, and **sort** (price, rating).
- **Product detail:** Breadcrumb, main image viewer with thumbnails and navigation when multiple images exist, pricing, description, sizes and tags, stock indicator, add to cart, trust badges, **related products**.
- **Cart:** Slide-out drawer in the navbar with quantity controls, line totals, and link to checkout.
- **Checkout:** Delivery fee logic (threshold, selected wilayas) from `src/data/algeria.js`, phone validation, cash-on-delivery flow, order confirmation UI.
- **Auth:** Register and login with JWT stored in `localStorage` (`jt_token`, `jt_user`).
- **Static content:** About, Contact (including map), Privacy Policy, Terms, branded **404** page.

### 2.2 Admin-facing

- **Dashboard** (restricted to `user.role === 'admin'`):  
  - **Products:** Table, add/edit form, **image manager** (keep, add, or mark existing images for removal; upload via `FormData`).  
  - **Users:** List of registered clients (from authenticated `GET /user`).  
  - **Orders:** List with status dropdown, refresh, and order removal where the API supports `DELETE`.

---

## 3. Architecture

### 3.1 Routing

Defined in `src/App.js` using React Router. Public routes include home, product detail, checkout, about, contact, privacy, and terms. Login and register are wrapped so authenticated users are redirected. The dashboard is wrapped in an admin guard (`AdminRoute.js`). Unknown paths render a not-found page.

### 3.2 State (Redux Toolkit)

| Slice | Role |
|--------|------|
| **auth** | Session, login/register/logout, persistence and rehydration from `localStorage`. |
| **products** | Product list, optional single product for detail, async thunks for admin CRUD. |
| **cart** | Cart line items; in-memory only for the session. |
| **orders** | Place order, load orders for admin, update status, delete order; optional `lastOrder` for post-checkout UI. |

### 3.3 HTTP layer

`src/services/api.js` configures Axios: **base URL**, **Bearer token** from storage, and **conditional headers** — `Content-Type: application/json` for JSON bodies, and **no** preset `Content-Type` for `FormData` so multipart boundaries are set correctly for file uploads.

Dedicated modules wrap endpoints: `authApi.js`, `productApi.js`, `orderApi.js`, `userApi.js`.

### 3.4 Styling

- **Global:** `src/styles/global.css` — CSS variables (colors, radii, shadows), typography (Fredoka One, Nunito), buttons, alerts, layout helpers, keyframe animations.
- **Local:** Each major page or component has a matching `.css` file.

---

## 4. Notable Implementation Choices

1. **Direct API calls for multipart product save** — Create and update product use `productApi` with `FormData` **outside** Redux actions to avoid passing non-serializable `File` objects through the store.
2. **Product detail for guests** — If the authenticated single-product request is not used, the UI can resolve the product from the already-loaded list or from local demo data so visitors can still open detail URLs.
3. **Order status sync** — After `PATCH` for order status, the server may return only a message without a full document; the reducer updates the matching order’s `status` in place so the table and select stay consistent.
4. **Order API shape** — Status changes use `PATCH /order/:id` with a JSON body `{ status }`, aligned with the deployed backend routes.

---

## 5. AI Chatbot

- **Component:** `src/components/Chatbot.js`
- **Model:** Google Gemini (REST `generateContent`).
- **Configuration:** `REACT_APP_GEMINI_API_KEY` in a `.env` file at the project root (not committed; use `.env.example` for placeholders).
- **Behavior:** System prompt defines brand-safe answers; the bot does not invent real order data.

---

## 6. Project Structure (overview)

```
src/
  index.js, App.js
  components/     Navbar, Footer, ProductCard, ProductList, Chatbot (+ CSS)
  pages/          Route screens, AdminRoute, PublicOnlyRoute, PrivateRoute (+ CSS)
  redux/          store.js, authSlice, productSlice, cartSlice, orderSlice
  services/       api.js, authApi, productApi, orderApi, userApi
  data/           algeria.js (wilayas, communes, delivery config)
  styles/         global.css, App.css
public/           index.html, icons, manifest, robots.txt
```

---

## 7. Running the Application

```bash
npm install
npm start
```

Production build:

```bash
npm run build
```

Preview the static build locally (e.g. `npx serve -s build`) if you need to test the production bundle without the dev server.

---

## 8. Documentation

| File | Purpose |
|------|---------|
| **README.md** | Setup, layout overview, navigation and search behavior, folder tree, environment variables, troubleshooting. |
| **SPEC.md** | Design tokens, detailed routes, API summary, Redux and file inventory. |

---

*Jeunes Toys — Frontend — March 2026*
