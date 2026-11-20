import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/gym/insights-pages";
export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym reports administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Reports | Believer Gym" },
      { property: "og:description", content: "Believer Gym reports administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <InsightsPage reports />,
});
