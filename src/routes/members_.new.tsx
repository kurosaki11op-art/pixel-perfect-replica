import { createFileRoute } from "@tanstack/react-router";
import { MemberFormPage } from "@/components/gym/member-pages";
export const Route = createFileRoute("/members_/new")({
  head: () => ({
    meta: [
      { title: "Register Member | Believer Gym" },
      { name: "description", content: "Believer Gym Register Member frontend preview." },
      { property: "og:title", content: "Register Member | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MemberFormPage />,
});
