import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/automation-center")({
  head: () => ({
    meta: [
      { title: "Automation Center | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym automation center administration preview for Ladies & Kids.",
      },
      { property: "og:title", content: "Automation Center | Believer Gym" },
      {
        property: "og:description",
        content: "Believer Gym automation center administration preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Automation Center" />,
});
