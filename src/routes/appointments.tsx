import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym appointments administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Appointments | Believer Gym" },
      { property: "og:description", content: "Believer Gym appointments administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Appointments" />,
});
