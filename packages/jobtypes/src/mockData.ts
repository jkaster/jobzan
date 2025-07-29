import type { IJob } from './IJob';
import type { IEmployer } from './IEmployer';

/**
 * Helper function to get a random item from an array.
 * @template T
 * @param {T[]} arr - The array to get a random item from.
 * @returns {T} A random item from the array.
 */
const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Mock data for generating realistic-looking company names.
 * @type {string[]}
 */
const companyNames = [
  'Tech Solutions Inc.',
  'Global Innovations',
  'Future Systems LLC',
  'Apex Dynamics',
  'Quantum Corp.',
  'Synergy Labs',
  'Visionary Tech',
  'Dynamic Solutions',
  'Pinnacle Group',
  'Elite Innovations',
  'Bright Minds',
  'Creative Works',
  'Digital Frontier',
  'Evergreen Systems',
  'First Class Tech',
  'Grand Innovations',
  'High Tech Solutions',
  'Infinite Systems',
  'Jumbo Corp.',
  'Keystone Labs',
  'Leading Edge',
  'Modern Tech',
  'Next Gen Systems',
  'Optimal Solutions',
  'Prime Innovations',
];

/**
 * Mock data for generating realistic-looking contact names.
 * @type {string[]}
 */
const contactNames = [
  'Alice Smith',
  'Bob Johnson',
  'Charlie Brown',
  'Diana Prince',
  'Eve Adams',
  'Frank White',
  'Grace Lee',
  'Harry Davis',
  'Ivy Chen',
  'Jack Wilson',
];

/**
 * Generates 25 mock employers.
 * @type {IEmployer[]}
 */
export const mockEmployers: IEmployer[] = Array.from({ length: 25 }).map(
  (_, i) => {
    const name = getRandomItem(companyNames) + ' ' + (i + 1);
    const contactName = getRandomItem(contactNames);
    return {
      id: `emp${i + 1}`,
      name,
      latitude: parseFloat((Math.random() * (90 - -90) + -90).toFixed(4)),
      longitude: parseFloat((Math.random() * (180 - -180) + -180).toFixed(4)),
      contactName,
      contactPhone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      contactEmail: `${contactName.toLowerCase().replace(/ /g, '.')}}@${name
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/\./g, '')
        .replace(/inc|llc|corp/g, '')}.com`,
      website: `https://www.${name
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/\./g, '')
        .replace(/inc|llc|corp/g, '')}.com`,
    };
  },
);

/**
 * Mock data for generating realistic-looking job titles.
 * @type {string[]}
 */
const jobTitles = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'QA Engineer',
  'Business Analyst',
  'Project Manager',
  'Scrum Master',
  'Technical Writer',
  'Cloud Engineer',
  'Security Analyst',
];

/**
 * Mock data for generating realistic-looking job statuses.
 * @type {IJob['status'][]}
 */
const jobStatuses: IJob['status'][] = [
  'lead',
  'applied',
  'interview',
  'offer',
  'rejected',
];

/**
 * Mock data for generating realistic-looking job commutes.
 * @type {IJob['commute'][]}
 */
const jobCommutes: IJob['commute'][] = ['remote', 'hybrid', 'on-site'];

/**
 * Generates 50 mock jobs.
 * @type {IJob[]}
 */
export const mockJobs: IJob[] = Array.from({ length: 50 }).map((_, i) => {
  const employer = getRandomItem(mockEmployers);
  const title = getRandomItem(jobTitles);
  const salary = Math.floor(Math.random() * (200000 - 80000 + 1)) + 80000;
  const status = getRandomItem(jobStatuses);
  const commute = getRandomItem(jobCommutes);

  return {
    id: `job${i + 1}`,
    employerId: employer.id,
    title,
    salary,
    status,
    commute,
    description: `This is a detailed description for the ${title} position at ${employer.name}.`,
    notes: `Notes for job ${i + 1}. Applied on ${new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`,
    jobDescriptionLink: `https://example.com/job/${i + 1}`,
  };
});
