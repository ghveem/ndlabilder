// src/ImageSearchApp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [licenseOptions, setLicenseOptions] = useState([]);
  const [onlyModelReleased, setOnlyModelReleased] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const response = await axios.get("https://api.ndla.no/image-api/v3/images", {
      params: {
        query,
        language: "*",
        fallback: false,
        includeCopyrighted: licenseFilter !== "public",
        page,
        pageSize,
      },
    });

    let resultData = response.data.results;

    resultData = resultData.filter(
      (img) => img?.copyright?.license?.license
    );

    if (licenseFilter !== "all" && licenseFilter !== "public") {
      resultData = resultData.filter(
        (img) => img.copyright.license.license === licenseFilter
      );
    }

    if (onlyModelReleased) {
      resultData = resultData.filter(
        (img) => img.image?.modelRelease === "released"
      );
    }

    const licenses = Array.from(new Set(
      resultData
        .map(img => img?.copyright?.license?.license)
        .filter(Boolean)
    )).sort();

    setLicenseOptions(licenses);
    setResults(resultData);
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
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold">NDLA bildesøk</h1>
<p>Dette er ein uoffisiell app basert på <a href="https://api.ndla.no">api.ndla.no</a>.</p>
      <div className="flex flex-col gap-4 mb-6">
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="Søk etter bilder..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              startNewSearch();
            }
          }}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="all">Alle lisenser</option>
            <option value="public">Kun offentlig tilgjengelige</option>
            {licenseOptions.map((license) => (
              <option key={license} value={license}>{license}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyModelReleased}
              onChange={() => setOnlyModelReleased(!onlyModelReleased)}
              className="accent-blue-600"
            />
            Kun modellklarert
          </label>
        </div>

        <button
          onClick={startNewSearch}
          disabled={loading}
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: "#2D1B62" }}
        >
          {loading ? "Laster..." : "Søk"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="overflow-hidden transition border rounded shadow cursor-pointer hover:shadow-lg"
          >
            <img
              src={item.image?.imageUrl}
              alt={item.alttext?.alttext || ""}
              className="object-cover w-full h-48"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold">{item.title?.title}</h3>
              {item.alttext?.alttext && (
                <p className="text-sm italic text-gray-600">Alt: {item.alttext.alttext}</p>
              )}
              {item.copyright?.license?.license && (
                <p className="text-xs text-gray-700">
                  Lisens:{" "}
                  {item.copyright.license.url ? (
                    <a
                      href={item.copyright.license.url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.copyright.license.license}
                    </a>
                  ) : (
                    item.copyright.license.license
                  )}
                </p>
              )}
              {item.copyright?.creators?.length > 0 && (
                <p className="text-xs text-gray-700">
                  Skaper: {item.copyright.creators.map((c) => c.name).join(", ")}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Modellklarert: {item.image?.modelRelease === "released" ? "✅" : "🚫"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && (
        <div className="flex items-center justify-center gap-4 my-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 0}
          >
            Forrige
          </button>
          <span className="text-sm">Side {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Neste
          </button>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold">{selected.title?.title}</h2>
            <img
              src={selected.image?.imageUrl}
              alt={selected.alttext?.alttext}
              className="w-full max-h-[40vh] object-contain mb-4"
            />
            <p className="mb-2 text-sm">{selected.caption?.caption}</p>

            <div className="pt-4 space-y-1 text-sm border-t">
              <p><strong>Språk:</strong> {selected.language}</p>
              <p><strong>Alt-tekst:</strong> {selected.alttext?.alttext}</p>
              <p><strong>Lisens:</strong>{" "}
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
              <p><strong>Opphav:</strong> {selected.copyright?.origin}</p>
              <p><strong>Gyldig fra:</strong> {selected.copyright?.validFrom}</p>
              <p><strong>Gyldig til:</strong> {selected.copyright?.validTo}</p>
              <p><strong>Skapere:</strong> {selected.copyright?.creators?.map((c) => c.name).join(", ")}</p>
              <p><strong>Rettighetshavere:</strong> {selected.copyright?.rightsholders?.map((r) => r.name).join(", ")}</p>
              <p><strong>Behandlet:</strong> {selected.copyright?.processed ? "Ja" : "Nei"}</p>
              <p><strong>Modellklarert:</strong> {selected.image?.modelRelease === "released" ? "Ja" : "Nei"}</p>
            </div>

            <a
              href={selected.image?.imageUrl}
              download
              className="inline-block mt-6 text-blue-600 underline"
            >
              Last ned bilde
            </a>

            <button
              onClick={() => setSelected(null)}
              className="absolute text-xl text-gray-500 top-2 right-2 hover:text-black"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
