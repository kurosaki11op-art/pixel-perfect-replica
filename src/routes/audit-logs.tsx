import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/gym/module-page";
export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym audit logs administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Audit Logs | Believer Gym" },
      { property: "og:description", content: "Believer Gym audit logs administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ModulePage module="audit" />,
});
