// Mock data for Worker Dashboard
export const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'Build responsive web apps',
    fullDescription: 'Looking for experienced frontend dev with React skills...',
    salary: '$50/hr',
    location: 'Remote',
    status: 'OPEN',
    skill: 'React',
    employer: { name: 'Tech Corp' }
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    description: 'Design modern interfaces',
    fullDescription: 'Create beautiful UIs for mobile apps...',
    salary: '$45/hr',
    location: 'NYC',
    status: 'OPEN',
    skill: 'Design',
    employer: { name: 'Design Studio' }
  },
  // Add 5+ more
  {
    id: 3,
    title: 'Python Backend Dev',
    description: 'API development',
    salary: '$60/hr',
    location: 'Remote',
    status: 'CLOSED'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    description: 'CI/CD pipelines',
    salary: '$70/hr',
    location: 'SF',
    status: 'OPEN'
  },
  {
    id: 5,
    title: 'Mobile App Developer',
    description: 'React Native',
    salary: '$55/hr',
    location: 'Remote',
    status: 'OPEN'
  }
];

export const mockApplications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Frontend Developer',
    status: 'Applied',
    appliedDate: '2024-10-01'
  },
  {
    id: 2,
    jobId: 3,
    jobTitle: 'Python Backend Dev',
    status: 'Completed',
    appliedDate: '2024-09-25',
    rating: 4.5
  }
];

export const mockRatings = [
  {
    id: 1,
    jobTitle: 'Test Job',
    rating: 5,
    comment: 'Excellent work!',
    date: '2024-09-20'
  }
];

export const mockNotifications = [
  {
    id: 1,
    message: 'New job matching your React skills posted!',
    type: 'job-match',
    time: '2 mins ago',
    read: false
  },
  {
    id: 2,
    message: 'Your application for Frontend Dev has been shortlisted',
    type: 'application',
    time: '1 hour ago',
    read: false
  }
];

export const mockUser = {
  name: 'John Doe',
  skills: 'React, JavaScript, CSS',
  email: 'john@example.com',
  phone: '+1 234 567 8900',
  address: '123 Main St, NYC',
  role: 'WORKER'
};

