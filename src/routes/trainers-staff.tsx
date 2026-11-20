import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/trainers-staff")({
  head: () => ({
    meta: [
      { title: "Trainers & Staff | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym trainers & staff administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Trainers & Staff | Believer Gym" },
      {
        property: "og:description",
        content: "Believer Gym trainers & staff administration preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="staff" />,
});
