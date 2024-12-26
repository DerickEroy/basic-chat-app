import { describe, test, expect } from "vitest";
import { createTestRouter, renderComponent } from "../utils";
import LoginForm from "../../components/loginForm";

const router = createTestRouter(LoginForm);

describe(LoginForm, () => {
  test("render the form", () => {
    const render = renderComponent(router);
    expect(render.getByTestId("form")).toBeInTheDocument();
  });
});
