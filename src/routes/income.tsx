import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/income")({
  head: () => ({
    meta: [
      { title: "Income | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym income administration preview for Ladies & Kids.",
      },
      { property: "og:title", content: "Income | Believer Gym" },
      { property: "og:description", content: "Believer Gym income administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Income" />,
});
