import { createFileRoute } from "@tanstack/react-router";
import { IncomePage } from "@/components/gym/insights-pages";
export const Route = createFileRoute("/income")({
  head: () => ({
    meta: [
      { title: "Income | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym income administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Income | Believer Gym" },
      { property: "og:description", content: "Believer Gym income administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <IncomePage />,
});
