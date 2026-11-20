import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/gym/insights-pages";
export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym analytics administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Analytics | Believer Gym" },
      { property: "og:description", content: "Believer Gym analytics administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <InsightsPage />,
});
