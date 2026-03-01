# 🧪 ListHub Platform - Complete Testing Guide

## Pre-Testing Checklist

Before testing, ensure:

- ✅ Both servers are running (backend + frontend)
- ✅ MongoDB is connected
- ✅ No console errors
- ✅ Fresh browser session (no cached data)

---

## 🔐 Authentication Testing

### Test 1: User Registration

**Expected:** User created and logged in

**Steps:**

1. Go to `http://localhost:3000/register`
2. Fill in:
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
   - Discord: `testuser#1234` (optional)
3. Click "Register"

**Verify:**

- ✅ Redirected to home page
- ✅ "testuser1" appears in navbar
- ✅ "Create Listing" button is enabled
- ✅ Token stored in localStorage

**Test Edge Cases:**

- Empty fields → Error message
- Username < 3 chars → Error
- Email already used → Error
- Password < 6 chars → Error
- Invalid email format → Error

### Test 2: User Login

**Expected:** Existing user can login

**Steps:**

1. Logout if needed: Click your name → Logout
2. Go to `http://localhost:3000/login`
3. Fill in:
   - Email: `test1@example.com`
   - Password: `password123`
4. Click "Login"

**Verify:**

- ✅ Logged in successfully
- ✅ Your username appears in navbar
- ✅ Redirected to home
- ✅ localStorage has token

**Test Edge Cases:**

- Wrong password → "Invalid credentials"
- Wrong email → "Invalid credentials"
- Empty fields → "Please fill all fields"

### Test 3: Token Persistence

**Expected:** Refresh browser and still logged in

**Steps:**

1. Login successfully
2. Refresh browser (F5)
3. Check navbar

**Verify:**

- ✅ Still logged in
- ✅ Username still shows
- ✅ No login page appears

---

## 📋 Listing Management Testing

### Test 4: Create Listing

**Expected:** New listing created and visible

**Steps:**

1. Login first (if not already)
2. Click "➕ Create Listing"
3. Fill in:
   - Title: `Amazing Web Design Service`
   - Description: `Professional web design for business with modern UI/UX approach`
   - Category: `Services`
   - Price: `500`
   - Location: `New York`
   - Image: `https://via.placeholder.com/300?text=WebDesign`
4. Click "Create Listing"

**Verify:**

- ✅ Redirected to listing detail page
- ✅ All information displayed
- ✅ Your username shows as author
- ✅ Vote count shows "0"
- ✅ Back button works

**Test Edge Cases:**

- Title < 3 chars → Error
- Description < 10 chars → Error
- Missing title/description → Error
- Empty category → Error
- Invalid image URL → Placeholder shown

### Test 5: View All Listings

**Expected:** All created listings visible on home

**Steps:**

1. Go to Home page (`/`)
2. Scroll through listings

**Verify:**

- ✅ Recently created listing appears
- ✅ Card shows: title, description preview, category, price, author
- ✅ Author Discord shows if set
- ✅ Location displayed

### Test 6: Filter by Category

**Expected:** Only selected category shown

**Steps:**

1. Home page
2. Select category dropdown
3. Choose "Services"

**Verify:**

- ✅ Only Services category listings show
- ✅ Other categories disappear
- ✅ "All" option shows everything

### Test 7: Sort Listings

**Expected:** List order changes

**Steps:**

1. Home page
2. Try each sort option:
   - "Newest First" (recently created first)
   - "Most Voted" (highest votes first)
   - "Price: Low to High"
   - "Price: High to Low"

**Verify:**

- ✅ Order changes correctly for each sort
- ✅ Prices display accurately
- ✅ Vote counts accurate

---

## 👍 Voting System Testing

### Test 8: Single Vote

**Expected:** Vote count increases

**Steps:**

1. Login as User A
2. On any listing (not your own), click 👍

**Verify:**

- ✅ Button changes to 👍 (filled)
- ✅ Vote count increases by 1
- ✅ Change persists on refresh

### Test 9: Unvote

**Expected:** Vote count decreases

**Steps:**

1. Click 👍 again on same listing

**Verify:**

- ✅ Button changes to 🤍 (empty)
- ✅ Vote count decreases by 1
- ✅ Can toggle multiple times

### Test 10: Guest User Cannot Vote

**Expected:** Voting not allowed

**Steps:**

1. Logout
2. Try to vote on any listing

**Verify:**

