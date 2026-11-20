import { createFileRoute } from "@tanstack/react-router";
import { MemberProfilePage } from "@/components/gym/member-pages";
export const Route = createFileRoute("/members_/$memberId")({
  head: () => ({
    meta: [
      { title: "Member Profile | Believer Gym" },
      { name: "description", content: "Believer Gym Member Profile frontend preview." },
      { property: "og:title", content: "Member Profile | Believer Gym" },
      { property: "og:description", content: "Believer Gym unisex frontend development preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MemberProfilePage memberId={Route.useParams().memberId} />,
});
