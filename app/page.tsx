"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Formal");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setEmail("");

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("tone", tone);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("/api/generate-email", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setEmail(data.email || "Something went wrong.");
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">✉️ AI Email Writer</h1>
          <p className="text-slate-500 mt-1">Describe what you need — the AI writes the email</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              What should this email be about?
            </label>
            <textarea
              placeholder="e.g. Remind Ahmed about invoice #INV-102 for $500, due Aug 25, 2026. Or: Write a thank-you email to a client after a successful project."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition bg-white"
            >
              <option value="Formal">Formal</option>
              <option value="Informal">Informal</option>
              <option value="Friendly">Friendly / Casual</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Attach PDF (optional)
              </label>
              <input
                type="file"
               accept="application/pdf,.docx"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Attach Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>
        </div>

        {email && (
          <div className="mt-6 relative">
            <div className="whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-5 text-sm text-slate-700 leading-relaxed">
              {email}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:bg-slate-100 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}