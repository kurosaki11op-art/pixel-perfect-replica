import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/gym/auth-pages";
export const Route = createFileRoute("/account-disabled")({
  head: () => ({
    meta: [
      { title: "Account Disabled | Believer Gym" },
      { name: "description", content: "Believer Gym Account Disabled frontend preview." },
      { property: "og:title", content: "Account Disabled | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage kind="disabled" />,
});
