import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "h4b_cms_config";
const defaultConfig = { owner: "sivolko", repo: "hugs4bugs", token: "", author: "Shubhendu Shubham" };

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const todayISO = () => {
  const d = new Date();
  return d.toISOString().slice(0, 19).replace("T", " ") + " UTC";
};

const filenameFromTitle = (title, date) => {
  const d = date ? date.slice(0, 10) : new Date().toISOString().slice(0, 10);
  return `${d}-${slugify(title || "untitled")}.md`;
};

const buildFrontmatter = (fields) => {
  const tags = fields.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const tagLines = tags.map((t) => `  - ${t}`).join("\n");
  return `---\nlayout: post\ntitle: "${fields.title}"\ndate: ${fields.date}\ncategory: ${fields.category}\ntags:\n${tagLines}\nsubtitle: "${fields.subtitle}"\ndescription: "${fields.description}"\nimage: ${fields.image}\noptimized_image: ${fields.optimized_image || fields.image}\nauthor: ${fields.author}\n---\n\n${fields.body}`;
};

const GH = (token) => ({
  async req(method, path, body) {
    const r = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 204) return {};
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "GitHub API error");
    return data;
  },
  get(path) { return this.req("GET", path); },
  post(path, body) { return this.req("POST", path, body); },
  put(path, body) { return this.req("PUT", path, body); },
  patch(path, body) { return this.req("PATCH", path, body); },
  delete(path, body) { return this.req("DELETE", path, body); },
});

const VIEWS = { SETUP: "setup", LIST: "list", EDITOR: "editor" };

