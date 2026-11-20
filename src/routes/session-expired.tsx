import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/gym/auth-pages";
export const Route = createFileRoute("/session-expired")({
  head: () => ({
    meta: [
      { title: "Session Expired | Believer Gym" },
      { name: "description", content: "Believer Gym Session Expired frontend preview." },
      { property: "og:title", content: "Session Expired | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage kind="expired" />,
});
