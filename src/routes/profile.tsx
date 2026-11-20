import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/gym/settings-page";
export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile | Believer Gym" },
      { name: "description", content: "Believer Gym Profile frontend preview." },
      { property: "og:title", content: "Profile | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SettingsPage profile />,
});