export default function CMS() {
  const [config, setConfig] = useState(() => {
    try { return { ...defaultConfig, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return defaultConfig; }
  });
  const [view, setView] = useState(config.token ? VIEWS.LIST : VIEWS.SETUP);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeListTab, setActiveListTab] = useState("published");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [deleting, setDeleting] = useState(null);

  const emptyFields = {
    title: "", subtitle: "", date: todayISO(), category: "", tags: "",
    description: "", image: "", optimized_image: "", author: config.author, body: "",
  };
  const [fields, setFields] = useState(emptyFields);

  const saveConfig = (c) => { setConfig(c); localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); };

  const fetchAll = useCallback(async () => {
    if (!config.token) return;
    setLoadingPosts(true);
    try {
      const gh = GH(config.token);
      const [postsData, prsData] = await Promise.all([
        gh.get(`/repos/${config.owner}/${config.repo}/contents/_posts`),
        gh.get(`/repos/${config.owner}/${config.repo}/pulls?state=open&per_page=50`),
      ]);
      setPosts(Array.isArray(postsData) ? postsData.sort((a, b) => b.name.localeCompare(a.name)) : []);
      setDrafts(prsData.filter(pr => pr.title.startsWith("[CMS] Draft:")));
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
    finally { setLoadingPosts(false); }
  }, [config]);

  useEffect(() => { if (view === VIEWS.LIST) fetchAll(); }, [view, fetchAll]);

  const newPost = () => {
    setFields({ ...emptyFields, date: todayISO(), author: config.author });
    setEditPost(null); setPreviewMode(false); setStatus(null);
    setActiveTab("content"); setView(VIEWS.EDITOR);
  };

  const openPost = async (post) => {
    setStatus({ type: "info", msg: "Loading post..." });
    try {
      const gh = GH(config.token);
      const data = await gh.get(`/repos/${config.owner}/${config.repo}/contents/_posts/${post.name}`);
      const content = atob(data.content.replace(/\n/g, ""));
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (fmMatch) {
        const raw = fmMatch[1], body = fmMatch[2].trim();
        const parse = (k) => { const m = raw.match(new RegExp(`^${k}:\\s*(.+)$`, "m")); return m ? m[1].replace(/^["']|["']$/g, "").trim() : ""; };
        const tagsMatch = raw.match(/^tags:\n((?:\s+-\s*.+\n?)*)/m);
        const tags = tagsMatch ? (tagsMatch[1].match(/-\s*(.+)/g)?.map(t => t.replace(/^-\s*/, "").trim()).join(", ") || "") : "";
        setFields({ title: parse("title"), subtitle: parse("subtitle"), date: parse("date"), category: parse("category"), tags, description: parse("description"), image: parse("image"), optimized_image: parse("optimized_image"), author: parse("author"), body });
      }
      setEditPost({ name: post.name, sha: data.sha });
      setStatus(null); setPreviewMode(false); setActiveTab("content"); setView(VIEWS.EDITOR);
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
  };

  const openDraft = async (pr) => {
    setStatus({ type: "info", msg: "Loading draft..." });
    try {
      const gh = GH(config.token);
      const files = await gh.get(`/repos/${config.owner}/${config.repo}/pulls/${pr.number}/files`);
      const postFile = files.find(f => f.filename.startsWith("_posts/"));
      if (!postFile) throw new Error("No post file found in this PR");
      const data = await gh.get(`/repos/${config.owner}/${config.repo}/contents/${postFile.filename}?ref=${pr.head.ref}`);
      const content = atob(data.content.replace(/\n/g, ""));
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (fmMatch) {
        const raw = fmMatch[1], body = fmMatch[2].trim();
        const parse = (k) => { const m = raw.match(new RegExp(`^${k}:\\s*(.+)$`, "m")); return m ? m[1].replace(/^["']|["']$/g, "").trim() : ""; };
        const tagsMatch = raw.match(/^tags:\n((?:\s+-\s*.+\n?)*)/m);
        const tags = tagsMatch ? (tagsMatch[1].match(/-\s*(.+)/g)?.map(t => t.replace(/^-\s*/, "").trim()).join(", ") || "") : "";
        setFields({ title: parse("title"), subtitle: parse("subtitle"), date: parse("date"), category: parse("category"), tags, description: parse("description"), image: parse("image"), optimized_image: parse("optimized_image"), author: parse("author"), body });
      }
      setEditPost({ name: postFile.filename.replace("_posts/", ""), sha: data.sha, prNumber: pr.number, branch: pr.head.ref, isDraft: true });
      setStatus(null); setPreviewMode(false); setActiveTab("content"); setView(VIEWS.EDITOR);
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
  };

  const deletePost = async (post) => {
    if (!window.confirm(`Delete "${post.name}"? This will remove the post from the repo.`)) return;
    setDeleting(post.name);
    const gh = GH(config.token);
    const { owner, repo } = config;
    try {
      const data = await gh.get(`/repos/${owner}/${repo}/contents/_posts/${post.name}`);
      const branch = `cms/delete-${slugify(post.name)}-${Date.now()}`;
      const ref = await gh.get(`/repos/${owner}/${repo}/git/ref/heads/main`);
      await gh.post(`/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: ref.object.sha });
      await gh.delete(`/repos/${owner}/${repo}/contents/_posts/${post.name}`, { message: `[CMS] Delete: ${post.name}`, sha: data.sha, branch });
      const pr = await gh.post(`/repos/${owner}/${repo}/pulls`, { title: `[CMS] Delete: ${post.name}`, body: "Deleted via hugs4bugs CMS.", head: branch, base: "main" });
      await gh.put(`/repos/${owner}/${repo}/pulls/${pr.number}/merge`, { merge_method: "squash", commit_title: `Delete: ${post.name}` });
      setStatus({ type: "success", msg: `"${post.name}" deleted.` });
      fetchAll();
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
    finally { setDeleting(null); }
  };

  const deleteDraft = async (pr) => {
    if (!window.confirm(`Discard draft "${pr.title.replace("[CMS] Draft: ", "")}"?`)) return;
    setDeleting(pr.number);
    const gh = GH(config.token);
    const { owner, repo } = config;
    try {
      await gh.post(`/repos/${owner}/${repo}/issues/${pr.number}/comments`, { body: "Discarded via hugs4bugs CMS." });
      await gh.patch(`/repos/${owner}/${repo}/pulls/${pr.number}`, { state: "closed" });
      await gh.delete(`/repos/${owner}/${repo}/git/refs/heads/${pr.head.ref}`);
      setStatus({ type: "success", msg: "Draft discarded." });
      fetchAll();
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
    finally { setDeleting(null); }
  };

  const publishDraft = async (pr) => {
    const gh = GH(config.token);
    const { owner, repo } = config;
    setPublishing(true);
    try {
      await gh.put(`/repos/${owner}/${repo}/pulls/${pr.number}/merge`, { merge_method: "squash", commit_title: pr.title.replace("[CMS] Draft:", "Publish:") });
      setStatus({ type: "success", msg: "Draft published! Deploying to Firebase...", prUrl: pr.html_url });
      fetchAll();
    } catch (e) { setStatus({ type: "error", msg: e.message }); }
    finally { setPublishing(false); }
  };

  const publish = async (draft = false) => {
    if (!fields.title.trim()) { setStatus({ type: "error", msg: "Title is required." }); return; }
    setPublishing(true);
    setStatus({ type: "info", msg: draft ? "Saving draft..." : "Publishing...", steps: [] });
    const gh = GH(config.token);
    const { owner, repo } = config;
    const filename = filenameFromTitle(fields.title, fields.date);
    const branch = editPost?.branch || `cms/${slugify(fields.title)}-${Date.now()}`;
    const content = btoa(unescape(encodeURIComponent(buildFrontmatter(fields))));
    const step = (msg) => setStatus(s => ({ ...s, steps: [...(s.steps || []), msg] }));
    try {
      let prNumber = editPost?.prNumber;
      if (!editPost?.isDraft) {
        step("Getting main branch ref...");
        const ref = await gh.get(`/repos/${owner}/${repo}/git/ref/heads/main`);
        step("Creating branch...");
        await gh.post(`/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: ref.object.sha });
      }
      step(`Writing _posts/${filename}...`);
      const fileBody = { message: `[CMS] ${draft ? "Draft" : "Publish"}: ${fields.title}`, content, branch };
      if (editPost?.sha) fileBody.sha = editPost.sha;
      await gh.put(`/repos/${owner}/${repo}/contents/_posts/${filename}`, fileBody);
      if (!editPost?.isDraft) {
        step("Creating Pull Request...");
        const pr = await gh.post(`/repos/${owner}/${repo}/pulls`, {
          title: `[CMS] ${draft ? "Draft" : "Post"}: ${fields.title}`,
          body: `Auto-generated by hugs4bugs CMS.\n\n**${draft ? "Draft - review before merging." : "Ready to publish - auto-merging."}**`,
          head: branch, base: "main",
        });
        prNumber = pr.number;
        if (!draft) {
          step("Merging PR -> triggering deploy...");
          await gh.put(`/repos/${owner}/${repo}/pulls/${pr.number}/merge`, { merge_method: "squash", commit_title: `Publish: ${fields.title}` });
        }
        setStatus({ type: "success", msg: draft ? `Draft PR #${prNumber} created!` : "Published! Deploying to Firebase...", prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`, steps: [] });
      } else {
        if (!draft) {
          step("Merging draft PR...");
          await gh.put(`/repos/${owner}/${repo}/pulls/${prNumber}/merge`, { merge_method: "squash", commit_title: `Publish: ${fields.title}` });
        }
        setStatus({ type: "success", msg: draft ? "Draft updated!" : "Draft published! Deploying to Firebase...", steps: [] });
      }
    } catch (e) { setStatus(s => ({ type: "error", msg: e.message, steps: s?.steps || [] })); }
    finally { setPublishing(false); }
  };

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: inherit; }
        .btn-primary { background: #111; color: #fff; } .btn-primary:hover:not(:disabled) { background: #333; }
        .btn-outline { background: #fff; color: #111; border: 1px solid #e2e8f0; } .btn-outline:hover:not(:disabled) { background: #f8f9fa; }
        .btn-green { background: #16a34a; color: #fff; } .btn-green:hover:not(:disabled) { background: #15803d; }
        .btn-red { background: #fff; color: #dc2626; border: 1px solid #fecaca; } .btn-red:hover:not(:disabled) { background: #fef2f2; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .input { width: 100%; padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; background: #fff; color: #111; transition: border 0.15s; }
        .input:focus { border-color: #111; } .input-mono { font-family: 'DM Mono', monospace; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #555; transition: all 0.1s; user-select: none; }
        .sidebar-item:hover { background: #f1f1f1; color: #111; } .sidebar-item.active { background: #111; color: #fff; }
        .post-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 10px; border: 1px solid transparent; background: #fff; transition: all 0.1s; }
        .post-row:hover { border-color: #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .toolbar-tab { padding: 6px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; border: none; background: transparent; font-family: inherit; color: #888; transition: all 0.1s; }
        .toolbar-tab.active { background: #fff; color: #111; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .list-tab { padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; font-family: inherit; transition: all 0.1s; }
        .list-tab.active { background: #111; color: #fff; } .list-tab:not(.active) { background: transparent; color: #888; }
        .field-label { font-size: 11px; font-weight: 600; color: #888; margin-bottom: 5px; letter-spacing: 0.06em; text-transform: uppercase; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 14px; height: 14px; border: 2px solid #e2e8f0; border-top-color: #111; border-radius: 50%; animation: spin 0.6s linear infinite; }
        .md-preview h1 { font-size: 24px; margin: 1.2em 0 0.5em; font-weight: 600; }
        .md-preview h2 { font-size: 20px; margin: 1em 0 0.4em; font-weight: 600; }
        .md-preview h3 { font-size: 17px; margin: 0.8em 0 0.3em; font-weight: 600; }
        .md-preview p { margin: 0.8em 0; line-height: 1.75; }
        .md-preview code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 13px; }
        .md-preview ul, .md-preview ol { padding-left: 1.5em; margin: 0.5em 0; line-height: 1.75; }
        .md-preview a { color: #2563eb; }
        .token.comment,.token.prolog { color: #8b949e !important; }
        .token.keyword { color: #ff7b72 !important; }
        .token.string { color: #a5d6ff !important; }
        .token.function { color: #d2a8ff !important; }
        .token.number { color: #79c0ff !important; }
        .token.operator { color: #ff7b72 !important; }
        .token.class-name { color: #ffa657 !important; }
        .token.attr-name { color: #79c0ff !important; }
        .token.attr-value { color: #a5d6ff !important; }
        .token.boolean { color: #79c0ff !important; }
        .token.builtin { color: #ffa657 !important; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      `}</style>

      {view === VIEWS.SETUP && <SetupScreen config={config} onSave={(c) => { saveConfig(c); setView(VIEWS.LIST); }} />}

      {view !== VIEWS.SETUP && (
        <div style={{ display: "flex", height: "100vh" }}>
          <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", padding: "0 12px 20px" }}>
              hugs4bugs<span style={{ color: "#16a34a" }}>.</span>cms
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 16 }} onClick={newPost}>
              <PlusIcon /> New Post
            </button>
            <div className={`sidebar-item ${view === VIEWS.LIST ? "active" : ""}`} onClick={() => setView(VIEWS.LIST)}>
              <GridIcon /> All Posts
              {drafts.length > 0 && <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", fontWeight: 600 }}>{drafts.length}</span>}
            </div>
            <div className={`sidebar-item ${view === VIEWS.EDITOR ? "active" : ""}`} onClick={() => view !== VIEWS.EDITOR && newPost()}>
              <EditIcon /> Editor
            </div>
            <div style={{ flex: 1 }} />
            <div className="sidebar-item" onClick={() => { saveConfig({ ...config, token: "" }); setView(VIEWS.SETUP); }}>
              <SettingsIcon /> Settings
            </div>
            <div style={{ padding: "8px 12px 0", fontSize: 11, color: "#bbb" }}>{config.owner}/{config.repo}</div>
          </aside>
          <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {view === VIEWS.LIST && (
              <PostsList posts={posts} drafts={drafts} loading={loadingPosts} onOpen={openPost} onOpenDraft={openDraft} onRefresh={fetchAll} onNew={newPost} onDelete={deletePost} onPublishDraft={publishDraft} onDeleteDraft={deleteDraft} deleting={deleting} status={status} activeListTab={activeListTab} setActiveListTab={setActiveListTab} />
            )}
            {view === VIEWS.EDITOR && (
              <EditorView fields={fields} set={set} previewMode={previewMode} setPreviewMode={setPreviewMode} onPublish={publish} publishing={publishing} status={status} setStatus={setStatus} editPost={editPost} onBack={() => setView(VIEWS.LIST)} activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function SetupScreen({ config, onSave }) {
  const [form, setForm] = useState(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const test = async () => {
    setTesting(true); setTestResult(null);
    try {
      const r = await fetch(`https://api.github.com/repos/${form.owner}/${form.repo}`, { headers: { Authorization: `token ${form.token}` } });
      const d = await r.json();
      if (r.ok) setTestResult({ ok: true, msg: `Connected to ${d.full_name}` });
      else setTestResult({ ok: false, msg: d.message });
    } catch (e) { setTestResult({ ok: false, msg: e.message }); }
    setTesting(false);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 40, width: 460, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 6 }}>hugs4bugs<span style={{ color: "#16a34a" }}>.</span>cms</h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>Connect your GitHub repo to start writing.</p>
        {[
          { label: "GitHub Personal Access Token", key: "token", type: "password", placeholder: "ghp_...", hint: "repo + pull_requests scopes" },
          { label: "Repo Owner", key: "owner", placeholder: "sivolko" },
          { label: "Repository", key: "repo", placeholder: "hugs4bugs" },
          { label: "Default Author", key: "author", placeholder: "Shubhendu Shubham" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div className="field-label">{f.label}</div>
            {f.hint && <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{f.hint}</div>}
            <input className="input" type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} />
          </div>
        ))}
        {testResult && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13, background: testResult.ok ? "#f0fdf4" : "#fef2f2", color: testResult.ok ? "#16a34a" : "#dc2626" }}>{testResult.msg}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn btn-outline" onClick={test} disabled={testing || !form.token} style={{ flex: 1 }}>{testing ? "Testing..." : "Test Connection"}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)} disabled={!form.token}>Connect</button>
        </div>
      </div>
    </div>
  );
}

function PostsList({ posts, drafts, loading, onOpen, onOpenDraft, onRefresh, onNew, onDelete, onPublishDraft, onDeleteDraft, deleting, status, activeListTab, setActiveListTab }) {
  const [search, setSearch] = useState("");
  const filtered = posts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredDrafts = drafts.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ height: "100%", overflow: "auto", padding: 32 }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: 12 }}>
          <div style={{ flex: 1 }}><h2 style={{ fontSize: 20, fontWeight: 600, color: "#111" }}>Posts</h2></div>
          <button className="btn btn-outline" onClick={onRefresh}>Refresh</button>
          <button className="btn btn-primary" onClick={onNew}>+ New Post</button>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#f1f1f1", padding: 4, borderRadius: 10, marginBottom: 16, width: "fit-content" }}>
          <button className={`list-tab ${activeListTab === "published" ? "active" : ""}`} onClick={() => setActiveListTab("published")}>Published ({posts.length})</button>
          <button className={`list-tab ${activeListTab === "drafts" ? "active" : ""}`} onClick={() => setActiveListTab("drafts")}>
            Drafts {drafts.length > 0 && <span style={{ background: "#f59e0b", color: "#fff", borderRadius: 8, fontSize: 10, padding: "1px 5px", marginLeft: 4 }}>{drafts.length}</span>}
          </button>
        </div>
        {status && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13, background: status.type === "error" ? "#fef2f2" : status.type === "success" ? "#f0fdf4" : "#eff6ff", color: status.type === "error" ? "#dc2626" : status.type === "success" ? "#16a34a" : "#1d4ed8" }}>{status.msg}</div>}
        <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />
        {loading && <div style={{ textAlign: "center", padding: 64, color: "#aaa" }}><div className="spinner" style={{ margin: "0 auto 12px" }} />Fetching from GitHub...</div>}
        {activeListTab === "published" && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filtered.length === 0 && <EmptyState text={search ? "No posts match." : "No published posts yet."} />}
            {filtered.map(post => {
              const parts = post.name.replace(".md", "").split("-");
              const date = parts.slice(0, 3).join("-");
              const title = parts.slice(3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              return (
                <div key={post.name} className="post-row">
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onOpen(post)}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{date}</div>
                  </div>
                  <button className="btn btn-red" style={{ padding: "5px 10px", fontSize: 12, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); onDelete(post); }} disabled={deleting === post.name}>
                    {deleting === post.name ? "..." : <TrashIcon />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {activeListTab === "drafts" && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredDrafts.length === 0 && <EmptyState text={search ? "No drafts match." : "No drafts yet. Use 'Save Draft' in the editor."} />}
            {filteredDrafts.map(pr => {
              const title = pr.title.replace("[CMS] Draft: ", "");
              const date = new Date(pr.created_at).toISOString().slice(0, 10);
              return (
                <div key={pr.number} className="post-row">
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onOpenDraft(pr)}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>PR #{pr.number} - {date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-green" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onPublishDraft(pr)}>Publish</button>
                    <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: "5px 10px", fontSize: 12 }}>PR</a>
                    <button className="btn btn-red" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onDeleteDraft(pr)} disabled={deleting === pr.number}>
                      {deleting === pr.number ? "..." : <TrashIcon />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div style={{ textAlign: "center", padding: 48, color: "#ccc", background: "#fff", borderRadius: 12, border: "1px dashed #e2e8f0" }}>{text}</div>;
}

const LANGUAGES = ["bash","c","cpp","css","diff","docker","go","graphql","html","java","javascript","json","kotlin","kql","markdown","python","ruby","rust","shell","sql","swift","typescript","yaml"];

function EditorView({ fields, set, previewMode, setPreviewMode, onPublish, publishing, status, editPost, onBack, activeTab, setActiveTab }) {
  const textareaRef = useRef(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const insertAt = (before, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = fields.body.slice(start, end);
    const newVal = fields.body.slice(0, start) + before + selected + after + fields.body.slice(end);
    set("body")({ target: { value: newVal } });
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + selected.length); }, 0);
  };

  const insertCodeBlock = (lang) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = fields.body.slice(start, end);
    const block = "```" + lang + "\n" + (selected || "// your code here") + "\n```";
    const newVal = fields.body.slice(0, start) + block + fields.body.slice(end);
    set("body")({ target: { value: newVal } });
    setShowLangPicker(false); setLangSearch("");
    setTimeout(() => ta.focus(), 0);
  };

  const filteredLangs = LANGUAGES.filter(l => l.includes(langSearch.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button className="btn btn-outline" onClick={onBack} style={{ padding: "7px 11px" }}>Back</button>
        <input className="input" style={{ flex: 1, fontSize: 15, fontWeight: 500, border: "none", padding: "6px 0", borderBottom: "2px solid #f1f5f9", borderRadius: 0, background: "transparent" }}
          placeholder="Post title..." value={fields.title} onChange={set("title")} />
        {editPost?.isDraft && <span style={{ fontSize: 11, background: "#fef9c3", color: "#a16207", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>Draft</span>}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {publishing
            ? <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888", padding: "0 8px" }}><div className="spinner" /> Working...</div>
            : <>
                <button className="btn btn-outline" onClick={() => onPublish(true)} disabled={publishing}>Save Draft</button>
                <button className="btn btn-green" onClick={() => onPublish(false)} disabled={publishing}>Publish</button>
              </>
          }
        </div>
      </div>
      {status && (
        <div style={{ margin: "10px 20px 0", flexShrink: 0, padding: "10px 14px", borderRadius: 8, fontSize: 13, background: status.type === "success" ? "#f0fdf4" : status.type === "error" ? "#fef2f2" : "#eff6ff", color: status.type === "success" ? "#15803d" : status.type === "error" ? "#b91c1c" : "#1d4ed8", border: `1px solid ${status.type === "success" ? "#bbf7d0" : status.type === "error" ? "#fecaca" : "#bfdbfe"}` }}>
          <div style={{ fontWeight: 500 }}>{status.msg}</div>
          {status.steps?.map((s, i) => <div key={i} style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>- {s}</div>)}
          {status.prUrl && <a href={status.prUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, display: "block", marginTop: 4, color: "inherit", textDecoration: "underline" }}>View PR on GitHub</a>}
        </div>
      )}
      <div style={{ background: "#f8f9fa", borderBottom: "1px solid #e2e8f0", padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 2, background: "#efefef", padding: 3, borderRadius: 8 }}>
          {["content", "meta"].map(t => (
            <button key={t} className={`toolbar-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>
        {activeTab === "content" && !previewMode && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[
              { label: "B", title: "Bold", before: "**", after: "**", style: { fontWeight: 700 } },
              { label: "I", title: "Italic", before: "*", after: "*", style: { fontStyle: "italic" } },
              { label: "H2", title: "Heading", before: "## ", after: "" },
              { label: "---", title: "Divider", before: "\n---\n", after: "" },
              { label: "> ", title: "Blockquote", before: "> ", after: "" },
            ].map(({ label, title, before, after, style }) => (
              <button key={label} title={title} onClick={() => insertAt(before, after)}
                style={{ padding: "4px 9px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: "inherit", color: "#555", ...style }}>
                {label}
              </button>
            ))}
            <div style={{ position: "relative" }}>
              <button title="Insert code block" onClick={() => setShowLangPicker(p => !p)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: showLangPicker ? "#111" : "#fff", color: showLangPicker ? "#fff" : "#555", cursor: "pointer", fontSize: 12, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 5 }}>
                {"</>"} v
              </button>
              {showLangPicker && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, width: 180 }}>
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid #f1f1f1" }}>
                    <input autoFocus className="input" placeholder="Search language..." value={langSearch} onChange={e => setLangSearch(e.target.value)} style={{ padding: "5px 8px", fontSize: 12 }} />
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto" }}>
                    {filteredLangs.map(lang => (
                      <div key={lang} onClick={() => insertCodeBlock(lang)}
                        style={{ padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace", color: "#333" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: 1, height: 18, background: "#e2e8f0", margin: "0 2px" }} />
            <div style={{ display: "flex", gap: 2, background: "#efefef", padding: 3, borderRadius: 8 }}>
              <button className="toolbar-tab active" onClick={() => setPreviewMode(false)}>Write</button>
              <button className="toolbar-tab" onClick={() => setPreviewMode(true)}>Preview</button>
            </div>
          </div>
        )}
        {activeTab === "content" && previewMode && (
          <div style={{ display: "flex", gap: 2, background: "#efefef", padding: 3, borderRadius: 8 }}>
            <button className="toolbar-tab" onClick={() => setPreviewMode(false)}>Write</button>
            <button className="toolbar-tab active" onClick={() => setPreviewMode(true)}>Preview</button>
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflow: "auto" }} onClick={() => showLangPicker && setShowLangPicker(false)}>
        {activeTab === "content" && !previewMode && (
          <textarea ref={textareaRef} className="input input-mono"
            style={{ width: "100%", height: "100%", border: "none", borderRadius: 0, resize: "none", padding: "28px 32px", fontSize: 14, lineHeight: 1.85, outline: "none", background: "#fff" }}
            placeholder="Write your post in Markdown...\n\n## Introduction\n\nStart here..."
            value={fields.body} onChange={set("body")} />
        )}
        {activeTab === "content" && previewMode && <MarkdownPreview content={fields.body} />}
        {activeTab === "meta" && <MetaPanel fields={fields} set={set} />}
      </div>
      <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "5px 20px", display: "flex", gap: 20, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono', monospace" }}>
          {fields.body.split(/\s+/).filter(Boolean).length} words - {fields.body.length} chars
        </span>
        {editPost && <span style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono', monospace" }}>editing: {editPost.name}</span>}
      </div>
    </div>
  );
}

function MetaPanel({ fields, set }) {
  return (
    <div style={{ padding: 28, maxWidth: 680 }}>
      <div style={{ display: "grid", gap: 16 }}>
        <div className="field-grid">
          <Field label="Subtitle" value={fields.subtitle} onChange={set("subtitle")} placeholder="Short tagline" />
          <Field label="Author" value={fields.author} onChange={set("author")} placeholder="Name" />
        </div>
        <div className="field-grid">
          <Field label="Date (UTC)" value={fields.date} onChange={set("date")} placeholder="2024-01-01 10:00:00 UTC" mono />
          <Field label="Category" value={fields.category} onChange={set("category")} placeholder="devops" />
        </div>
        <Field label="Tags (comma-separated)" value={fields.tags} onChange={set("tags")} placeholder="devops, linux, docker" />
        <Field label="Description (SEO)" value={fields.description} onChange={set("description")} placeholder="Brief description" textarea />
        <Field label="Cover Image URL" value={fields.image} onChange={set("image")} placeholder="https://..." />
        <Field label="Optimized Image URL" value={fields.optimized_image} onChange={set("optimized_image")} placeholder="Leave blank to reuse cover image" />
        {fields.image && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div className="field-label" style={{ padding: "8px 12px", background: "#f8f9fa" }}>Image Preview</div>
            <img src={fields.image} alt="cover" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
          </div>
        )}
        <div style={{ padding: 14, background: "#f8f9fa", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div className="field-label" style={{ marginBottom: 6 }}>Generated filename</div>
          <code style={{ fontSize: 13, color: "#555", fontFamily: "'DM Mono', monospace" }}>
            _posts/{filenameFromTitle(fields.title || "untitled", fields.date)}
          </code>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea, mono }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      {textarea
        ? <textarea className="input" rows={3} style={{ resize: "vertical" }} placeholder={placeholder} value={value} onChange={onChange} />
        : <input className={`input${mono ? " input-mono" : ""}`} placeholder={placeholder} value={value} onChange={onChange} />
      }
    </div>
  );
}

function MarkdownPreview({ content }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.Prism) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
      script.onload = () => {
        const autoloader = document.createElement("script");
        autoloader.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
        autoloader.onload = () => { if (ref.current) window.Prism.highlightAllUnder(ref.current); };
        document.head.appendChild(autoloader);
      };
      document.head.appendChild(script);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
      document.head.appendChild(link);
    } else if (ref.current) {
      window.Prism.highlightAllUnder(ref.current);
    }
  }, [content]);

  const codeBlocks = [];
  const withPlaceholders = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const i = codeBlocks.length;
    codeBlocks.push({ lang: lang || "plaintext", code: code.trim() });
    return `%%CODE_BLOCK_${i}%%`;
  });

  const tableRegex = /(\|.+\|\n)([\|\-: ]+\|\n)((?:\|.+\|\n?)*)/gm;
  const withTables = withPlaceholders.replace(tableRegex, (_, header, separator, body) => {
    const parseRow = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const headers = parseRow(header);
    const aligns = parseRow(separator).map(c => c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : "left");
    const rows = body.trim().split("\n").filter(Boolean).map(parseRow);
    const ths = headers.map((h, i) => `<th style="padding:10px 14px;text-align:${aligns[i]};font-weight:600;color:#111;white-space:nowrap">${h}</th>`).join("");
    const trs = rows.map(r => `<tr>${r.map((c, i) => `<td style="padding:9px 14px;text-align:${aligns[i] || "left"};border-top:1px solid #e2e8f0">${c}</td>`).join("")}</tr>`).join("");
    return `<div style="overflow-x:auto;margin:16px 0"><table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:14px"><thead style="background:#f8f9fa"><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  });

  let html = withTables
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:12px 0;display:block;" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n+/g, "</p><p>");

  codeBlocks.forEach(({ lang, code }, i) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const displayLang = lang === "kql" ? "plaintext" : lang;
    const block = `<div style="margin:20px 0;border-radius:10px;overflow:hidden;border:1px solid #2d2d2d;"><div style="background:#1a1a2e;padding:8px 16px;border-bottom:1px solid #2d2d2d;"><span style="font-size:11px;color:#7c8cf8;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.08em;font-weight:600">${lang}</span></div><pre style="margin:0;padding:20px;background:#0d1117;overflow-x:auto;"><code class="language-${displayLang}" style="background:transparent;font-family:'DM Mono',monospace;font-size:13px;line-height:1.7;color:#c9d1d9;">${escaped}</code></pre></div>`;
    html = html.replace(`%%CODE_BLOCK_${i}%%`, block);
  });

  return (
    <div ref={ref} className="md-preview" style={{ padding: "28px 32px", fontSize: 15, color: "#1e293b", maxWidth: 720 }}
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />
  );
}

const PlusIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const GridIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const EditIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const SettingsIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
