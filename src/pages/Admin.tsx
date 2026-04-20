import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Submission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
};

const API = "/api/admin.php";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  // login form state
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // submissions list
  const [submissions, setSubmissions] = useState<Submission[]>([]);

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

  // load submissions whenever logged in
  useEffect(() => {
    if (!username) return;
    fetch(`${API}?action=list`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setSubmissions(d.submissions);
      });
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
    setSubmissions([]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    const res = await fetch(`${API}?action=delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setSubmissions((s) => s.filter((x) => x.id !== id));
    } else {
      alert(data.error || "Could not delete");
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
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-2xl font-bold">Contact Submissions</h2>
          <span className="text-muted-foreground text-sm">
            {submissions.length} {submissions.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No submissions yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
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
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
