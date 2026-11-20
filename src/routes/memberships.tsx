import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/memberships")({
  head: () => ({
    meta: [
      { title: "Memberships | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym memberships administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Memberships | Believer Gym" },
      { property: "og:description", content: "Believer Gym memberships administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="memberships" />,
});
