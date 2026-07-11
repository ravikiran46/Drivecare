import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import DataProvider from "@/components/Context/DataContext";
// import useAuth from "@/components/Context/useAuth";
import appCss from "../index.css?url";
import AuthProvider from "@/components/Context/Authenticationcontext";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Drive Care — Doorstep Car Wash & Service" },
      {
        name: "description",
        content:
          "Doorstep car wash, detailing and service with live tracking and full insurance.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex items-center justify-center h-screen">
      <h1>404 - Page not found</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex items-center justify-center h-screen">
      <h1>Error: {error.message}</h1>
    </div>
  ),
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <Outlet />
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
