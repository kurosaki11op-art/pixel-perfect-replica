import type {
  AuthenticationProvider,
  GymApiClient,
  Role,
  EntityRecord,
  EntityKind,
  Member,
  DemoSession,
} from "./domain";
import { demoMembers, demoEntities } from "./demo-data";
import { memberSchema } from "./validation";
// These are integration slots, not verified existing API URLs.
export const endpointConfiguration = {
  members: null,
  memberships: null,
  plans: null,
  payments: null,
  attendance: null,
  appointments: null,
  staff: null,
} as const;
export class DevelopmentApiAdapter implements GymApiClient {
  async listMembers() {
    return structuredClone(demoMembers);
  }
  async list(kind: EntityKind) {
    return structuredClone(demoEntities[kind]);
  }
  async previewMember(input: Member) {
    return {
      mode: "preview" as const,
      data: memberSchema.parse(input),
      message: "Member preview ready. No record was saved.",
    };
  }
  async preview(_kind: EntityKind, input: EntityRecord) {
    return {
      mode: "preview" as const,
      data: structuredClone(input),
      message: "Preview ready. No record was saved or transaction processed.",
    };
  }
}
export class DevelopmentAuthAdapter implements AuthenticationProvider {
  async restore(): Promise<DemoSession | null> {
    return { role: "admin", name: "Demo Admin", mode: "development" };
  }
  async enterPreview(role: Role): Promise<DemoSession> {
    return { role, name: role === "admin" ? "Demo Admin" : "Demo Trainer", mode: "development" };
  }
  async signOut() {}
}
export const api: GymApiClient = new DevelopmentApiAdapter();
export const authAdapter: AuthenticationProvider = new DevelopmentAuthAdapter();