- ✅ Alert message: "Please login to vote"
- ✅ Not redirected or changed
- ✅ Listing unchanged

### Test 11: Multiple Users Voting

**Expected:** Vote count reflects all users

**Steps:**

1. In Browser A (logged in as User A):
   - Vote on Listing X
   - Check vote count
2. In Browser B (logged in as User B):
   - Go to Listing X
   - Check vote count (should be 1 higher)
   - Vote on same listing
3. Back to Browser A:
   - Refresh listing page
   - Check vote count (should be 2)

**Verify:**

- ✅ All votes counted correctly
- ✅ Real-time across browsers

---

## 👤 User Profile Testing

### Test 12: View Profile

**Expected:** Profile page shows user info

**Steps:**

1. Login
2. Click your username in navbar
3. Go to Profile page

**Verify:**

- ✅ Username and email displayed
- ✅ Discord username shows if set
- ✅ "Edit" button available
- ✅ Your listings displayed
- ✅ Logout button works

### Test 13: Update Discord Username

**Expected:** Discord username saved and updated

**Steps:**

1. On Profile page
2. Click "Connect Discord Account" (if not set)
3. Enter: `mynewname#5678`
4. Click "Save"

**Verify:**

- ✅ Success message appears
- ✅ Username now shows `mynewname#5678`
- ✅ Persists on refresh
- ✅ Shows on your listings

### Test 14: View Own Listings on Profile

**Expected:** All your listings shown

**Steps:**

1. Profile page, scroll down
2. See all your created listings

**Verify:**

- ✅ Card format like home page
- ✅ Vote count accurate
- ✅ "View" button opens listing detail

---

## 🔍 Listing Detail Testing

### Test 15: Full Listing Details

**Expected:** Complete info displayed

**Steps:**

1. Click on any listing card "View Details"
2. Check all information

**Verify:**

- ✅ Large image shown
- ✅ Title, description, category
- ✅ Price (if set)
- ✅ Location
- ✅ Author info with Discord
- ✅ Created date
- ✅ Vote count
- ✅ Vote button functional

### Test 16: Edit Own Listing

**Expected:** Can edit your listings

**Steps:**

1. Go to your own listing detail
2. Look for "✏️ Edit Listing" button (only shows if your listing)
3. Modify title
4. Click "Save"

**Verify:**

- ✅ Button appears only on your listings
- ✅ Changes saved
- ✅ Changes appear immediately
- ✅ Cannot edit others' listings

### Test 17: Delete Own Listing

**Expected:** Can delete listings

**Steps:**

1. Go to your listing detail
2. Click "🗑️ Delete Listing"
3. Confirm deletion

**Verify:**

- ✅ Confirmation dialog appears
- ✅ Listing removed from database
- ✅ Redirected to home
- ✅ Listing no longer in list
- ✅ Cannot delete others' listings

---

## 🔒 Security Testing

### Test 18: Cannot Access Protected Routes Without Login

**Expected:** Redirected to login

**Steps:**

1. Logout if logged in
2. Try to visit `/create` directly
3. Try to visit `/profile` directly

**Verify:**

- ✅ Redirected to `/login`
- ✅ Cannot access protected pages

### Test 19: Cannot Edit/Delete Others' Listings

**Expected:** Authorization prevented

**Steps:**

1. Login as User A
2. Go to User B's listing
3. Try to manually visit `/edit/B_listing_id`
4. Check if Edit/Delete buttons appear

**Verify:**

- ✅ Edit/Delete buttons DON'T appear
- ✅ Direct URL access gives error
- ✅ Cannot delete other's listings

### Test 20: Token Validation

**Expected:** Invalid token rejected

**Steps:**

1. Open DevTools (F12)
2. Go to Application > localStorage
3. Modify token (change 1 character)
4. Refresh page
5. Try to use app

**Verify:**

- ✅ Auto-logout occurs
- ✅ Token removed
- ✅ Redirected to login
- ✅ Cannot make authenticated requests

---

## ❌ Error Handling Testing

### Test 21: Invalid Form Submission

**Expected:** Clear error messages

**Steps on Register Form:**

1. Leave all fields empty
2. Click "Register"
3. Try invalid email: `invalidemail`
4. Try password: `123`
5. Try username: `ab`

**Verify:**

- ✅ Each shows specific error
- ✅ Error messages clear
- ✅ Form not submitted until valid

### Test 22: Network Error Handling

**Expected:** Graceful error message

**Steps:**

