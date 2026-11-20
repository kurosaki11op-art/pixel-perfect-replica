import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/gym/auth-pages";
export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password | Believer Gym" },
      { name: "description", content: "Believer Gym Reset Password frontend preview." },
      { property: "og:title", content: "Reset Password | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AuthPage kind="reset" />,
});
