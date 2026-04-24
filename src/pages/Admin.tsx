import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, LogOut, Calendar, Clock, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SERVICES } from "@/lib/constants";

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

type ConsultationStatus = "pending" | "confirmed" | "completed" | "cancelled";

type ConsultationRequest = {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string; // 'morning' | 'afternoon' | 'evening'
  service: string | null;
  message: string | null;
  status: ConsultationStatus;
  created_at: string;
};

const API = "/api/admin.php";

const TIME_SLOT_LABEL: Record<string, string> = {
  morning: "Morning (9AM – 12PM)",
  afternoon: "Afternoon (12PM – 4PM)",
  evening: "Evening (4PM – 6PM)",
};

const serviceLabel = (id: string | null) =>
  id ? (SERVICES.find((s) => s.id === id)?.shortTitle ?? id) : null;

const STATUS_STYLES: Record<ConsultationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  // login form state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // data
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  // check if already logged in on mount
  useEffect(() => {
    fetch(`${API}?action=me`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setUsername(d.username);
      })
      .catch(() => { /* not logged in */ })
      .finally(() => setLoading(false));
  }, []);

  // load both lists once logged in
  useEffect(() => {
    if (!username) return;

    fetch(`${API}?action=list_contacts`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setContacts(d.submissions); });

    fetch(`${API}?action=list_consultations`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => { if (d.ok) setConsultations(d.consultations); });
  }, [username]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setUsername(data.username);
        setLoginForm({ username: "", password: "" });
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Unable to reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API}?action=logout`, { method: "POST", credentials: "same-origin" });
    setUsername(null);
    setContacts([]);
    setConsultations([]);
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`${API}?action=delete_contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setContacts((s) => s.filter((x) => x.id !== id));
    } else {
      alert(data.error || "Could not delete");
    }
  };

  const deleteConsultation = async (id: number) => {
    if (!confirm("Delete this consultation request?")) return;
    const res = await fetch(`${API}?action=delete_consultation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setConsultations((s) => s.filter((x) => x.id !== id));
    } else {
      alert(data.error || "Could not delete");
    }
  };

  const updateStatus = async (id: number, status: ConsultationStatus) => {
    const res = await fetch(`${API}?action=update_consultation_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setConsultations((s) => s.map((x) => (x.id === id ? { ...x, status } : x)));
    } else {
      alert(data.error || "Could not update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  // --- Login screen ---
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-4 py-2">
                  {loginError}
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Username</label>
                <Input
                  required
                  autoFocus
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <Input
                  required
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {username}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="contacts">
              Contact Messages
              <span className="ml-2 text-xs bg-muted-foreground/20 rounded-full px-2 py-0.5">
                {contacts.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="consultations">
              Book a Visit Requests
              <span className="ml-2 text-xs bg-muted-foreground/20 rounded-full px-2 py-0.5">
                {consultations.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* ---------- Contact messages ---------- */}
          <TabsContent value="contacts" className="space-y-4">
            {contacts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No contact messages yet.
                </CardContent>
              </Card>
            ) : (
              contacts.map((s) => (
                <Card key={s.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold">{s.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <a href={`mailto:${s.email}`} className="flex items-center gap-1 hover:text-accent">
                            <Mail size={12} /> {s.email}
                          </a>
                          {s.phone && (
                            <a href={`tel:${s.phone}`} className="flex items-center gap-1 hover:text-accent">
                              <Phone size={12} /> {s.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(s.created_at).toLocaleString()}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => deleteContact(s.id)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {s.subject && (
                      <p className="text-sm">
                        <span className="font-medium">Subject:</span>{" "}
                        <span className="text-muted-foreground">{s.subject}</span>
                      </p>
                    )}

                    <p className="text-sm mt-2 whitespace-pre-wrap">{s.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ---------- Consultation (Book a Visit) requests ---------- */}
          <TabsContent value="consultations" className="space-y-4">
            {consultations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No consultation requests yet.
                </CardContent>
              </Card>
            ) : (
              consultations.map((c) => (
                <Card key={c.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{c.name}</h3>
                          <span className={`text-xs border rounded-full px-2 py-0.5 capitalize ${STATUS_STYLES[c.status]}`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-accent">
                            <Mail size={12} /> {c.email}
                          </a>
                          <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-accent">
                            <Phone size={12} /> {c.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => deleteConsultation(c.id)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-sm mt-3 p-3 bg-secondary/60 rounded-md">
                      <div className="flex items-start gap-2">
                        <Calendar size={14} className="text-accent mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Preferred date</div>
                          <div className="font-medium">{c.preferred_date}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock size={14} className="text-accent mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">Preferred time</div>
                          <div className="font-medium">
                            {TIME_SLOT_LABEL[c.preferred_time] ?? c.preferred_time}
                          </div>
                        </div>
                      </div>
                      {c.service && (
                        <div className="flex items-start gap-2">
                          <Briefcase size={14} className="text-accent mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs text-muted-foreground">Service</div>
                            <div className="font-medium">{serviceLabel(c.service)}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {c.message && (
                      <p className="text-sm mt-3 whitespace-pre-wrap">{c.message}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t">
                      <span className="text-xs text-muted-foreground mr-1">Update status:</span>
                      {(["pending", "confirmed", "completed", "cancelled"] as ConsultationStatus[]).map((st) => (
                        <Button
                          key={st}
                          variant={c.status === st ? "default" : "outline"}
                          size="sm"
                          className="capitalize h-7 text-xs"
                          disabled={c.status === st}
                          onClick={() => updateStatus(c.id, st)}
                        >
                          {st}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
