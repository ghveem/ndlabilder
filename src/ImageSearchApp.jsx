import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const handleSearch = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://api.ndla.no/image-api/v3/images",
      {
        params: {
          query,
          language: "*",
          fallback: false,
          includeCopyrighted: false,
          page,
          pageSize,
        },
      }
    );
    setResults(response.data.results);
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [page]);

  const startNewSearch = () => {
    setPage(0);
    handleSearch();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NDLA bildesøk</h1>
      <p>Uoffisiell app.</p>

      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Søk etter bilder..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={startNewSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Laster..." : "Søk"}
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="cursor-pointer border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={item.image?.imageUrl}
              alt={item.alttext?.alttext || ""}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{item.title?.title}</h3>
              <p className="text-sm text-gray-600">{item.caption?.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="flex justify-center items-center gap-4 my-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
            disabled={page === 0}
          >
            Forrige
          </button>
          <span className="text-sm">Side {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Neste
          </button>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selected.title?.title}</h2>
            <img
              src={selected.image?.imageUrl}
              alt={selected.alttext?.alttext}
              className="w-full max-h-[40vh] object-contain mb-4"
            />
            <p className="text-sm mb-2">{selected.caption?.caption}</p>

            <div className="border-t pt-4 text-sm space-y-1">
              <p>
                <strong>Språk:</strong> {selected.language}
              </p>
              <p>
                <strong>Alt-tekst:</strong> {selected.alttext?.alttext}
              </p>
              <p>
                <strong>Lisens:</strong>{" "}
                {selected.copyright?.license?.url ? (
                  <a
                    href={selected.copyright.license.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {selected.copyright.license.license}
                  </a>
                ) : (
                  selected.copyright?.license?.license
                )}
              </p>
              <p>
                <strong>Opphav:</strong> {selected.copyright?.origin}
              </p>
              <p>
                <strong>Gyldig fra:</strong> {selected.copyright?.validFrom}
              </p>
              <p>
                <strong>Gyldig til:</strong> {selected.copyright?.validTo}
              </p>
              <p>
                <strong>Skapere:</strong>{" "}
                {selected.copyright?.creators?.map((c) => c.name).join(", ")}
              </p>
              <p>
                <strong>Rettighetshavere:</strong>{" "}
                {selected.copyright?.rightsholders
                  ?.map((r) => r.name)
                  .join(", ")}
              </p>
              <p>
                <strong>Behandlet:</strong>{" "}
                {selected.copyright?.processed ? "Ja" : "Nei"}
              </p>
            </div>

            <a
              href={selected.image?.imageUrl}
              download
              className="mt-6 inline-block text-blue-600 underline"
            >
              Last ned bilde
            </a>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
