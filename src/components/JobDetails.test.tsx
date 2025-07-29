import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import JobDetails from './JobDetails';
import type { IJob, IEmployer } from 'jobtypes';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('JobDetails', () => {
  const mockJob: IJob = {
    id: '1',
    title: 'Software Engineer',
    employerId: '1',
    salary: 100000,
    status: 'applied',
    commute: 'remote',
    description: 'A great job.',
    notes: 'Some notes.',
    jobDescriptionLink: 'https://example.com/job',
  };

  const mockEmployers: IEmployer[] = [
    {
      id: '1',
      name: 'Test Employer',
      latitude: 12.34,
      longitude: 56.78,
      contactName: 'John Doe',
      contactPhone: '123-456-7890',
      contactEmail: 'john.doe@example.com',
      website: 'https://example.com',
    },
  ];

  it('renders the job and employer details correctly', () => {
    render(<JobDetails job={mockJob} employers={mockEmployers} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Test Employer')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('displays an error message if the employer is not found', () => {
    render(<JobDetails job={mockJob} employers={[]} />);
    expect(screen.getByText('employer_not_found')).toBeInTheDocument();
  });
});
