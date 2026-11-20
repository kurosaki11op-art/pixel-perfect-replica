import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Plans | Believer Gym" },
      { name: "description", content: "Believer Gym Plans frontend preview." },
      { property: "og:title", content: "Plans | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="plans" readOnly />,
});
