# Notifications System - Replace Mock Data

## Progress Tracker

### 1. [PENDING] Backend - Notification Entity & Repo
- `demo/src/main/java/com/example/demo/entity/Notification.java`
- `demo/src/main/java/com/example/demo/repository/NotificationRepository.java`

### 2. [PENDING] Backend - Service & Controller
- `demo/src/main/java/com/example/demo/service/NotificationService.java`
- `demo/src/main/java/com/example/demo/controller/NotificationController.java`
  - GET /api/notifications (user's notifications)
  - POST /api/notifications (create)

### 3. [PENDING] Skill Match Notifications
- JobService.createJob → find workers with matching skills → create notifications
- Add skill match query in UserRepository

### 4. [PENDING] Application Status Notifications
- ApplicationService.create → notify employer
- ApplicationController accept/reject → update status + notify worker

### 5. [PENDING] Employer UI - Application Management
- AdminDashboard.js: Applications tab with accept/reject buttons

### 6. [PENDING] Frontend - NotificationsPage real API
- Replace mockNotifications → API fetch
- Mark as read endpoint

### 7. [PENDING] Frontend API service
- services/notificationAPI.js

**Next step: Step 1 Backend Entity/Repo**

**Current status:** Previous tasks complete (My applicants, apply styling, profile auto-fill, no completed jobs)

