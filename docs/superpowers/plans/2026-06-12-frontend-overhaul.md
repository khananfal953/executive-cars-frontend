# Frontend Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all frontend bugs (missing route guards, broken logout, lost auth on refresh, bad favicon, dead files) and fix upload form UX before backend work begins.

**Architecture:** All fixes are surgical edits to existing files — no new data layers, no new pages. One new component (`ProtectedRoute`) is added. Order: auth/guard foundation first, then layout fixes, then cleanup.

**Tech Stack:** React 18, React Router DOM v6, Tailwind CSS, Vite 8. No test framework — verification is build check + manual browser test.

---

## Actual State After Reading All Files

> The Codex analysis overstated what was missing. Confirmed as already complete:
> - All auction stub pages (MyBids, WonCars, Profile) — fully implemented
> - All admin list pages (Users, Bookings, AuctionList, UsedCarsList) — fully implemented
> - SellerDashboardPage — fully implemented
> - AuctionCarDetailPage auto-bid — already has correct `clearTimeout` cleanup

> **Real bugs to fix (7 tasks):**
> 1. No route guards
> 2. Auth lost on refresh (no localStorage)
> 3. Logout redirect wrong in AuctionLayout + AuctionProfilePage
> 4. AdminLayout logout skips calling `logout()` — auth state not cleared
> 5. Favicon references wrong file
> 6. Dead Vite boilerplate files
> 7. Upload forms navigate away on success instead of resetting

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `src/components/ProtectedRoute.jsx` | **Create** | New route guard component |
| `src/App.jsx` | Modify | Import + wrap 14 protected routes |
| `src/context/AuthContext.jsx` | Modify | localStorage read on init, write on login, clear on logout |
| `src/components/AuctionLayout.jsx` | Modify | Fix logout redirect: `/auction/login` → `/auction` |
| `src/components/AdminLayout.jsx` | Modify | Add `useAuth` import + call `logout()` before navigate |
| `src/pages/auction/AuctionProfilePage.jsx` | Modify | Fix logout redirect: `/auction/login` → `/auction` |
| `index.html` | Modify | Fix favicon: `/vite.svg` → `/favicon.svg` |
| `src/main.js` | **Delete** | Vite boilerplate |
| `src/style.css` | **Delete** | Vite boilerplate |
| `src/counter.js` | **Delete** | Vite boilerplate |
| `src/assets/vite.svg` | **Delete** | Vite boilerplate |
| `src/assets/javascript.svg` | **Delete** | Vite boilerplate |
| `src/pages/admin/AdminUploadAuctionPage.jsx` | Modify | Remove navigate-on-success, add form reset + banner |
| `src/pages/admin/AdminUploadUsedCarPage.jsx` | Modify | Remove navigate-on-success, add form reset + banner |

---

## Task 1: Create ProtectedRoute Component

**Files:**
- Create: `src/components/ProtectedRoute.jsx`

