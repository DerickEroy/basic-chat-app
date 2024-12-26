import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";

export function createTestRouter(component: () => JSX.Element) {
  const rootRoute = createRootRoute({ component: Outlet });

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory(),
  });

  return router;
}

export function renderComponent(router: ReturnType<typeof createTestRouter>) {
  return render(<RouterProvider router={router} />);
}
