package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/workers")
    public ResponseEntity<List<User>> getAllWorkers() {
        return ResponseEntity.ok(userService.getAllWorkers());
    }

    @GetMapping("/employers")
    public ResponseEntity<List<User>> getAllEmployers() {
        return ResponseEntity.ok(userService.getAllEmployers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map> getAdminStats() {
        return ResponseEntity.ok(userService.getAdminStats());
    }

    @GetMapping("/admin/recent-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getRecentUsers() {
        return ResponseEntity.ok(userService.getRecentUsers());
    }

    @GetMapping("/admin/workers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAdminWorkers() {
        return ResponseEntity.ok(userService.getAllWorkers());
    }

    @GetMapping("/admin/employers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAdminEmployers() {
        return ResponseEntity.ok(userService.getAllEmployers());
    }

    @PutMapping("/admin/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> blockUser(@PathVariable Long id) {
        User blocked = userService.updateUserStatus(id, User.Status.BLOCKED);
        return ResponseEntity.ok(blocked);
    }

    @PutMapping("/admin/users/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> unblockUser(@PathVariable Long id) {
        User unblocked = userService.updateUserStatus(id, User.Status.ACTIVE);
        return ResponseEntity.ok(unblocked);
    }
}
