# Authentication System Documentation

## Overview
The authentication system has been implemented with role-based access control (RBAC) with two roles:
- **Super Admin**: Full access to all features including user and expense management
- **Moderator**: Limited access - can view inventory, products, and settings but cannot access users or expenses pages

## Test Credentials

### Super Admin Account
- **Email**: superadmin@inventory.com
- **Password**: password123
- **Role**: SUPER_ADMIN

### Moderator Account
- **Email**: moderator@inventory.com
- **Password**: password123
- **Role**: MODERATOR

## Features Implemented

### 1. Sign-In Page (`/signin`)
- Dark theme with black and gray colors matching the project design
- Email and password fields with show/hide password toggle
- Clean, modern UI with proper error handling
- Automatic redirect to dashboard on successful sign-in
- Automatic redirect to sign-in if not authenticated

### 2. Database Schema
Updated Prisma schema with:
- New `Admin` model with fields: `adminId`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`
- `Role` enum with `SUPER_ADMIN` and `MODERATOR` values
- Database migration created and applied

### 3. Authentication Controller & Routes
- **POST /auth/signin**: Sign in with email and password
- **POST /auth/create**: Create new admin (super admin only)
- **GET /auth/admins**: Get all admins
- **DELETE /auth/admins/:adminId**: Delete admin (prevents deletion of only super admin)

### 4. Role-Based Navigation
The sidebar now shows different menu items based on user role:
- **Super Admin**: Sees all menu items (Dashboard, Inventory, Products, Users, Settings, Expenses)
- **Moderator**: Only sees Dashboard, Inventory, Products, Settings (Users and Expenses are hidden)

### 5. User Management (`/users`)
- **Super Admin Only**: Can create new users and delete existing users
- Modal form for creating users with User ID, Name, and Email fields
- Delete confirmation dialog
- Users page shows action buttons only for super admins

### 6. Expenses Page (`/expenses`)
- **Super Admin Only**: Full access to view expenses
- **Moderators**: Access denied with clear message
- Expenses menu item only visible for super admins in sidebar

### 7. Protected Routes
- Routes are protected at the component level
- Unauthenticated users are redirected to `/signin`
- Role-based access is enforced with access denied pages

### 8. Session Management
- Admin information stored in Redux state
- Logout button in sidebar footer
- User info displayed in sidebar (name, email, role)

## Redux State Updates
Added new state slices to manage authentication:
```typescript
- admin: Admin | null
- isAuthenticated: boolean
- setAdmin(admin): Set authenticated user
- logout(): Clear authentication
```

## API Endpoints Summary

### Authentication
- `POST /auth/signin` - Sign in user
- `POST /auth/create` - Create new admin
- `GET /auth/admins` - Get all admins
- `DELETE /auth/admins/:adminId` - Delete admin

### Users Management (Super Admin Only)
- `GET /users` - Get all users
- `POST /users` - Create new user
- `DELETE /users/:userId` - Delete user

## Security Notes
⚠️ **Important**: This is a simplified authentication system without JWT tokens. For production:
1. Hash passwords using bcrypt
2. Implement JWT tokens for session management
3. Add password strength validation
4. Implement rate limiting on sign-in attempts
5. Add HTTPS/SSL encryption
6. Implement refresh token mechanism
7. Add CSRF protection
8. Implement proper access control on backend routes

## Testing the System

1. **Sign In as Super Admin**:
   - Navigate to `/signin`
   - Enter: superadmin@inventory.com / password123
   - Should see all menu items and have full access

2. **Sign In as Moderator**:
   - Navigate to `/signin`
   - Enter: moderator@inventory.com / password123
   - Should NOT see Users and Expenses menu items
   - Attempting to access `/users` or `/expenses` shows access denied

3. **Create New User** (Super Admin Only):
   - Navigate to `/users`
   - Click "Add User" button
   - Fill in User ID, Name, Email
   - Submit to create new user

4. **Delete User** (Super Admin Only):
   - In Users page, click delete icon on any user row
   - Confirm deletion

## File Changes Made

### Backend
- `/server/src/controllers/authController.ts` - New auth controller
- `/server/src/routes/authRoutes.ts` - New auth routes
- `/server/src/controllers/userController.ts` - Updated with create/delete methods
- `/server/src/routes/userRoutes.ts` - Updated with new routes
- `/server/src/index.ts` - Added auth routes
- `/server/prisma/schema.prisma` - Added Admin model and Role enum
- `/server/prisma/seed.ts` - Added test admin accounts

### Frontend
- `/client/src/app/signin/page.tsx` - New sign-in page
- `/client/src/state/index.ts` - Added auth state management
- `/client/src/state/api.ts` - Added auth API endpoints
- `/client/src/app/dashboardWrapper.tsx` - Added auth protection and role checks
- `/client/src/app/(components)/Sidebar/index.tsx` - Role-based menu items and logout
- `/client/src/app/users/page.tsx` - Added create/delete user functionality
- `/client/src/app/expenses/page.tsx` - Added super admin only check

## Next Steps (Recommendations)
1. Implement password hashing with bcrypt
2. Add JWT authentication
3. Add email verification
4. Implement password reset functionality
5. Add admin activity logging
6. Add two-factor authentication
7. Implement role hierarchy system
