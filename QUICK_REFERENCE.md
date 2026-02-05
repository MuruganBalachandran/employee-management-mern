# Quick Reference Guide

## 🔑 Roles & Permissions

| Feature | Super Admin | Admin | Employee |
|---------|-------------|-------|----------|
| Login | ✅ | ✅ | ✅ |
| View Profile | ✅ | ✅ | ✅ |
| Edit Name | ✅ | ✅ | ✅ |
| Edit Password | ✅ | ✅ | ✅ |
| Create Admin | ✅ | ❌ | ❌ |
| Delete Admin | ✅ | ❌ | ❌ |
| CRUD Employees | ✅ | ✅ | ❌ |

## 📝 Editable Employee Fields

### ✅ Admin Can Edit
- Name
- Age
- Department
- Phone
- Address
- Personal Email

### ❌ Admin Cannot Edit
- Email (work)
- Password
- Salary
- Reporting Manager
- Joining Date

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile

### Employees (Admin/Super Admin)
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee
- `POST /api/employees` - Create employee
- `PATCH /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Super Admin Only
- `POST /api/super-admin` - Create admin
- `DELETE /api/super-admin/:id` - Delete admin

## 🎨 Frontend Routes

### Public
- `/login` - Login page

### Protected (All Users)
- `/` - Home
- `/me` - My profile
- `/me/edit` - Edit profile

### Admin/Super Admin
- `/employees` - Employee list
- `/employees/create` - Create employee
- `/employees/edit/:id` - Edit employee
- `/employees/view/:id` - View employee

### Super Admin Only
- `/create-admin` - Create admin

## 🗂️ Data Structure

### User Model (Auth)
```javascript
{
  Name: String,
  Email: String (unique),
  Password: String (hashed),
  Role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE",
  Is_Deleted: 0 | 1,
  Created_At: String,
  Updated_At: String
}
```

### Employee Model (Profile)
```javascript
{
  User_Id: ObjectId (FK to User),
  Admin_Id: ObjectId (FK to Admin),
  Age: Number,
  Department: String,
  Phone: String,
  Address: Object,
  Salary: Number,
  Reporting_Manager: ObjectId,
  Joining_date: Date,
  Is_Active: 0 | 1,
  Is_Deleted: 0 | 1,
  Created_At: String,
  Updated_At: String
}
```

### Admin Model (Profile)
```javascript
{
  User_Id: ObjectId (FK to User),
  Is_Deleted: 0 | 1,
  Created_At: String,
  Updated_At: String
}
```

## 🔒 Security Rules

1. **Email**: Read-only, cannot be changed
2. **Password**: Can only be changed by user themselves
3. **Salary**: Cannot be edited by Admin
4. **Reporting Manager**: Cannot be edited by Admin
5. **Joining Date**: Cannot be edited by Admin
6. **Super Admin**: Cannot be deleted

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation Files

- `ROLES_AND_PERMISSIONS.md` - Role definitions
- `FRONTEND_BACKEND_ALIGNMENT.md` - System architecture
- `TESTING_CHECKLIST.md` - Test scenarios
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details

## 🐛 Common Issues

### Issue: Email already exists
**Solution**: Email must be unique. Use different email.

### Issue: Cannot edit employee email
**Solution**: This is by design. Email cannot be changed.

### Issue: Super Admin deleted
**Solution**: Super Admin cannot be deleted. Check role.

### Issue: Admin cannot access /create-admin
**Solution**: Only Super Admin can create admins.

## 💡 Tips

1. **Testing**: Use TESTING_CHECKLIST.md
2. **Permissions**: Check FRONTEND_BACKEND_ALIGNMENT.md
3. **API**: All endpoints require authentication token
4. **Errors**: Check backend console for detailed errors
