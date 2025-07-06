import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

describe("Layout", () => {
  it("renders the main heading", () => {
    render(
      <Layout>
        <div>Child Content</div>
      </Layout>,
    );
    expect(screen.getByText("Jobzan, the job hunter")).toBeInTheDocument();
  });
});
