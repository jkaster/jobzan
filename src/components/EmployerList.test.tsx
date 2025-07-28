import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import EmployerList from "./EmployerList";
import type { IEmployer } from "jobtypes";
import { axe } from 'jest-axe';

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("EmployerList", () => {
  const mockEmployers: IEmployer[] = [
    {
      id: "1",
      name: "Test Employer 1",
      latitude: 12.34,
      longitude: 56.78,
      contactName: "John Doe",
      contactPhone: "123-456-7890",
      contactEmail: "john.doe@example.com",
      website: "https://example.com",
    },
    {
      id: "2",
      name: "Test Employer 2",
      latitude: 43.21,
      longitude: 87.65,
      contactName: "Jane Doe",
      contactPhone: "098-765-4321",
      contactEmail: "jane.doe@example.com",
      website: "https://example2.com",
    },
  ];

  it("renders a list of employers", () => {
    render(
      <EmployerList
        employers={mockEmployers}
        onEdit={() => {}}
        onDelete={() => {}}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockEmployers.length}
      />,
    );
    expect(screen.getByText("Test Employer 1")).toBeInTheDocument();
    expect(screen.getByText("Test Employer 2")).toBeInTheDocument();
  });

  it("calls the onEdit and onDelete callbacks when the respective buttons are clicked", async () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    render(
      <EmployerList
        employers={mockEmployers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockEmployers.length}
      />,
    );
    await userEvent.click(screen.getAllByText("edit")[0]);
    expect(handleEdit).toHaveBeenCalledWith(mockEmployers[0]);
    await userEvent.click(screen.getAllByText("delete")[0]);
    expect(handleDelete).toHaveBeenCalledWith(mockEmployers[0].id);
  });

  it("renders and functions with pagination controls", () => {
    const handlePageChange = vi.fn();
    const handleRowsPerPageChange = vi.fn();
    render(
      <EmployerList
        employers={mockEmployers}
        onEdit={() => {}}
        onDelete={() => {}}
        page={0}
        rowsPerPage={5}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        count={mockEmployers.length}
      />,
    );
    expect(screen.getByLabelText("Rows per page:")).toBeInTheDocument();
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <EmployerList
        employers={mockEmployers}
        onEdit={() => {}}
        onDelete={() => {}}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        count={mockEmployers.length}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
