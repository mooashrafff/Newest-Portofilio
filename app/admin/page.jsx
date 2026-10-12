"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Trash2, 
  Pencil,
  Plus, 
  ExternalLink, 
  MessageSquare, 
  Briefcase, 
  Lock, 
  LogOut,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  X,
  Check
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // New project state
  const [newProject, setNewProject] = useState({
    title: "",
    tagline: "",
    category: "web",
    metric: "",
    description: "",
    link: "",
    preview_url: "",
    tech: "",
  });

  // Edit modal state
  const [editingProject, setEditingProject] = useState(null);

  // 1. Data Fetcher (Declared before useEffect to prevent hoisting errors)
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: projData } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });
    if (projData) setProjects(projData);

    const { data: msgData } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (msgData) setMessages(msgData);

    setLoading(false);
  }, []);

  // 2. Session verification on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("admin_session");
      if (session === "true") {
        setIsAuthenticated(true);
        fetchData();
      }
    }
  }, [fetchData]);

  // 3. Authentication Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSCODE;

    if (emailInput.trim() === envEmail && passcodeInput.trim() === envPass) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_session", "true");
      }
      setLoginError("");
      fetchData();
    } else {
      setLoginError("Invalid admin credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_session");
    }
  };

  // 4. Project Operations
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.link) return;

    const techArray = newProject.tech
      ? newProject.tech.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const { error } = await supabase.from("projects").insert([
      {
        title: newProject.title,
        tagline: newProject.tagline,
        category: newProject.category,
        metric: newProject.metric,
        description: newProject.description,
        link: newProject.link,
        preview_url: newProject.preview_url || newProject.link,
        tech: techArray,
      },
    ]);

    if (!error) {
      setNewProject({
        title: "",
        tagline: "",
        category: "web",
        metric: "",
        description: "",
        link: "",
        preview_url: "",
        tech: "",
      });
      fetchData();
    } else {
      alert("Error adding project: " + error.message);
    }
  };

  const openEditModal = (project) => {
    setEditingProject({
      ...project,
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech || "",
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const techArray = editingProject.tech
      ? editingProject.tech.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const { error } = await supabase
      .from("projects")
      .update({
        title: editingProject.title,
        tagline: editingProject.tagline,
        category: editingProject.category,
        metric: editingProject.metric,
        description: editingProject.description,
        link: editingProject.link,
        preview_url: editingProject.preview_url || editingProject.link,
        tech: techArray,
      })
      .eq("id", editingProject.id);

    if (!error) {
      setEditingProject(null);
      fetchData();
    } else {
      alert("Error updating project: " + error.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchData();
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Delete this message record?")) return;
    await supabase.from("messages").delete().eq("id", id);
    fetchData();
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-6 text-slate-100 font-sans">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 rounded-2xl bg-[#0c101c] border border-white/10 shadow-2xl space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono">Ashraf Studio Admin</h1>
          </div>
          <p className="text-xs text-slate-400">Restricted control panel. Enter authorized credentials.</p>

          {loginError && (
            <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-cyan-400"
              placeholder="mohamedashrafalsawyy@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Passcode</label>
            <input
              type="password"
              required
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-cyan-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-400/20"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Ashraf Studio Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active Session: {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"
                : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
              activeTab === "messages"
                ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20"
                : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Messages ({messages.length})</span>
          </button>
        </div>

        {/* TAB 1: Projects Management */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            {/* Create Project Form */}
            <form
              onSubmit={handleAddProject}
              className="p-6 rounded-2xl bg-[#0c101c] border border-white/10 space-y-4"
            >
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add New Project
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Project Title (e.g. Block Events)"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tagline"
                  value={newProject.tagline}
                  onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-[#0c101c] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none text-slate-200"
                >
                  <option value="web">Web Application</option>
                  <option value="shopify">Shopify Store</option>
                  <option value="data">Data / AI</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Badge Metric (e.g. Custom Liquid UX)"
                  value={newProject.metric}
                  onChange={(e) => setNewProject({ ...newProject, metric: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="url"
                  required
                  placeholder="Live URL (https://...)"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated, e.g. React, Shopify)"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <textarea
                placeholder="Brief project description..."
                rows={2}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wide"
              >
                Publish Project to Supabase
              </button>
            </form>

            {/* Existing Projects Table with Edit & Delete */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c101c]">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Metric</th>
                    <th className="p-4">URL</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 font-bold text-white">{p.title}</td>
                      <td className="p-4 uppercase text-slate-400 font-mono text-[11px]">{p.category}</td>
                      <td className="p-4 text-cyan-300">{p.metric}</td>
                      <td className="p-4">
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                          <span className="truncate max-w-[200px]">{p.link}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                            title="Edit Project"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Messages Management */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-xs rounded-2xl border border-white/10 bg-[#0c101c]">
                No client inquiries recorded yet.
              </div>
            ) : (
              messages.map((m) => {
                const cleanPhone = m.phone ? m.phone.replace(/[^0-9]/g, "") : "";
                const waUrl = cleanPhone 
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${m.name}, thank you for reaching out via my portfolio!`)}`
                  : null;

                return (
                  <div
                    key={m.id}
                    className="p-6 rounded-2xl bg-[#0c101c] border border-white/10 hover:border-cyan-500/30 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{m.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" /> {m.email}
                          </span>
                          {m.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" /> {m.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(m.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${m.email}?subject=Inquiry Response - Mohamed Ashraf`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-xs font-mono font-semibold"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply Email</span>
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                      {m.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl p-6 md:p-8 rounded-2xl bg-[#0c101c] border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-cyan-400" /> Edit: {editingProject.title}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProject.tagline || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0c101c] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none text-slate-200"
                  >
                    <option value="web">Web Application</option>
                    <option value="shopify">Shopify Store</option>
                    <option value="data">Data / AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Metric Badge</label>
                  <input
                    type="text"
                    value={editingProject.metric || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, metric: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Live URL (Project Link)</label>
                  <input
                    type="url"
                    required
                    value={editingProject.link}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Preview URL (for screenshot)</label>
                  <input
                    type="url"
                    value={editingProject.preview_url || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, preview_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={editingProject.tech}
                  onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value })}
                  placeholder="React, Next.js, Supabase"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}