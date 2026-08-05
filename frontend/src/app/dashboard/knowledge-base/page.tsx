"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Folder,
  Eye,
  ThumbsUp,
  Edit2,
  Trash2,
  FileText,
  Globe,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState([
    { id: "cat1", name: "Getting Started", count: 4, icon: "rocket" },
    { id: "cat2", name: "API & Integrations", count: 6, icon: "code" },
    { id: "cat3", name: "Billing & Subscriptions", count: 3, icon: "credit-card" }
  ]);

  const [articles, setArticles] = useState([
    {
      id: "a1",
      title: "How to configure webhooks for automated ticket routing",
      category: "API & Integrations",
      is_published: true,
      views_count: 342,
      helpful_count: 89,
      updated_at: "2026-08-01",
      content: "# Webhook Integration Guide\n\nSupportFlow webhooks allow your engineering systems to receive real-time HTTP POST notifications whenever support events occur."
    },
    {
      id: "a2",
      title: "Managing Team Roles and Fine-Grained Permissions (RBAC)",
      category: "Getting Started",
      is_published: true,
      views_count: 520,
      helpful_count: 145,
      updated_at: "2026-07-28",
      content: "# Team Roles & Permissions\n\nSupportFlow features built-in Role-Based Access Control (RBAC) to ensure security across your business."
    },
    {
      id: "a3",
      title: "Draft: Setting up SAML Single Sign-On (SSO) with Okta",
      category: "Getting Started",
      is_published: false,
      views_count: 12,
      helpful_count: 2,
      updated_at: "2026-08-04",
      content: "# SAML SSO Setup Draft\n\nSteps for configuring identity provider integration."
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "ALL" || a.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle.id) {
      setArticles(articles.map(a => a.id === editingArticle.id ? editingArticle : a));
    } else {
      const created = {
        id: `a_${Date.now()}`,
        ...editingArticle,
        views_count: 0,
        helpful_count: 0,
        updated_at: new Date().toISOString().split("T")[0]
      };
      setArticles([created, ...articles]);
    }
    setEditorModalOpen(false);
  };

  const togglePublish = (articleId: string) => {
    setArticles(articles.map(a => a.id === articleId ? { ...a, is_published: !a.is_published } : a));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-blue-600" /> Knowledge Base Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish self-serve help articles, manage documentation categories, and track helpfulness feedback.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingArticle({ title: "", category: "Getting Started", is_published: true, content: "" });
            setEditorModalOpen(true);
          }}
          className="gap-2 text-xs font-bold shadow-md shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" /> Create Article
        </Button>
      </div>

      {/* Categories Toolbar & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            onClick={() => setSelectedCat(selectedCat === cat.name ? "ALL" : cat.name)}
            className={`cursor-pointer transition-all ${
              selectedCat === cat.name ? "border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/40" : "hover:border-slate-300"
            }`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{cat.name}</div>
                  <div className="text-[10px] text-slate-400">{cat.count} published articles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search knowledge base articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Article Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Telemetry Views</th>
                <th className="p-3.5">Helpful Votes</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>{art.title}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">{art.category}</td>
                  <td className="p-3.5">
                    {art.is_published ? (
                      <Badge variant="success" className="gap-1">
                        <Globe className="h-3 w-3" /> Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-slate-400" /> {art.views_count} views</span>
                  </td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {art.helpful_count} votes</span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(art.id)}
                      className="h-7 text-[11px]"
                    >
                      {art.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingArticle(art);
                        setEditorModalOpen(true);
                      }}
                      className="h-7 p-1 text-slate-500"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Article Modal */}
      <Modal isOpen={editorModalOpen} onClose={() => setEditorModalOpen(false)} title="Rich Article Editor" maxWidth="2xl">
        {editingArticle && (
          <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Title</label>
              <Input
                required
                placeholder="e.g. How to configure single sign-on"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                >
                  <option value="Getting Started">Getting Started</option>
                  <option value="API & Integrations">API & Integrations</option>
                  <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Publish State</label>
                <select
                  value={editingArticle.is_published ? "true" : "false"}
                  onChange={(e) => setEditingArticle({ ...editingArticle, is_published: e.target.value === "true" })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                >
                  <option value="true">Published (Public)</option>
                  <option value="false">Draft (Internal Only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Markdown Body</label>
              <textarea
                required
                rows={8}
                placeholder="# Article Heading&#10;&#10;Write markdown documentation here..."
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setEditorModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Article
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
