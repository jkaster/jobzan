import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import App from './App';
import { vi } from 'vitest';
import * as useJobDataModule from './hooks/useJobData';
import * as useGeolocationModule from './hooks/useGeolocation';
import type { IJob, IEmployer } from 'jobtypes';

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the main application title", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>,
    );
    await waitFor(() =>
      expect(screen.getByTestId("app-title")).toBeInTheDocument(),
    );
  });

  it.todo("filters jobs by status");

  it.todo("filters jobs by commute type");

  it.todo("searches jobs by title or employer name");

  it.todo("sorts jobs by salary in ascending order");

  it.todo("sorts jobs by salary in descending order");

  it.todo("sorts jobs by employer name in ascending order");
});
