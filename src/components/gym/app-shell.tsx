import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Dumbbell,
  Menu,
  Search,
  ShieldCheck,
  CalendarDays,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { navigation } from "@/lib/gym-navigation";
import { notifications } from "@/lib/gym-data";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = navigation.find((item) => item.to === pathname)?.label ?? "Dashboard";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(new Date()),
    );
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setSearch("");
  }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);
  const matches = navigation.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );
  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  }
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`app-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        aria-label="Main navigation"
      >
        <Link to="/" className="brand">
          <div className="brand-mark">
            <Dumbbell size={24} strokeWidth={2.5} />
          </div>
          <div className="brand-copy">
            <div className="brand-name">BELIEVER GYM</div>
            <div className="brand-subtitle">UNISEX GYM</div>
          </div>
        </Link>
        <nav className="sidebar-nav">
          {!collapsed && <div className="sidebar-label">WORKSPACE</div>}
          {navigation.map((item, index) => (
            <div key={item.to}>
              {(index === 9 || index === 12) && (
                <>
                  <div className="sidebar-divider" />
                  {!collapsed && (
                    <div className="sidebar-label">{index === 9 ? "MANAGEMENT" : "SYSTEM"}</div>
                  )}
                </>
              )}
              <Link
                to={item.to}
                className={`nav-link ${pathname === item.to ? "active" : ""}`}
                aria-current={pathname === item.to ? "page" : undefined}
                title={item.label}
              >
                <item.icon />
                <span className="nav-text">{item.label}</span>
                {item.label === "Dashboard" && !collapsed && <span className="nav-count">01</span>}
              </Link>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="member-avatar tint">
            <ShieldCheck size={17} />
          </div>
          {!collapsed && (
            <div className="sidebar-bottom-copy">
              <div className="text-[11px] font-medium">Admin workspace</div>
              <div className="mt-1 text-[9px] text-subtle">Believer Gym · Demo preview</div>
            </div>
          )}
        </div>
      </aside>
      <div className={`app-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        <header className="topbar">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle navigation"
            className="h-7 w-7 text-muted-foreground"
          >
            <span className="hidden md:block">
              {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
            </span>
            <Menu className="md:hidden" size={17} />
          </Button>
          <span className="topbar-page text-[13px] font-semibold">{current}</span>
          <div className="global-search">
            <Search size={14} className="absolute left-3 top-2.5 text-subtle" />
            <Input
              aria-label="Global search"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearch("");
              }}
            />
            {search && (
              <div className="search-results">
                {matches.length ? (
                  matches.map((item) => (
                    <Link key={item.to} to={item.to}>
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <p className="p-3 text-xs text-muted-foreground">No matching sections</p>
                )}
              </div>
            )}
          </div>
          <span className="header-date flex items-center gap-2 text-[10px] text-muted-foreground">
            <CalendarDays size={13} />
            {date}
          </span>
          <span className="hidden h-6 border-l border-border sm:block" />
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-muted-foreground"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => setNoticeOpen(true)}
          >
            <Bell size={17} />
            {unread && (
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto gap-9 p-0 hover:bg-transparent"
                aria-label="Admin profile"
              >
                <div className="flex items-center gap-9">
                  <div className="member-avatar tint">A</div>
                  <div className="profile-copy text-left">
                    <div className="text-[11px] font-semibold">Admin</div>
                    <div className="mt-1 text-[9px] text-subtle">Administrator</div>
                  </div>
                </div>
                <ChevronDown size={13} className="profile-chevron text-subtle" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Admin workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
                <UserRound />
                My profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] font-normal text-subtle">
                Demonstration account
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
      <Dialog open={noticeOpen} onOpenChange={setNoticeOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Demonstration notifications · 20 Nov 2026</DialogDescription>
          {notifications.map((item) => (
            <div key={item.title} className="notification-item">
              <strong className="font-medium">{item.title}</strong>
              <p>
                {item.detail} · {item.time}
              </p>
            </div>
          ))}
          <Button variant="outline" disabled={!unread} onClick={() => setUnread(false)}>
            {unread ? "Mark all as read" : "All caught up"}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Admin profile</DialogTitle>
          <DialogDescription>Demonstration account</DialogDescription>
          <div className="flex items-center gap-4 py-4">
            <div className="member-avatar tint">A</div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="mt-1 text-xs text-muted-foreground">Administrator · Believer Gym</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setProfileOpen(false)}>
            <X />
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
