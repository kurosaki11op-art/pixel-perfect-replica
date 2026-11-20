import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym expenses administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Expenses | Believer Gym" },
      { property: "og:description", content: "Believer Gym expenses administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="expenses" />,
});
