import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/gym/dashboard";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Believer Gym · Unisex Gym" },
      {
        name: "description",
        content:
          "Believer Gym administration dashboard with demonstration membership, revenue, attendance, and renewal insights.",
      },
      { property: "og:title", content: "Dashboard | Believer Gym · Unisex Gym" },
      {
        property: "og:description",
        content:
          "Memberships, revenue, attendance, and renewals in the Believer Gym admin workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
