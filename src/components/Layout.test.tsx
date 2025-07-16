import { render, screen } from "@testing-library/react";
import Layout from "./Layout";
import { AllTheProviders } from '../tests/setup';

describe("Layout", () => {
  it("renders the main heading", () => {
    render(
      <Layout>
        <div>Child Content</div>
      </Layout>,
      { wrapper: AllTheProviders }
    );
    expect(screen.getByText("Jobzan, the job hunter")).toBeInTheDocument();
  });
});
