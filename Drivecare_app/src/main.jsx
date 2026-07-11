import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient, // <-- this is what RootComponent receives
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Toaster position="top-right" /> */}
    <RouterProvider router={router} />
  </StrictMode>,
);
