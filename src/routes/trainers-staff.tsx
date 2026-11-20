import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/trainers-staff")({
  head: () => ({
    meta: [
      { title: "Trainers & Staff | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym trainers & staff administration preview for Ladies & Kids.",
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
  component: () => <PageShell title="Trainers & Staff" />,
});
