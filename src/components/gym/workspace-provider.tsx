import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { DemoSession, Member, Role } from "@/lib/gym/domain";
import { api, authAdapter } from "@/lib/gym/api";
import { normalizeError } from "@/lib/gym/validation";
export type WorkspaceContextValue = {
  session: DemoSession | null;
  loading: boolean;
  error: string | null;
  members: Member[];
  enterPreview: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  previewMember: (member: Member) => Promise<void>;
  reload: () => Promise<void>;
};
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  async function reload() {
    setLoading(true);
    setError(null);
    try {
      setMembers(await api.listMembers());
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let alive = true;
    Promise.all([authAdapter.restore(), api.listMembers()])
      .then(([s, m]) => {
        if (alive) {
          setSession(s);
          setMembers(m);
        }
      })
      .catch((e) => {
        if (alive) setError(normalizeError(e).message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  async function enterPreview(role: Role) {
    setSession(await authAdapter.enterPreview(role));
  }
  async function logout() {
    await authAdapter.signOut();
    setSession(null);
    setMembers(await api.listMembers());
  }
  async function previewMember(member: Member) {
    const result = await api.previewMember(member);
    setMembers((current) =>
      current.some((m) => m.id === member.id)
        ? current.map((m) => (m.id === member.id ? result.data : m))
        : [result.data, ...current],
    );
  }
  return (
    <WorkspaceContext.Provider
      value={{ session, members, loading, error, enterPreview, logout, previewMember, reload }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace provider is required");
  return value;
}
