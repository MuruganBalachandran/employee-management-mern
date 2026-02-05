# Testing Checklist - Employee Management System

## 🔐 Authentication Tests

### Login
- [ ] Super Admin can login
- [ ] Admin can login
- [ ] Employee can login
- [ ] Invalid credentials are rejected
- [ ] Token is stored correctly

### Profile Access
- [ ] All users can view their own profile
- [ ] Profile shows correct user data (Name, Email, Role)

---

## 👤 Super Admin Tests

### Admin Management
- [ ] Can create new Admin
- [ ] Cannot create Admin with duplicate email
- [ ] Can delete Admin
- [ ] Cannot delete Super Admin account
- [ ] Can view list of Admins (if implemented)

### Employee Management (Acts as Admin)
- [ ] Can view all employees
- [ ] Can create new employee
- [ ] Can edit employee (basic fields only)
- [ ] Can delete employee
- [ ] Cannot edit employee email
- [ ] Cannot edit employee password
- [ ] Cannot edit employee salary
- [ ] Cannot edit employee reporting manager
- [ ] Cannot edit employee joining date

### Profile Management
- [ ] Can view own profile
- [ ] Can edit own name
- [ ] Can edit own password
- [ ] Cannot edit own email

---

## 👔 Admin Tests

### Employee Management
- [ ] Can view all employees
- [ ] Can create new employee
- [ ] Can edit employee (basic fields only)
- [ ] Can delete employee
- [ ] Cannot edit employee email
- [ ] Cannot edit employee password
- [ ] Cannot edit employee salary
- [ ] Cannot edit employee reporting manager
- [ ] Cannot edit employee joining date

### Restrictions
- [ ] Cannot access Super Admin routes (/create-admin)
- [ ] Cannot create Admins
- [ ] Cannot delete Admins

### Profile Management
- [ ] Can view own profile
- [ ] Can edit own name
- [ ] Can edit own password
- [ ] Cannot edit own email

---

## 👨‍💼 Employee Tests

### Profile Management
- [ ] Can view own profile
- [ ] Can edit own name
- [ ] Can edit own password
- [ ] Cannot edit own email

### Restrictions
- [ ] Cannot access employee management routes
- [ ] Cannot view other employees
- [ ] Cannot create employees
- [ ] Cannot edit employees
- [ ] Cannot delete employees
- [ ] Cannot access admin creation

---

## 📝 Employee Update Field Tests

### Allowed Fields (Admin/Super Admin)
- [ ] Name - ✅ Can update
- [ ] Age - ✅ Can update
- [ ] Department - ✅ Can update
- [ ] Phone - ✅ Can update
- [ ] Address (all fields) - ✅ Can update
- [ ] Personal Email - ✅ Can update

### Restricted Fields (Admin/Super Admin)
- [ ] Email (work) - ❌ Cannot update
- [ ] Password - ❌ Cannot update
- [ ] Salary - ❌ Cannot update
- [ ] Reporting Manager - ❌ Cannot update
- [ ] Joining Date - ❌ Cannot update

---

## 🔄 Data Consistency Tests

### Name Updates
- [ ] Updating employee name updates User model
- [ ] Updated name appears in employee list
- [ ] Updated name appears in employee detail view

### Email Consistency
- [ ] Email is read-only in edit forms
- [ ] Email comes from User model (not Employee model)
- [ ] Email is consistent across all views

### Deletion Tests
- [ ] Deleting employee soft-deletes User record
- [ ] Deleting employee soft-deletes Employee record
- [ ] Deleted employee doesn't appear in lists
- [ ] Super Admin cannot be deleted

---

## 🚀 Frontend Tests

### Service Layer
- [ ] employeeService strips restricted fields before API call
- [ ] superAdminService uses correct endpoints
- [ ] API errors are handled gracefully

### Routes
- [ ] Super Admin can access all routes
- [ ] Admin can access employee routes
- [ ] Admin cannot access super admin routes
- [ ] Employee can only access profile routes
- [ ] Unauthenticated users redirected to login

### Forms
- [ ] Email field disabled during employee edit
- [ ] Password fields hidden during employee edit
- [ ] Form validation works correctly
- [ ] Success/error messages display properly

---

## 🎯 Backend Tests

### Controllers
- [ ] Validation errors return proper format
- [ ] Duplicate email returns 400 error
- [ ] Unauthorized access returns 401/403
- [ ] Not found returns 404

### Queries
- [ ] Employee queries use $lookup for Name/Email
- [ ] Admin queries use $lookup for Name/Email
- [ ] Updates only modify allowed fields
- [ ] Soft delete sets Is_Deleted = 1

### Models
- [ ] User model has unique email constraint
- [ ] Password hashing works on create/update
- [ ] Timestamps update correctly
- [ ] No duplicate Name/Email in Employee/Admin models

---

## 🔍 Edge Cases

### Concurrent Updates
- [ ] Multiple admins editing same employee
- [ ] Name update race conditions

### Invalid Data
- [ ] Invalid ObjectId returns proper error
- [ ] Missing required fields returns validation error
- [ ] Invalid department returns error

### Permissions
- [ ] Token expiration handled
- [ ] Role changes require re-login
- [ ] Cross-role access blocked

---

## 📊 Performance Tests

### Query Optimization
- [ ] Employee list loads quickly with pagination
- [ ] $lookup operations are efficient
- [ ] Indexes are used correctly

### Database Hits
- [ ] Create operations: 2 hits (User + Employee/Admin)
- [ ] Update operations: 1-2 hits depending on fields
- [ ] Delete operations: 1-2 hits (Employee + User)

---

## ✅ Success Criteria

All tests must pass before deployment:
- ✅ All authentication flows work
- ✅ All permission restrictions enforced
- ✅ All CRUD operations work correctly
- ✅ No unauthorized access possible
- ✅ Data consistency maintained
- ✅ Frontend-backend alignment verified
- ✅ Error handling works properly
- ✅ Performance is acceptable
