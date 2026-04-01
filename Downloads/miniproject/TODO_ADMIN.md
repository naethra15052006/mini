# Admin Dashboard Implementation TODO

## Backend Changes (Priority 1)
- [x] 1. Update User entity: add status enum/field (ACTIVE/BLOCKED) with @Column

- [x] 2. Enhance UserService: add getAdminStats(), getRecentUsers(5), getRecentJobs(5), updateUserStatus(id, status)
- [x] 3. Add to UserController: @PreAuthorize('ADMIN') endpoints - GET /admin/stats, GET /admin/workers, GET /admin/employers, PUT /admin/users/{id}/status
- [x] 4. Update JobService.postJob(): check if employer.status == BLOCKED, throw exception
- [x] 5. Add JobController admin endpoints: DELETE /admin/jobs/{id}, PUT /admin/jobs/{id}/status
- [ ] 6. Compile & test backend: mvn clean compile; Postman test new APIs (create admin user first)

## Frontend Changes (Priority 2)
- [ ] 7. Update frontend/src/services/api.js: export adminAPI with new methods (getStats, getWorkers, etc.)
- [ ] 8. Create frontend/src/components/WorkersManagement.js: table w/ search/filter/block actions, refresh
- [ ] 9. Create frontend/src/components/EmployersManagement.js: similar + view jobs link
- [ ] 10. Create frontend/src/components/JobsManagement.js: jobs table w/ delete/close actions
- [ ] 11. Update frontend/src/components/AdminDashboard.js: stats cards (Totals), recent activity tables
- [ ] 12. Update frontend/src/App.js: add ProtectedRoute for /admin/* role='ADMIN'
- [ ] 13. Update frontend/src/components/Sidebar.js: conditional admin nav links
- [ ] 14. Add frontend/src/components/AdminManagement.css for tables/buttons
- [ ] 15. npm start & test full admin flow

## Validation & Cleanup (Priority 3)
- [ ] 16. E2E test: Admin login, block/unblock, employer post blocked, real-time refresh
- [ ] 17. Verify security: non-admin can't access
- [ ] 18. Update TODOs/docs if needed
- [ ] 19. attempt_completion

**Current Progress: Starting Backend**
