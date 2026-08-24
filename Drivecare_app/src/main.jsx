import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <RouterProvider router={router} />
  </StrictMode>,
);
