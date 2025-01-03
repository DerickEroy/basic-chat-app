import { describe, test, expect } from "vitest";
import { createTestRouter, renderComponent } from "../utils";
import RegisterForm from "../../components/registerForm";

const router = createTestRouter(RegisterForm);

describe(RegisterForm, () => {
  test("render the form", () => {
    const render = renderComponent(router);
    expect(render.getByTestId("form")).toBeInTheDocument();
  });
});