- [ ] **Step 1: Create the file**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const LOGIN_PATHS = {
  buyer:  '/auction/login',
  admin:  '/admin',
  seller: '/seller/login',
}

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) {
    return <Navigate to={LOGIN_PATHS[role]} replace />
  }
  return children
}
```

- [ ] **Step 2: Verify build passes**

```powershell
npm run build
```

Expected: build succeeds (component not yet used, no import errors).

- [ ] **Step 3: Commit**

```powershell
git add src/components/ProtectedRoute.jsx
git commit -m "feat: add ProtectedRoute component for role-based route guards"
```

---

## Task 2: Add localStorage Auth Persistence

**Files:**
- Modify: `src/context/AuthContext.jsx`

- [ ] **Step 1: Replace the file content**

Replace the entire file with:

```jsx
import React, { createContext, useContext, useState } from 'react'
import { USERS } from '../data/users.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ec_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    const found = USERS[email]
    if (found && found.password === password) {
      const userData = { email, role: found.role, name: found.name }
      setUser(userData)
      localStorage.setItem('ec_user', JSON.stringify(userData))
      return { success: true, role: found.role }
    }
    return { success: false }
  }

  const loginAuction = (email, password) => {
    const found = USERS[email]
    if (found && found.password === password && (found.role === 'buyer' || found.role === 'admin')) {
      const userData = { email, role: found.role, name: found.name }
      setUser(userData)
      localStorage.setItem('ec_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ec_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginAuction, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 2: Verify build passes**

```powershell
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 3: Manual verify**

Run `npm run dev`, log in as `buyer@executivecars.pk` / `buyer123`, refresh the page. Should still be logged in.

- [ ] **Step 4: Commit**

```powershell
git add src/context/AuthContext.jsx
git commit -m "feat: persist auth state in localStorage so login survives page refresh"
```

---

## Task 3: Wire ProtectedRoute Into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add ProtectedRoute import**

After the existing imports (around line 4), add:

```jsx
import ProtectedRoute from './components/ProtectedRoute.jsx'
```

- [ ] **Step 2: Wrap the 6 buyer auction routes**

Replace the 6 unprotected auction routes (lines 70–75) with:

```jsx
<Route path="/auction/dashboard" element={<ProtectedRoute role="buyer"><AuctionDashboardPage /></ProtectedRoute>} />
<Route path="/auction/live"      element={<ProtectedRoute role="buyer"><AuctionLiveAuctionsPage /></ProtectedRoute>} />
<Route path="/auction/my-bids"   element={<ProtectedRoute role="buyer"><AuctionMyBidsPage /></ProtectedRoute>} />
<Route path="/auction/won-cars"  element={<ProtectedRoute role="buyer"><AuctionWonCarsPage /></ProtectedRoute>} />
<Route path="/auction/profile"   element={<ProtectedRoute role="buyer"><AuctionProfilePage /></ProtectedRoute>} />
<Route path="/auction/car/:id"   element={<ProtectedRoute role="buyer"><AuctionCarDetailPage /></ProtectedRoute>} />
```

- [ ] **Step 3: Wrap the 7 admin routes**

Replace the 7 unprotected admin routes (lines 79–85) with:

```jsx
<Route path="/admin/dashboard"      element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
<Route path="/admin/users"          element={<ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>} />
<Route path="/admin/bookings"       element={<ProtectedRoute role="admin"><AdminBookingsPage /></ProtectedRoute>} />
<Route path="/admin/auction-list"   element={<ProtectedRoute role="admin"><AdminAuctionListPage /></ProtectedRoute>} />
<Route path="/admin/used-cars-list" element={<ProtectedRoute role="admin"><AdminUsedCarsListPage /></ProtectedRoute>} />
<Route path="/admin/upload-auction" element={<ProtectedRoute role="admin"><AdminUploadAuctionPage /></ProtectedRoute>} />
<Route path="/admin/upload-used-car"element={<ProtectedRoute role="admin"><AdminUploadUsedCarPage /></ProtectedRoute>} />
```

- [ ] **Step 4: Wrap the seller dashboard route**

Replace line 89 with:

```jsx
<Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboardPage /></ProtectedRoute>} />
```

- [ ] **Step 5: Verify build passes**

```powershell
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Manual verify**

Run `npm run dev`. Open a private browser tab (no prior login). Navigate directly to `http://localhost:5173/auction/dashboard` — should redirect to `/auction/login`. Navigate to `http://localhost:5173/admin/dashboard` — should redirect to `/admin`. Navigate to `http://localhost:5173/seller/dashboard` — should redirect to `/seller/login`.

- [ ] **Step 7: Commit**

```powershell
git add src/App.jsx
git commit -m "feat: add route guards — all protected routes redirect unauthenticated users"
```

---

## Task 4: Fix Logout Bugs (3 Files)

**Files:**
- Modify: `src/components/AuctionLayout.jsx:20`
- Modify: `src/components/AdminLayout.jsx`
- Modify: `src/pages/auction/AuctionProfilePage.jsx:31`

**AuctionLayout.jsx — wrong redirect path**

- [ ] **Step 1: Fix redirect in AuctionLayout**

On line 20, change:

```jsx
const handleLogout = () => { logout(); navigate('/auction/login') }
```

to:

```jsx
const handleLogout = () => { logout(); navigate('/auction') }
```

---

**AdminLayout.jsx — logout() never called**

- [ ] **Step 2: Import useAuth in AdminLayout**

Add to the existing imports (line 2):

```jsx
import { useAuth } from '../context/AuthContext.jsx'
```

- [ ] **Step 3: Destructure logout from useAuth**

Inside `AdminLayout`, after `const navigate = useNavigate()`, add:

```jsx
const { logout } = useAuth()
```

- [ ] **Step 4: Call logout() in the button handler**

Change the logout button's onClick (line 48):

```jsx
onClick={() => navigate('/admin')}
```

to:

```jsx
onClick={() => { logout(); navigate('/admin') }}
```

---

**AuctionProfilePage.jsx — wrong redirect path**

- [ ] **Step 5: Fix redirect in AuctionProfilePage**

On line 31, change:

```jsx
const handleLogout = () => { logout(); navigate('/auction/login') }
```

to:

```jsx
const handleLogout = () => { logout(); navigate('/auction') }
```

---

- [ ] **Step 6: Verify build passes**

```powershell
npm run build
```

Expected: build succeeds.

- [ ] **Step 7: Manual verify**

Run `npm run dev`. Log in as buyer, then click Logout in the sidebar — should land on `/auction` (the gate page, not the login form). Log in as admin, click Logout — should clear auth and land on `/admin` login page. Refresh after admin logout and navigate to `/admin/dashboard` — should redirect to `/admin` (confirming logout() was called and localStorage cleared).

- [ ] **Step 8: Commit**

```powershell
git add src/components/AuctionLayout.jsx src/components/AdminLayout.jsx src/pages/auction/AuctionProfilePage.jsx
git commit -m "fix: correct logout behavior — call logout() and redirect to gate pages"
```

---

## Task 5: Fix Favicon

**Files:**
- Modify: `index.html:5`

- [ ] **Step 1: Update the favicon href**

Change line 5 in `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

to:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 2: Manual verify**

Run `npm run dev` and check the browser tab — should show the Executive Cars diamond logo, not the Vite triangle.

- [ ] **Step 3: Commit**

```powershell
git add index.html
git commit -m "fix: point favicon to /favicon.svg instead of /vite.svg"
```

---

## Task 6: Remove Dead Vite Files

**Files:**
- Delete: `src/main.js`, `src/style.css`, `src/counter.js`, `src/assets/vite.svg`, `src/assets/javascript.svg`

- [ ] **Step 1: Confirm none are imported anywhere**

```powershell
Select-String -Path "src\**\*.jsx", "src\**\*.js" -Pattern "main\.js|style\.css|counter\.js|vite\.svg|javascript\.svg" -Recurse
```

Expected: no matches (these are pure boilerplate, never imported).

- [ ] **Step 2: Delete the files**

```powershell
Remove-Item src\main.js, src\style.css, src\counter.js, src\assets\vite.svg, src\assets\javascript.svg
```

- [ ] **Step 3: Verify build still passes**

```powershell
npm run build
```

Expected: build succeeds with no missing module errors.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "chore: remove leftover Vite boilerplate files (main.js, style.css, counter.js, unused svgs)"
```

---

## Task 7: Fix Upload Form Success UX

**Files:**
- Modify: `src/pages/admin/AdminUploadAuctionPage.jsx`
- Modify: `src/pages/admin/AdminUploadUsedCarPage.jsx`

Both files currently: set `saved = true`, then navigate away after 1.5s.
Fix: show a green success banner, reset the form, stay on the page, dismiss banner after 4s.

**AdminUploadAuctionPage.jsx**

- [ ] **Step 1: Replace handleSubmit**

Replace the existing `handleSubmit` function (lines 37–44):

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)
  await new Promise(r => setTimeout(r, 1500))
  setSaving(false)
  setSaved(true)
  setForm({
    make: '', model: '', year: '', mileage: '', engine: '',
    transmission: 'Auto', fuel: 'Petrol', color: '',
    basePrice: '', startDate: '', endDate: '', notes: '',
  })
  setImages([])
  setReport(null)
  setTimeout(() => setSaved(false), 4000)
}
```

- [ ] **Step 2: Add success banner inside the form**

Directly below `<form onSubmit={handleSubmit}>` (line 48), add:

```jsx
{saved && (
  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
    <CheckCircle className="w-5 h-5 shrink-0" />
    <div>
      <p className="font-semibold text-sm">Car listed on auction platform!</p>
      <p className="text-xs text-green-600 mt-0.5">Fill the form again to list another car.</p>
    </div>
  </div>
)}
```

**AdminUploadUsedCarPage.jsx**

- [ ] **Step 3: Replace handleSubmit**

Replace the existing `handleSubmit` function (lines 37–44):

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)
  await new Promise(r => setTimeout(r, 1500))
  setSaving(false)
  setSaved(true)
  setForm({
    make: '', model: '', year: '', mileage: '', engine: '',
    transmission: 'Auto', fuel: 'Petrol', color: '',
    price: '', condition: 'Excellent', notes: '',
  })
  setImages([])
  setReport(null)
  setTimeout(() => setSaved(false), 4000)
}
```

