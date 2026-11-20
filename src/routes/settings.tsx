import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/gym/settings-page";
export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym settings administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Settings | Believer Gym" },
      { property: "og:description", content: "Believer Gym settings administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <SettingsPage />,
});
