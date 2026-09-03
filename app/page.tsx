"use client";

import { useState } from "react";

export default function Home() {
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setEmail("");

    const res = await fetch("/api/generate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, invoiceNumber, amount, dueDate }),
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
          <p className="text-slate-500 mt-1">Generate a professional invoice reminder in seconds</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Client Name</label>
            <input
              placeholder="e.g. Ahmed Khan"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Invoice Number</label>
              <input
                placeholder="INV-102"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
              <input
                placeholder="$500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
            <input
              placeholder="August 25, 2026"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !clientName || !invoiceNumber}
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