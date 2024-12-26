import { describe, test, expect } from "vitest";
import RegisterForm from "../../components/registerForm";
import { createTestRouter, renderComponent } from "../utils";

const router = createTestRouter(RegisterForm);

describe(RegisterForm, () => {
  test("render the form", () => {
    const { getByTestId } = renderComponent(router);
    expect(getByTestId("registerForm")).toBeInTheDocument();
  });
});
