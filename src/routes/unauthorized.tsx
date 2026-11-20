import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/gym/auth-pages";
export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Unauthorized | Believer Gym" },
      { name: "description", content: "Believer Gym Unauthorized frontend preview." },
      { property: "og:title", content: "Unauthorized | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage kind="unauthorized" />,
});
