# Frontend Overhaul Design — Executive Cars
**Date:** 2026-06-12  
**Scope:** All frontend bug fixes, cleanup, and stub page implementations before backend work begins.  
**Approach:** Fix first, build second. Phase 1 stabilises the codebase; Phase 2 adds content.

---

## Phase 1 — Bug Fixes & Cleanup

### 1.1 Route Guards
**Problem:** All 13 protected routes (`/auction/dashboard`, `/auction/live`, `/auction/car/:id`, `/auction/my-bids`, `/auction/won-cars`, `/auction/profile`, `/admin/dashboard`, `/admin/users`, `/admin/bookings`, `/admin/auction-list`, `/admin/used-cars-list`, `/admin/upload-auction`, `/admin/upload-used-car`, `/seller/dashboard`) are publicly accessible via direct URL.

**Solution:** Create a single `<ProtectedRoute>` component in `src/components/ProtectedRoute.jsx`. It accepts a `role` prop (`"buyer"`, `"admin"`, `"seller"`). On render it reads from `AuthContext` — if unauthenticated or wrong role, it redirects to the appropriate login page:
- buyer → `/auction/login`
- admin → `/admin`
- seller → `/seller/login`

Wrap all protected routes in `App.jsx` with this component. No other files change.

### 1.2 Auth Persistence (localStorage)
**Problem:** Auth state lives only in React memory. Page refresh logs the user out.

**Solution:** In `AuthContext.jsx`:
- On init: read `localStorage.getItem('ec_user')` and parse as initial state
- On `login()` / `loginAuction()`: write user object to `localStorage.setItem('ec_user', JSON.stringify(user))`
- On `logout()`: call `localStorage.removeItem('ec_user')`

The stored user object shape is identical to current in-memory shape — no downstream changes.

### 1.3 Memory Leak Fix
**Problem:** `AuctionCarDetailPage.jsx` sets a `setInterval` for auto-bidding simulation but never clears it on unmount.

**Solution:** Move the interval/timeout logic inside a `useEffect` and return a cleanup function that clears it. The existing random delay (8–20 seconds) stays the same — only the cleanup is added. This ensures the simulation stops when the user navigates away from the page.

### 1.4 Auction Logout Redirect
**Problem:** `AuctionLayout.jsx:20` hardcodes redirect to `/auction/login` on logout instead of the gate page.

**Solution:** Change redirect target to `/auction`.

### 1.5 Favicon Fix
**Problem:** `index.html` references `/vite.svg` as favicon; project has `public/favicon.svg`.

**Solution:** Change `<link rel="icon" href="/vite.svg">` to `<link rel="icon" href="/favicon.svg">` in `index.html`.

### 1.6 Dead File Removal
**Problem:** Vite boilerplate files remain in `src/` and are not imported anywhere.

**Files to delete:**
- `src/main.js`
- `src/style.css`
- `src/counter.js`
- `src/assets/vite.svg`
- `src/assets/javascript.svg`

Verify no imports reference these before deleting.

### 1.7 Admin Upload Form Feedback
**Problem:** `AdminUploadAuctionPage` and `AdminUploadUsedCarPage` submit with no feedback and no connection to list pages.

**Solution:** On form submit, show an inline success banner ("Car listed successfully") and reset the form. No list update — honest about prototype limitations. No toast library needed; use a local `submitted` state flag that renders a green banner.

---

## Phase 2 — Stub Pages (Realistic Mock UI)

All pages follow the existing design system: same Tailwind utility classes, same card/table/badge patterns, same colour palette as finished pages. Mock data uses the existing hardcoded arrays where possible.

### 2.1 AuctionMyBidsPage
**Layout:**
- Top: 3 stat cards (Total Bids, Active Bids, Winning)
- Main: Table — Car name | End date | Your bid | Current highest | Status badge (Winning / Outbid / Ended)
- Mock data: 4–5 rows drawn from existing auction cars, tied to logged-in buyer

### 2.2 AuctionWonCarsPage
**Layout:**
- Top: 1 stat card (Cars Won)
- Main: Card grid — car photo, name, winning bid amount, auction date, "View Details" button
- Empty state: illustrated empty-state card if no wins
- Mock data: 2 pre-won cars using existing auction car data

### 2.3 AuctionProfilePage
**Layout (two panels):**
- Left: Membership card — name, email, member since, tier badge (Gold Member), expiry date, renewal CTA button
- Right: Editable form — Name, Phone, CNIC fields. Submit shows success toast (local state). No actual save.

### 2.4 SellerDashboardPage
**Layout (4 sections):**
1. Stats row: Total Bookings, Approved, Pending, Rejected
2. Inspection bookings table: Date | Branch | Vehicle | Status badge | Inspector notes
3. My Listed Cars: Small card grid (car photo, name, price, status)
4. Price Trend widget: Reuses mock predictor formula, shows estimated value for seller's car with a simple trend note

Mock data tied to `seller@executivecars.pk` account.

### 2.5 AdminUsersPage
**Layout:**
- Search bar + "Total Members" count
- Table: Avatar initials | Name | Email | Join date | Membership status badge | View / Suspend buttons
- Suspend toggles badge in local state (in-session only)
- Pagination (UI only)
- Mock data: 12 members (expand existing array)

### 2.6 AdminBookingsPage
**Layout:**
- Filter tabs: All | Pending | Approved | Rejected
- Table: Seller name | Vehicle | Branch | Date/Time | Status badge | Approve / Reject buttons
- Approve/Reject updates badge in local state immediately
- Mock data: 10 bookings

### 2.7 AdminAuctionListPage
**Layout:**
- Search bar + stat summary (Live, Scheduled, Ended counts)
- Table: Car name | Start date | End date | Current bid | Total bids | Status badge | Edit / Delete buttons
- Delete: confirmation modal → removes from local state
- Mock data: reuses existing 9 auctions

### 2.8 AdminUsedCarsListPage
**Layout:**
- Search bar + stat summary (Active, Sold, Pending counts)
- Table: Car name | Year | Price | Mileage | Status badge | Edit / Delete buttons
- Delete: confirmation modal → removes from local state
- Mock data: reuses existing 9 used cars

---

## What This Does NOT Include
- No backend API integration (deferred to next milestone)
- No real auth server (localStorage only, same demo credentials)
- No real-time data updates
- No payment processing
- No file upload storage
- No edit forms for admin list items — Edit buttons render but clicking them does nothing (no navigation, no modal). This is intentional; edit flows require backend forms and are deferred.

---

## Success Criteria
- [ ] All 13 protected routes redirect unauthenticated users to the correct login page
- [ ] Refresh does not log the user out
- [ ] No memory leak warning from auto-bid interval
- [ ] Auction logout lands on `/auction` gate page
- [ ] Favicon shows correctly in browser tab
- [ ] Dead Vite files removed, build still passes
- [ ] Upload forms show success feedback on submit
- [ ] All 8 stub pages render with realistic mock content
- [ ] Existing pages are unaffected (no regressions)
- [ ] `npm run build` passes with no errors
