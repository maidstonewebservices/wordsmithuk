import React, { useState } from "react";
import jsPDF from "jspdf";

export default function EbookGeneratorForm() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [wordCount, setWordCount] = useState(3000);
  const [loading, setLoading] = useState(false);
  const [ebook, setEbook] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEbook(null);

    const response = await fetch("https://wordsmithuk-backend.onrender.com/generate-ebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        niche,
        audience,
        tone: "British English",
        word_count: wordCount,
      }),
    });

    const data = await response.json();
    setEbook(data.ebook);
    setLoading(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(ebook, 180);
    doc.text(lines, 10, 10);
    doc.save("ebook.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generate a British-Style Ebook</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Niche (e.g., personal finance)"
          className="w-full p-2 border rounded"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Audience (e.g., over 50s)"
          className="w-full p-2 border rounded"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Word Count (e.g., 3000)"
          className="w-full p-2 border rounded"
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Ebook"}
        </button>
      </form>
      {ebook && (
        <div className="mt-6 bg-white p-4 border rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Generated Ebook</h3>
          <pre className="whitespace-pre-wrap text-sm mb-4">{ebook}</pre>
          <button
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}