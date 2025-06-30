import type { Job } from './types/Job';
import type { Employer } from './types/Employer';

export const mockEmployers: Employer[] = [
  {
    id: 'emp1',
    name: 'Google',
    location: {
      latitude: 37.422,
      longitude: -122.084,
    },
    contactName: 'John Doe',
    contactPhone: '555-111-2222',
    contactEmail: 'john.doe@google.com',
  },
  {
    id: 'emp2',
    name: 'Facebook',
    location: {
      latitude: 37.484,
      longitude: -122.148,
    },
    contactName: 'Jane Smith',
    contactPhone: '555-333-4444',
    contactEmail: 'jane.smith@facebook.com',
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job1',
    employerId: 'emp1',
    title: 'Software Engineer',
    salary: 150000,
    status: 'applied',
    commute: 'hybrid',
    description: 'Develop and maintain software.',
    notes: 'Interviewed with hiring manager.',
  },
  {
    id: 'job2',
    employerId: 'emp1',
    title: 'Senior Software Engineer',
    salary: 180000,
    status: 'interview',
    commute: 'hybrid',
    description: 'Lead a team of software engineers.',
    notes: 'Second round interview scheduled.',
  },
  {
    id: 'job3',
    employerId: 'emp2',
    title: 'Product Manager',
    salary: 160000,
    status: 'lead',
    commute: 'on-site',
    description: 'Define product roadmap.',
    notes: 'Reached out to recruiter.',
  },
];