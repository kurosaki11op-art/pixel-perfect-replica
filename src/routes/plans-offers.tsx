import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/gym/page-shell";
export const Route = createFileRoute("/plans-offers")({
  head: () => ({
    meta: [
      { title: "Plans & Offers | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym plans & offers administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Plans & Offers | Believer Gym" },
      {
        property: "og:description",
        content: "Believer Gym plans & offers administration preview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PageShell title="Plans & Offers" />,
});
