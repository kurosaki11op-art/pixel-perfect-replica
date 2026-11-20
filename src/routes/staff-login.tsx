import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/gym/auth-pages";
export const Route = createFileRoute("/staff-login")({
  head: () => ({
    meta: [
      { title: "Staff Login | Believer Gym" },
      { name: "description", content: "Believer Gym Staff Login frontend preview." },
      { property: "og:title", content: "Staff Login | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage kind="staff" />,
});
