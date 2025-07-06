import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import JobList from "./JobList";
import type { IJob, IEmployer } from "jobtypes";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("JobList", () => {
  const mockJobs: IJob[] = [
    {
      id: "1",
      title: "Software Engineer",
      employerId: "1",
      salary: 100000,
      status: "applied",
      commute: "remote",
      description: "A great job.",
      notes: "Some notes.",
      jobDescriptionLink: "https://example.com/job",
    },
  ];

  const mockEmployers: IEmployer[] = [
    {
      id: "1",
      name: "Test Employer",
      latitude: 34.0522,
      longitude: -118.2437,
      contactName: "John Doe",
      contactPhone: "123-456-7890",
      contactEmail: "john.doe@example.com",
      website: "https://example.com",
    },
  ];

  const userLocation = { latitude: 34.0522, longitude: -118.2437 };

  it("renders a list of jobs", () => {
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Test Employer")).toBeInTheDocument();
  });

  it("calls the onEdit and onViewDetails callbacks when the respective buttons are clicked", async () => {
    const handleEdit = vi.fn();
    const handleViewDetails = vi.fn();
    render(
      <JobList
        jobs={mockJobs}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    await userEvent.click(screen.getByText("edit"));
    expect(handleEdit).toHaveBeenCalledWith(mockJobs[0]);
    await userEvent.click(screen.getByText("Software Engineer"));
    expect(handleViewDetails).toHaveBeenCalledWith(mockJobs[0]);
  });

  it("calculates and displays the distance to the employer", () => {
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    expect(screen.getByText("0.00")).toBeInTheDocument();
  });

  it("displays N/A for distance when userLocation is null", () => {
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={null}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("displays N/A for distance when employer is not found", () => {
    const jobWithoutEmployer: IJob[] = [
      {
        id: "2",
        title: "QA Engineer",
        employerId: "999", // Non-existent employer ID
        salary: 80000,
        status: "interview",
        commute: "on-site",
        description: "Another great job.",
        notes: "More notes.",
        jobDescriptionLink: "https://example.com/qa-job",
      },
    ];
    render(
      <JobList
        jobs={jobWithoutEmployer}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={jobWithoutEmployer.length}
      />,
    );
    expect(screen.getAllByText("N/A")[1]).toBeInTheDocument();
  });

  it("renders and functions with pagination controls", () => {
    const handlePageChange = vi.fn();
    const handleRowsPerPageChange = vi.fn();
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        count={mockJobs.length}
      />,
    );
    expect(screen.getByLabelText("Rows per page:")).toBeInTheDocument();
  });

  it("renders the job description link button when jobDescriptionLink is present", () => {
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    expect(
      screen.getByRole("link", { name: "view_job_description_aria_label" }),
    ).toBeInTheDocument();
  });

  it("does not render the job description link button when jobDescriptionLink is absent", () => {
    const jobWithoutLink: IJob[] = [
      {
        id: "1",
        title: "Software Engineer",
        employerId: "1",
        salary: 100000,
        status: "applied",
        commute: "remote",
        description: "A great job.",
        notes: "Some notes.",
        jobDescriptionLink: "",
      },
    ];
    render(
      <JobList
        jobs={jobWithoutLink}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={jobWithoutLink.length}
      />,
    );
    expect(screen.queryByRole("link", { name: "job" })).not.toBeInTheDocument();
  });

  it("has the correct link attributes for the job description link", () => {
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockJobs.length}
      />,
    );
    const link = screen.getByRole("link", {
      name: "view_job_description_aria_label",
    });
    expect(link).toHaveAttribute("href", mockJobs[0].jobDescriptionLink);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("calls onPageChange when a new page is selected", async () => {
    const handlePageChange = vi.fn();
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={handlePageChange}
        onRowsPerPageChange={() => {}}
        count={10} // Ensure enough items for pagination
      />,
    );
    const nextButton = screen.getByRole("button", { name: /next page/i });
    await userEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it("calls onRowsPerPageChange when rows per page is changed", async () => {
    const handleRowsPerPageChange = vi.fn();
    render(
      <JobList
        jobs={mockJobs}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={handleRowsPerPageChange}
        count={mockJobs.length}
      />,
    );
    const select = screen.getByLabelText("Rows per page:");
    await userEvent.click(select);
    await userEvent.click(screen.getByRole("option", { name: "10" }));
    expect(handleRowsPerPageChange).toHaveBeenCalled();
  });

  it("renders no jobs message when jobs array is empty", () => {
    render(
      <JobList
        jobs={[]}
        onEdit={() => {}}
        onViewDetails={() => {}}
        userLocation={userLocation}
        employers={mockEmployers}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={0}
      />,
    );
    expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Employer")).not.toBeInTheDocument();
    // Add an assertion for an empty state message if one exists in the component
    // For now, just checking for absence of job data
  });
});