- [ ] **Step 4: Add success banner inside the form**

Directly below `<form onSubmit={handleSubmit}>` (the opening form tag), add:

```jsx
{saved && (
  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
    <CheckCircle className="w-5 h-5 shrink-0" />
    <div>
      <p className="font-semibold text-sm">Car listed in used cars!</p>
      <p className="text-xs text-green-600 mt-0.5">Fill the form again to list another car.</p>
    </div>
  </div>
)}
```

- [ ] **Step 5: Verify build passes**

```powershell
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Manual verify**

Log in as admin. Go to Upload Auction Car, fill the form, submit. Verify: spinner shows, then green banner appears, form resets, page stays. Banner disappears after 4 seconds. Repeat for Upload Used Car.

- [ ] **Step 7: Commit**

```powershell
git add src/pages/admin/AdminUploadAuctionPage.jsx src/pages/admin/AdminUploadUsedCarPage.jsx
git commit -m "fix: upload forms show success banner and reset instead of navigating away"
```

---

## Done — Verification Checklist

After all 7 tasks, verify the full success criteria from the spec:

- [ ] Direct URL `/auction/dashboard` without login → redirects to `/auction/login`
- [ ] Direct URL `/admin/dashboard` without login → redirects to `/admin`
- [ ] Direct URL `/seller/dashboard` without login → redirects to `/seller/login`
- [ ] Login as buyer, refresh page → still logged in
- [ ] Auction sidebar Logout → lands on `/auction` gate page (not login form)
- [ ] Admin sidebar Logout → clears auth, lands on `/admin` login
- [ ] Browser tab shows Executive Cars favicon (diamond, not Vite triangle)
- [ ] `npm run build` passes clean
- [ ] Upload Auction form submit → green banner, form resets, stays on page
- [ ] Upload Used Car form submit → green banner, form resets, stays on page
- [ ] Existing pages (Home, Used Cars, Auction Dashboard, etc.) load without regression
