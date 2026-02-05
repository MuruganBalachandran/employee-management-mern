# Roles and Permissions

## Super Admin
- Static account (cannot be deleted)
- Can create and delete Admins
- Has all Admin permissions

## Admin
- Can create, read, update, delete Employees
- Cannot edit Employee email or password
- Cannot edit Employee reporting manager, salary, or joining date

## Employee
- Can login
- Can view own profile
- Can edit own profile (name, age, department, phone, address)
- Cannot edit email, password, reporting manager, salary, joining date

## Authentication
- All roles can login
- All roles can view their own profile
- All roles can edit basic profile information (name only)
