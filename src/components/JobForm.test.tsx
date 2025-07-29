import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import JobForm from './JobForm';
import type { IJob, IEmployer } from 'jobtypes';
import { axe } from 'jest-axe';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('JobForm', () => {
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

  it('renders the form with correct labels', () => {
    render(<JobForm onSubmit={() => {}} employers={mockEmployers} />);
    expect(screen.getByLabelText('title')).toBeInTheDocument();
    expect(screen.getByLabelText('employer')).toBeInTheDocument();
    expect(screen.getByLabelText('salary')).toBeInTheDocument();
    expect(screen.getByLabelText('status')).toBeInTheDocument();
    expect(screen.getByLabelText('commute')).toBeInTheDocument();
    expect(screen.getByLabelText('description')).toBeInTheDocument();
    expect(screen.getByLabelText('notes')).toBeInTheDocument();
    expect(screen.getByLabelText('job')).toBeInTheDocument();
  });

  it('pre-fills the form with job data when in edit mode', () => {
    const { container } = render(
      <JobForm job={mockJob} onSubmit={() => {}} employers={mockEmployers} />,
    );
    expect(screen.getByLabelText('title')).toHaveValue(mockJob.title);
    expect(screen.getByLabelText('employer')).toHaveValue(
      mockEmployers[0].name,
    );
    expect(screen.getByLabelText('salary')).toHaveValue(mockJob.salary);
    expect(container.querySelector('input[name="status"]')).toHaveValue(
      mockJob.status,
    );
    expect(container.querySelector('input[name="commute"]')).toHaveValue(
      mockJob.commute,
    );
    expect(screen.getByLabelText('description')).toHaveValue(
      mockJob.description,
    );
    expect(screen.getByLabelText('notes')).toHaveValue(mockJob.notes);
    expect(screen.getByLabelText('job')).toHaveValue(
      mockJob.jobDescriptionLink,
    );
  });

  it('calls the onSubmit callback with the correct data when the form is submitted', async () => {
    const handleSubmit = vi.fn();
    render(<JobForm onSubmit={handleSubmit} employers={mockEmployers} />);
    await userEvent.type(screen.getByLabelText('title'), 'New Job');
    await userEvent.click(screen.getByText('add_job'));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Job' }),
    );
  });

  it('selects an employer from the dropdown', async () => {
    render(<JobForm onSubmit={() => {}} employers={mockEmployers} />);
    await userEvent.click(screen.getByLabelText('employer'));
    await userEvent.click(screen.getByText('Test Employer'));
    expect(screen.getByLabelText('employer')).toHaveValue('Test Employer');
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <JobForm onSubmit={() => {}} employers={mockEmployers} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
