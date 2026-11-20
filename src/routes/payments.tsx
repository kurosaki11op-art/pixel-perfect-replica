import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments | Believer Gym" },
      { name: "description", content: "Believer Gym Payments frontend preview." },
      { property: "og:title", content: "Payments | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="payments" />,
});
