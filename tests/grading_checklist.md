# Project Grading Checklist

## 1. MVC Pattern Implementation ✓
- [ ] Model
  - [ ] Test User model validation
  - [ ] Test Event model validation
  - [ ] Test model relationships (User-Event)

- [ ] View
  - [ ] Test all view templates render correctly
  - [ ] Test view data population
  - [ ] Test error message display

- [ ] Controller
  - [ ] Test user controller functions
  - [ ] Test event controller functions
  - [ ] Test error handling

## 2. User Integration ✓
- [ ] User Model
  - [ ] Test required fields validation
  - [ ] Test email uniqueness
  - [ ] Test password hashing

- [ ] User Operations
  - [ ] Test user registration
  - [ ] Test user login
  - [ ] Test user profile view
  - [ ] Test user logout

## 3. Event-User Association ✓
- [ ] Event Creation
  - [ ] Test event creation with host
  - [ ] Test event validation
  - [ ] Test event-user relationship

- [ ] Event Management
  - [ ] Test event editing by owner
  - [ ] Test event deletion by owner
  - [ ] Test unauthorized edit attempts
  - [ ] Test unauthorized delete attempts

## 4. Authorization ✓
- [ ] Guest Access
  - [ ] Test landing page access
  - [ ] Test about page access
  - [ ] Test contact page access
  - [ ] Test events page access
  - [ ] Test event detail page access

- [ ] Guest Restrictions
  - [ ] Test signup page access
  - [ ] Test login page access
  - [ ] Test profile page restriction
  - [ ] Test event creation restriction

- [ ] User Access
  - [ ] Test profile page access
  - [ ] Test event creation
  - [ ] Test own event management
  - [ ] Test logout functionality

## 5. Navigation ✓
- [ ] Dynamic Nav Bar
  - [ ] Test guest navigation options
  - [ ] Test user navigation options
  - [ ] Test user name display
  - [ ] Test responsive design

## 6. Flash Messages ✓
- [ ] Success Messages
  - [ ] Test registration success
  - [ ] Test login success
  - [ ] Test event creation success
  - [ ] Test event modification success

- [ ] Error Messages
  - [ ] Test validation errors
  - [ ] Test authentication errors
  - [ ] Test authorization errors
  - [ ] Test database errors

## 7. Database Requirements ✓
- [ ] MongoDB Atlas
  - [ ] Test database connection
  - [ ] Test data persistence
  - [ ] Test relationship queries

- [ ] Test Accounts
  - [ ] Verify test user accounts exist
  - [ ] Test account credentials work
  - [ ] Verify required events exist 