1. Stop backend server
2. Try to login or create listing
3. Check error message

**Verify:**

- ✅ Clear error message shown
- ✅ No app crash
- ✅ User can retry when server back up

### Test 23: Duplicate Email on Register

**Expected:** Error message

**Steps:**

1. First user: test@example.com
2. Second user: same email
3. Try to register

**Verify:**

- ✅ Error: "Email already in use"
- ✅ Form stays open
- ✅ Can try different email

### Test 24: Duplicate Username on Register

**Expected:** Error message

**Steps:**

1. First user: testuser
2. Second user: same username
3. Try to register

**Verify:**

- ✅ Error: "Username already taken"
- ✅ Can proceed with different username

---

## 📱 Responsive Design Testing

### Test 25: Mobile Layout

**Expected:** Works on mobile

**Steps:**

1. Open in mobile browser or toggle DevTools mobile view
2. Check:
   - Navbar layout (hamburger if needed)
   - Cards stack vertically
   - Listings grid responsive
   - Forms readable and usable
   - Buttons clickable (not too small)

**Verify:**

- ✅ Content visible without scrolling horizontally
- ✅ Touch-friendly button sizes
- ✅ Images scaled properly
- ✅ Text readable

### Test 26: Tablet Layout

**Expected:** 2-column grid

**Steps:**

1. Toggle tablet view (iPad size)
2. Check content layout

**Verify:**

- ✅ 2 columns of listings
- ✅ Not too cramped
- ✅ Readable font sizes

### Test 27: Desktop Layout

**Expected:** 3-column grid

**Steps:**

1. Full desktop browser
2. Check grid layout

**Verify:**

- ✅ 3 columns of listings
- ✅ Optimal spacing
- ✅ Professional appearance

---

## 🚀 Performance Testing

### Test 28: Page Load Speed

**Expected:** Fast loads

**Steps:**

1. Check DevTools Network tab
2. Measure load times

**Verify:**

- ✅ Initial load < 3 seconds
- ✅ Subsequent navigation instant
- ✅ No major layout shifts

### Test 29: Large Number of Listings

**Expected:** Still fast

**Steps:**

1. Create 10+ listings
2. Browse and filter
3. Check performance

**Verify:**

- ✅ No noticeable lag
- ✅ Filtering still responsive
- ✅ Voting works smoothly

---

## 📊 Data Persistence Testing

### Test 30: Data Survives Restart

**Expected:** All data persists

**Steps:**

1. Create listing
2. Vote on listings
3. Stop backend AND frontend
4. Start both servers again
5. Refresh browser

**Verify:**

- ✅ Listing still exists
- ✅ Vote counts preserved
- ✅ User still logged in
- ✅ Discord name saved

---

## 🧪 API Direct Testing (Postman/Curl)

### Register via Curl

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"curltest","email":"curl@test.com","password":"password123"}'
```

**Expected:** User created, token returned ✅

### Create Listing via Curl

```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"API Listing","description":"Created via API call","category":"Services"}'
```

**Expected:** Listing created ✅

### Vote via Curl

```bash
curl -X POST http://localhost:5000/api/votes/LISTING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** Vote counted ✅

---

## ✅ Final Checklist

All tests passing?

- [ ] Registration works
- [ ] Login works
- [ ] Can create listings
- [ ] Can view all listings
- [ ] Can filter & sort
- [ ] Can vote
- [ ] Can unvote
- [ ] Can manage profile
- [ ] Can edit own listings
- [ ] Can delete own listings
- [ ] Cannot access protected routes
- [ ] Cannot edit others' listings
- [ ] Error handling robust
- [ ] Mobile responsive
- [ ] Data persists
- [ ] Discord integration works

**If all ✅ → Platform is ready!** 🎉

---

## 📝 Bug Report Template

If you find a bug:

1. **Title:** Brief description
2. **Steps to reproduce:** Exact steps
3. **Expected:** What should happen
4. **Actual:** What actually happens
5. **Browser:** Chrome/Firefox/Safari
6. **Environment:** Local/Production
7. **Screenshots:** If applicable

Example:

> **Title:** Cannot vote on own listing
> **Steps:** 1. Create listing 2. Click vote 3. See error
> **Expected:** Vote count increases
> **Actual:** Error message "Cannot vote on own listing"
> **Browser:** Chrome 120
> **Environment:** Local

---

**Testing Complete? You're ready to submit!** 🚀
