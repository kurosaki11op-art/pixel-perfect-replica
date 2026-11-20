import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym attendance administration preview for Ladies & Kids.",
      },
      { property: "og:title", content: "Attendance | Believer Gym" },
      { property: "og:description", content: "Believer Gym attendance administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Attendance" />,
});
