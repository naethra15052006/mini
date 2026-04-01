package com.example.demo;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("Data already exists, skipping initialization...");
            return;
        }

        System.out.println("Initializing sample data...");

        // Create Users
        User admin = new User();
        admin.setName("John Admin");
        admin.setEmail("admin@workbridge.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
admin.setRole(User.Role.ADMIN);
        admin.setStatus(User.Status.ACTIVE);
        admin.setLatitude(12.9716);
        admin.setLongitude(77.5946);
        admin.setSkills("Management");
        admin.setAvailability("Full-time");
        admin.setRating(5.0);
        admin = userRepository.save(admin);

        User alice = new User();
        alice.setName("Alice Employer");
        alice.setEmail("alice@company.com");
        alice.setPassword(passwordEncoder.encode("employer123"));
alice.setRole(User.Role.EMPLOYER);
        alice.setStatus(User.Status.ACTIVE);
        alice.setLatitude(12.9716);
        alice.setLongitude(77.5946);
        alice.setSkills("Project Management");
        alice.setAvailability("Flexible");
        alice.setRating(4.5);
        alice = userRepository.save(alice);

        User bob = new User();
        bob.setName("Bob Employer");
        bob.setEmail("bob@startup.com");
        bob.setPassword(passwordEncoder.encode("employer123"));
bob.setRole(User.Role.EMPLOYER);
        bob.setStatus(User.Status.ACTIVE);
        bob.setLatitude(13.0827);
        bob.setLongitude(80.2707);
        bob.setSkills("Business Development");
        bob.setAvailability("Flexible");
        bob.setRating(4.2);
        bob = userRepository.save(bob);

        User charlie = new User();
        charlie.setName("Charlie Worker");
        charlie.setEmail("charlie@email.com");
        charlie.setPassword(passwordEncoder.encode("worker123"));
charlie.setRole(User.Role.WORKER);
        charlie.setStatus(User.Status.ACTIVE);
        charlie.setLatitude(12.9716);
        charlie.setLongitude(77.5946);
        charlie.setSkills("Carpentry, Plumbing");
        charlie.setAvailability("Part-time");
        charlie.setRating(4.8);
        charlie = userRepository.save(charlie);

        User diana = new User();
        diana.setName("Diana Worker");
        diana.setEmail("diana@email.com");
        diana.setPassword(passwordEncoder.encode("worker123"));
        diana.setRole(User.Role.WORKER);
        diana.setLatitude(13.0827);
        diana.setLongitude(80.2707);
        diana.setSkills("Electrical, Painting");
        diana.setAvailability("Full-time");
        diana.setRating(4.6);
        diana = userRepository.save(diana);

        User eve = new User();
        eve.setName("Eve Worker");
        eve.setEmail("eve@email.com");
        eve.setPassword(passwordEncoder.encode("worker123"));
        eve.setRole(User.Role.WORKER);
        eve.setLatitude(12.9250);
        eve.setLongitude(77.6278);
        eve.setSkills("Cleaning, Cooking");
        eve.setAvailability("Part-time");
        eve.setRating(4.3);
        eve = userRepository.save(eve);

        // Create Jobs
        Job job1 = new Job();
        job1.setTitle("Home Renovation");
        job1.setDescription("Need experienced carpenter for home renovation work");
        job1.setSkill("Carpentry");
        job1.setWage(500.0);
        job1.setLatitude(12.9716);
        job1.setLongitude(77.5946);
        job1.setStatus(Job.JobStatus.OPEN);
        job1.setEmployer(alice);
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setTitle("Office Plumbing Repair");
        job2.setDescription("Plumbing issues in office building need immediate attention");
        job2.setSkill("Plumbing");
        job2.setWage(800.0);
        job2.setLatitude(13.0827);
        job2.setLongitude(80.2707);
        job2.setStatus(Job.JobStatus.OPEN);
        job2.setEmployer(bob);
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setTitle("Electrical Wiring Installation");
        job3.setDescription("New electrical wiring needed for warehouse");
        job3.setSkill("Electrical");
        job3.setWage(1200.0);
        job3.setLatitude(12.9250);
        job3.setLongitude(77.6278);
        job3.setStatus(Job.JobStatus.OPEN);
        job3.setEmployer(alice);
        job3 = jobRepository.save(job3);

        Job job4 = new Job();
        job4.setTitle("House Painting");
        job4.setDescription("Interior and exterior painting for 3BHK apartment");
        job4.setSkill("Painting");
        job4.setWage(600.0);
        job4.setLatitude(12.9716);
        job4.setLongitude(77.5946);
        job4.setStatus(Job.JobStatus.OPEN);
        job4.setEmployer(bob);
        job4 = jobRepository.save(job4);

        Job job5 = new Job();
        job5.setTitle("Deep Cleaning Service");
        job5.setDescription("Post-construction deep cleaning required");
        job5.setSkill("Cleaning");
        job5.setWage(400.0);
        job5.setLatitude(13.0827);
        job5.setLongitude(80.2707);
        job5.setStatus(Job.JobStatus.OPEN);
        job5.setEmployer(alice);
        job5 = jobRepository.save(job5);

        // Create Payments
        Payment pay1 = new Payment();
        pay1.setJob(job1);
        pay1.setWorker(charlie);
        pay1.setAmount(500.0);
        pay1.setStatus(Payment.PaymentStatus.PENDING);
        paymentRepository.save(pay1);

        Payment pay2 = new Payment();
        pay2.setJob(job2);
        pay2.setWorker(charlie);
        pay2.setAmount(800.0);
        pay2.setStatus(Payment.PaymentStatus.PAID);
        paymentRepository.save(pay2);

        Payment pay3 = new Payment();
        pay3.setJob(job3);
        pay3.setWorker(eve);
        pay3.setAmount(1200.0);
        pay3.setStatus(Payment.PaymentStatus.PENDING);
        paymentRepository.save(pay3);

        Payment pay4 = new Payment();
        pay4.setJob(job4);
        pay4.setWorker(diana);
        pay4.setAmount(600.0);
        pay4.setStatus(Payment.PaymentStatus.PAID);
        paymentRepository.save(pay4);

        // Create Ratings
        Rating rating1 = new Rating();
        rating1.setGivenBy(alice);
        rating1.setGivenTo(charlie);
        rating1.setRatingValue(4.5);
        ratingRepository.save(rating1);

        Rating rating2 = new Rating();
        rating2.setGivenBy(charlie);
        rating2.setGivenTo(alice);
        rating2.setRatingValue(5.0);
        ratingRepository.save(rating2);

        Rating rating3 = new Rating();
        rating3.setGivenBy(bob);
        rating3.setGivenTo(diana);
        rating3.setRatingValue(4.0);
        ratingRepository.save(rating3);

        Rating rating4 = new Rating();
        rating4.setGivenBy(diana);
        rating4.setGivenTo(bob);
        rating4.setRatingValue(4.5);
        ratingRepository.save(rating4);

        Rating rating5 = new Rating();
        rating5.setGivenBy(eve);
        rating5.setGivenTo(alice);
        rating5.setRatingValue(4.2);
        ratingRepository.save(rating5);

        System.out.println("Sample data initialized successfully!");
        System.out.println("Users created: " + userRepository.count());
        System.out.println("Jobs created: " + jobRepository.count());
        System.out.println("Payments created: " + paymentRepository.count());
        System.out.println("Ratings created: " + ratingRepository.count());
    }
}
