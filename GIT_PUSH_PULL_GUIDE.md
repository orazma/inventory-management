# Git Push/Pull Guide for Inventory Management

## For You (Developer Pushing Changes)

### Step 1: Check Status
```powershell
cd c:\Users\moraz\Desktop\inventory-management
git status
```
This shows all modified files that need to be committed.

### Step 2: Stage All Changes
```powershell
git add .
```
Or stage specific files:
```powershell
git add client/src/app/moderators/page.tsx
git add client/src/app/\(components\)/Sidebar/index.tsx
```

### Step 3: Verify Staged Changes
```powershell
git status
```
All files should show in green (staged for commit).

### Step 4: Commit Changes
```powershell
git commit -m "feat: add moderators management page with create and delete functionality

- Create new /moderators page for Super Admin to manage moderators
- Add modal form to create new moderators with password visibility toggle
- Add delete functionality for moderators (Super Admin accounts cannot be deleted)
- Add Moderators menu item to sidebar (Shield icon) for Super Admin only
- Only Moderators can be created (no Super Admin creation option)
- Auto-generate admin IDs using UUID"
```

### Step 5: Push to Remote Repository
```powershell
git push origin main
```
Or if you're using a different branch:
```powershell
git push origin branch-name
```

### Step 6: Verify Push
```powershell
git log --oneline -5
```
You should see your commit at the top.

---

## For Team Members (Pulling Changes)

### Step 1: Ensure You're on Main Branch
```powershell
cd c:\Users\moraz\Desktop\inventory-management
git checkout main
```

### Step 2: Fetch Latest Changes
```powershell
git fetch origin
```

### Step 3: Pull Latest Changes
```powershell
git pull origin main
```

### Step 4: Verify Changes
```powershell
git log --oneline -5
```
You should see the new moderators commit.

### Step 5: Check What Changed
```powershell
git diff HEAD~1 HEAD
```

### Step 6: Install Dependencies (if needed)
```powershell
cd client
npm install

cd ../server
npm install
```

### Step 7: Run Development Servers
**Terminal 1 - Server:**
```powershell
cd c:\Users\moraz\Desktop\inventory-management\server
npm run dev
```

**Terminal 2 - Client:**
```powershell
cd c:\Users\moraz\Desktop\inventory-management\client
npm run dev
```

---

## Files Modified in This Commit

```
client/src/app/moderators/page.tsx (NEW)
  - Complete moderators management page
  - Create/delete moderators functionality
  - Password visibility toggle
  - Access control (Super Admin only)

client/src/app/(components)/Sidebar/index.tsx (MODIFIED)
  - Added Shield icon import
  - Added Moderators menu item (Super Admin only)
```

---

## Summary of Changes

✅ **New Feature: Moderators Management Page**
- Super Admin can view all moderators and Super Admins in a data table
- Create new moderators with name, email, and password
- Password visibility toggle (Eye icon)
- Delete moderators (Super Admin accounts cannot be deleted)
- Auto-generated admin IDs using UUID
- Only Moderator role can be created (no Super Admin creation option)
- Access restricted to Super Admin only

✅ **Sidebar Enhancement**
- New "Moderators" menu item with Shield icon
- Visible only to Super Admin

---

## Troubleshooting

### If Pull Fails with Conflict:
```powershell
git status
# Shows conflicting files
# Resolve conflicts in editor, then:
git add .
git commit -m "Merge: resolve conflicts"
git push origin main
```

### If You Need to Undo Last Commit (Before Push):
```powershell
git reset --soft HEAD~1
```

### If You Need to Undo Last Commit (After Push):
```powershell
git revert HEAD
git push origin main
```

### To See Detailed Changes:
```powershell
git show HEAD
```

### To See All Recent Commits:
```powershell
git log --oneline --graph --all -10
```

---

## Best Practices

1. Always pull before starting new work
2. Make meaningful, descriptive commit messages
3. Test locally before pushing
4. Never force push to main branch (`git push --force`)
5. Create feature branches for major changes, not main

---

## Testing After Pull

After team members pull the changes, they should:

1. Login with Super Admin credentials:
   - Email: `superadmin@inventory.com`
   - Password: `password123`

2. Navigate to "Moderators" menu item (new in sidebar)

3. Test creating a new moderator:
   - Fill name, email, password
   - Toggle password visibility
   - Click "Create Admin"

4. Test deleting a moderator:
   - Click trash icon on any moderator row
   - Confirm deletion

5. Verify Super Admin row cannot be deleted (trash icon disabled)
