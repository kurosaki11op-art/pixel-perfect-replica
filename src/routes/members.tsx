import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "@/components/gym/member-pages";
export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members | Believer Gym" },
      {
        name: "description",
        content: "Believer Gym members administration preview for a unisex gym.",
      },
      { property: "og:title", content: "Members | Believer Gym" },
      { property: "og:description", content: "Believer Gym members administration preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MembersPage />,
});
