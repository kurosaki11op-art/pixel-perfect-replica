import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym analytics administration preview for Ladies & Kids.",
      },
      { property: "og:title", content: "Analytics | Believer Gym" },
      { property: "og:description", content: "Believer Gym analytics administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Analytics" />,
});
