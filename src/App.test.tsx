import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import App from './App';
import { vi } from 'vitest';
import * as useJobDataModule from './hooks/useJobData';
import * as useGeolocationModule from './hooks/useGeolocation';
import * as useAuthModule from './hooks/useAuth';
import type { IJob, IEmployer } from 'jobtypes';
import { AllTheProviders } from './tests/setup';

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        app_title: "Job Application Tracker",
        filter_status: "Filter by Status",
        filter_commute: "Filter by Commute",
        search: "Search",
        sort_by: "Sort By",
        sort_order: "Sort Order",
        applied: "applied",
        remote: "remote",
        salary: "salary",
        employer: "employer",
        ascending: "ascending",
        descending: "descending",
        title: "title",
        lead: "lead",
        interview: "interview",
        offer: "offer",
        rejected: "rejected",
        "on-site": "on-site",
        hybrid: "hybrid",
        all_statuses: "All Statuses",
        all_commutes: "All Commutes",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock useGeolocation
vi.mock("./hooks/useGeolocation", () => ({
  default: () => ({
    userLocation: { latitude: 34.0522, longitude: -118.2437 },
    error: null,
  }),
}));

const mockJobs: IJob[] = [
  { id: '1', title: 'Software Engineer', employerId: '1', salary: 100000, status: 'applied', commute: 'remote', description: 'Develop software', notes: '' },
  { id: '2', title: 'QA Engineer', employerId: '2', salary: 80000, status: 'interview', commute: 'on-site', description: 'Test software', notes: '' },
  { id: '3', title: 'Product Manager', employerId: '1', salary: 120000, status: 'lead', commute: 'hybrid', description: 'Manage products', notes: '' },
  { id: '4', title: 'DevOps Engineer', employerId: '3', salary: 110000, status: 'applied', commute: 'remote', description: 'Automate deployments', notes: '' },
];

const mockEmployers: IEmployer[] = [
  {
    id: "1",
    name: "Tech Solutions",
    latitude: 34.0522,
    longitude: -118.2437,
    contactName: "John Doe",
    contactPhone: "123",
    contactEmail: "john@example.com",
    website: "tech.com",
  },
  {
    id: "2",
    name: "Innovate Corp",
    latitude: 34.0522,
    longitude: -118.2437,
    contactName: "Jane Smith",
    contactPhone: "456",
    contactEmail: "jane@example.com",
    website: "innovate.com",
  },
  {
    id: "3",
    name: "Global Dynamics",
    latitude: 34.0522,
    longitude: -118.2437,
    contactName: "Peter Jones",
    contactPhone: "789",
    contactEmail: "peter@example.com",
    website: "global.com",
  },
];

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(useJobDataModule, "default").mockReturnValue({
      jobs: mockJobs,
      employers: mockEmployers,
      addJob: vi.fn(),
      updateJob: vi.fn(),
      addEmployer: vi.fn(),
      updateEmployer: vi.fn(),
      deleteEmployer: vi.fn(),
    });
    vi.spyOn(useGeolocationModule, "default").mockReturnValue({
      userLocation: { latitude: 34.0522, longitude: -118.2437 },
      error: null,
    });
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { id: 'test-user', email: 'test@example.com', displayName: 'Test User' },
      token: 'test-token',
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the main application title", async () => {
    render(<App />, { wrapper: AllTheProviders });
    await waitFor(() =>
      expect(screen.getByTestId("app-title")).toBeInTheDocument(),
    );
  });

  it('filters jobs by status', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const filterStatus = screen.getByLabelText('Filter by Status');
    await userEvent.click(filterStatus);
    await userEvent.click(screen.getByRole('option', { name: 'lead' }));
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });

  it('filters jobs by commute type', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const filterCommute = screen.getByLabelText('Filter by Commute');
    await userEvent.click(filterCommute);
    await userEvent.click(screen.getByRole('option', { name: 'on_site' }));
    expect(screen.getByText('QA Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });

  it('searches jobs by title or employer name', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const searchInput = screen.getByLabelText('Search');
    await userEvent.type(searchInput, 'Software Engineer');
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.queryByText('QA Engineer')).not.toBeInTheDocument();
  });

  it('sorts jobs by salary in ascending order', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const sortBy = screen.getByLabelText('Sort By');
    await userEvent.click(sortBy);
    await userEvent.click(screen.getByRole('option', { name: 'salary' }));
    const rows = screen.getAllByRole('row');
    // The first row is the header, so we start from the second row
    expect(rows[1].children[0]).toHaveTextContent('QA Engineer');
    expect(rows[2].children[0]).toHaveTextContent('Software Engineer');
  });

  it('sorts jobs by salary in descending order', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const sortBy = screen.getByLabelText('Sort By');
    await userEvent.click(sortBy);
    await userEvent.click(screen.getByRole('option', { name: 'salary' }));
    const sortOrder = screen.getByLabelText('Sort Order');
    await userEvent.click(sortOrder);
    await userEvent.click(screen.getByRole('option', { name: 'descending' }));
    const rows = screen.getAllByRole('row');
    // The first row is the header, so we start from the second row
    expect(rows[1].children[0]).toHaveTextContent('Product Manager');
    expect(rows[2].children[0]).toHaveTextContent('DevOps Engineer');
  });

  it('sorts jobs by employer name in ascending order', async () => {
    render(<App />, { wrapper: AllTheProviders });
    const sortBy = screen.getByLabelText('Sort By');
    await userEvent.click(sortBy);
    await userEvent.click(screen.getByRole('option', { name: 'employer' }));
    const rows = screen.getAllByRole('row');
    // The first row is the header, so we start from the second row
    expect(rows[1].children[0]).toHaveTextContent('DevOps Engineer');
    expect(rows[2].children[0]).toHaveTextContent('QA Engineer');
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />, { wrapper: AllTheProviders });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
