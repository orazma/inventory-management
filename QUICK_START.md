# Quick Start Guide - Sign-In System

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database running
- `.env` file configured in both `client/` and `server/` directories

### Setup Steps

1. **Seed the database**:
   ```bash
   cd server
   npx prisma db seed
   ```
   This creates:
   - Super Admin account (superadmin@inventory.com / password123)
   - Moderator account (moderator@inventory.com / password123)

2. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```
   Server runs on: `http://localhost:3001`

3. **Start the frontend** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   App runs on: `http://localhost:3000`

## 🔐 Login Options

### Option 1: Super Admin Account
```
Email: superadmin@inventory.com
Password: password123
```
**Permissions**: Full access to all features

### Option 2: Moderator Account
```
Email: moderator@inventory.com
Password: password123
```
**Permissions**: Limited access (no Users or Expenses pages)

## 📋 Feature Comparison

| Feature | Super Admin | Moderator |
|---------|:-----------:|:---------:|
| Dashboard | ✅ | ✅ |
| Inventory | ✅ | ✅ |
| Products | ✅ | ✅ |
| Settings | ✅ | ✅ |
| Users | ✅ | ❌ |
| Expenses | ✅ | ❌ |
| Create Users | ✅ | ❌ |
| Delete Users | ✅ | ❌ |

## 🎯 Key Pages

| Page | URL | Access |
|------|-----|--------|
| Sign In | `/signin` | Public |
| Dashboard | `/dashboard` | Authenticated |
| Inventory | `/inventory` | Authenticated |
| Products | `/products` | Authenticated |
| Users | `/users` | Super Admin Only |
| Expenses | `/expenses` | Super Admin Only |
| Settings | `/settings` | Authenticated |

## 💡 Common Tasks

### Create a New User (Super Admin Only)
1. Sign in as super admin
2. Navigate to `/users`
3. Click "Add User" button
4. Fill in User ID, Name, Email
5. Click "Create User"

### Delete a User (Super Admin Only)
1. Sign in as super admin
2. Navigate to `/users`
3. Click the trash icon next to the user
4. Confirm deletion

### Create New Admin Account (Super Admin Only)
Via API:
```bash
curl -X POST http://localhost:3001/auth/create \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin-003",
    "name": "New Moderator",
    "email": "newmoderator@inventory.com",
    "password": "password123",
    "role": "MODERATOR"
  }'
```

## 🐛 Troubleshooting

### Issue: "Invalid email or password" on sign-in
- **Solution**: Check test credentials above
- **Verify**: Database has been seeded with `npx prisma db seed`

### Issue: Cannot access Users page as Super Admin
- **Solution**: Refresh the page or restart server
- **Check**: Admin role is correctly set in database

### Issue: Sidebar menu items not showing/hiding properly
- **Solution**: Clear browser cache or do a hard refresh (Ctrl+Shift+R)
- **Check**: Logged in as correct role

### Issue: "Access Denied" on `/expenses` as Moderator
- **This is expected behavior** - Moderators cannot access expenses
- **Solution**: Log in as Super Admin to view expenses

## 🔄 Logout

Click the "Logout" button in the sidebar footer to:
- Clear authentication session
- Redirect to sign-in page
- Remove admin info from Redux state

## 📝 Adding More Test Accounts

1. Edit `server/prisma/seed.ts`
2. Add new `prisma.admin.create()` calls
3. Run `npx prisma db seed` again

Example:
```typescript
await prisma.admin.create({
  data: {
    adminId: "admin-004",
    name: "Your Name",
    email: "youremail@inventory.com",
    password: "password123",
    role: "SUPER_ADMIN", // or "MODERATOR"
  },
});
```

## 📚 API Documentation

### Sign In
```
POST /auth/signin
Content-Type: application/json

{
  "email": "superadmin@inventory.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "admin": {
    "adminId": "admin-001",
    "name": "Super Admin",
    "email": "superadmin@inventory.com",
    "role": "SUPER_ADMIN"
  }
}
```

### Create User
```
POST /users
Content-Type: application/json

{
  "userId": "user-101",
  "name": "John Doe",
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "user": {
    "userId": "user-101",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## ⚠️ Remember

- **Passwords are stored in plain text** for demo purposes only
- Never use this in production without implementing bcrypt
- All auth is session-based without JWT tokens
- Role checks are only frontend-based in this version

For production, refer to `AUTHENTICATION_SYSTEM.md` for security recommendations.
