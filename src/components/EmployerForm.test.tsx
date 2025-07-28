import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import EmployerForm from "./EmployerForm";
import type { IEmployer } from "jobtypes";
import { axe } from 'jest-axe';

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("EmployerForm", () => {
  const mockEmployer: IEmployer = {
    id: "1",
    name: "Test Employer",
    latitude: 12.34,
    longitude: 56.78,
    contactName: "John Doe",
    contactPhone: "123-456-7890",
    contactEmail: "john.doe@example.com",
    website: "https://example.com",
  };

  it("renders the form with correct labels", () => {
    render(<EmployerForm onSubmit={() => {}} />);
    expect(screen.getByLabelText("Company Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Longitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Website")).toBeInTheDocument();
  });

  it("pre-fills the form with employer data when in edit mode", () => {
    render(<EmployerForm employer={mockEmployer} onSubmit={() => {}} />);
    expect(screen.getByLabelText("Company Name")).toHaveValue(
      mockEmployer.name,
    );
    expect(screen.getByLabelText("Latitude")).toHaveValue(
      mockEmployer.latitude,
    );
    expect(screen.getByLabelText("Longitude")).toHaveValue(
      mockEmployer.longitude,
    );
    expect(screen.getByLabelText("Contact Name")).toHaveValue(
      mockEmployer.contactName,
    );
    expect(screen.getByLabelText("Contact Phone")).toHaveValue(
      mockEmployer.contactPhone,
    );
    expect(screen.getByLabelText("Contact Email")).toHaveValue(
      mockEmployer.contactEmail,
    );
    expect(screen.getByLabelText("Website")).toHaveValue(mockEmployer.website);
    expect(screen.getByText("update_employer")).toBeInTheDocument();
  });

  it("calls the onSubmit callback with the correct data when the form is submitted", async () => {
    const handleSubmit = vi.fn();
    render(<EmployerForm onSubmit={handleSubmit} />);
    await userEvent.type(screen.getByLabelText("Company Name"), "New Employer");
    await userEvent.click(screen.getByText("add_employer"));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Employer" }),
    );
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(<EmployerForm onSubmit={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});