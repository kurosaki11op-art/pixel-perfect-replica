import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym members administration preview for Ladies & Kids.",
      },
      { property: "og:title", content: "Members | Believer Gym" },
      { property: "og:description", content: "Believer Gym members administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Members" />,
});
