# Updated Permission Matrix

## 🔒 Complete Permission Matrix

| Action | Super Admin | Admin | Employee |
|--------|-------------|-------|----------|
| **Login** | ✅ | ✅ | ✅ |
| **View Own Profile** | ✅ | ✅ | ✅ |
| **Edit Own Name** | ✅ | ✅ | ✅ |
| **Edit Own Password** | ✅ | ✅ | ✅ |
| **Edit Own Email** | ❌ | ❌ | ❌ |
| **Create Admin** | ✅ | ❌ | ❌ |
| **Delete Admin** | ✅ | ❌ | ❌ |
| **Create Employee** | ✅ | ✅ | ❌ |
| **View Employees** | ✅ | ✅ | ❌ |
| **Edit Employee (Basic)** | ✅ | ✅ | ❌ |
| **Delete Employee** | ✅ | ✅ | ❌ |

## 📝 Employee Creation vs Update

### ✅ During Creation (Admin/Super Admin)
**Can Set:**
- Name
- Email
- Password
- Age
- Department
- Phone
- Address
- **Salary** ⭐
- **Reporting Manager** ⭐
- **Joining Date** ⭐

### ✅ During Update (Admin/Super Admin)
**Can Edit:**
- Name
- Age
- Department
- Phone
- Address
- Personal Email

**Cannot Edit:**
- Email (work)
- Password
- **Salary** ❌
- **Reporting Manager** ❌
- **Joining Date** ❌

## 🎯 Key Rules

1. **Salary, Reporting Manager, Joining Date**:
   - ✅ Can be set during employee **creation**
   - ❌ Cannot be changed during employee **update**
   - 💡 These are "set once" fields

2. **Email & Password**:
   - ✅ Can be set during employee **creation**
   - ❌ Cannot be changed by Admin (only user themselves can change password)

3. **Super Admin**:
   - Static account, cannot be deleted
   - Has all Admin permissions
   - Can create and delete Admins

## 📋 Form Behavior

### Create Employee Form
Shows all fields including:
- Basic info (name, email, password, age, department, phone, address)
- **Salary** (optional)
- **Reporting Manager ID** (optional)
- **Joining Date** (optional)

### Edit Employee Form
Shows only editable fields:
- Name, Age, Department, Phone, Address, Personal Email
- Email field is **disabled**
- Password fields are **hidden**
- Salary, Reporting Manager, Joining Date are **hidden**

## 🔄 Data Flow

### Employee Creation
1. Admin fills form with all fields
2. Frontend sends: name, email, password, age, department, phone, address, **salary**, **reportingManager**, **joiningDate**
3. Backend validates all fields
4. Database stores all values
5. ✅ Employee created with complete profile

### Employee Update
1. Admin edits employee
2. Frontend shows only editable fields
3. Frontend strips: email, password, **salary**, **reportingManager**, **joiningDate**
4. Backend validates only allowed fields
5. Database updates only: name, age, department, phone, address, personalEmail
6. ✅ Employee updated with restrictions enforced
