// src/ImageSearchApp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Lisensar som finst i image-api (license-parameteren).
const LICENSES = [
  "CC0-1.0",
  "PD",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-NC-4.0",
  "CC-BY-ND-4.0",
  "CC-BY-NC-SA-4.0",
  "CC-BY-NC-ND-4.0",
  "COPYRIGHTED",
];

const MODEL_RELEASE = {
  yes: "Ja",
  no: "Nei",
  "not-applicable": "Ikkje relevant",
  "not-set": "Ikkje sett",
};

const AI_GENERATED = { Yes: "Ja", Partial: "Delvis", No: "Nei" };

const AI_BADGE = { Yes: "KI-generert", Partial: "Delvis KI-generert" };

const thumbnailUrl = (image) =>
  image?.variants?.find((v) => v.size === "small")?.variantUrl || image?.imageUrl;

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [onlyModelReleased, setOnlyModelReleased] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [onlyAiGenerated, setOnlyAiGenerated] = useState(false);
  // Søket som faktisk blir køyrt; blir sett når brukaren trykkjer Søk/Enter.
  const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!search) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://api.ndla.no/image-api/v3/images", {
          params: {
            query: search.query,
            language: "*",
            fallback: false,
            license: search.license === "public" ? undefined : search.license,
            "model-released": search.onlyModelReleased ? "yes" : undefined,
            "ai-generated": search.onlyAiGenerated ? "Yes,Partial" : undefined,
            inactive: search.includeInactive ? undefined : false,
            page,
            "page-size": pageSize,
          },
        });
        if (cancelled) return;
        setResults(response.data.results);
        setTotalCount(response.data.totalCount);
      } catch (e) {
        if (cancelled) return;
        setResults([]);
        setTotalCount(0);
        setError("Klarte ikkje å hente bilete frå API-et. Prøv igjen.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [search, page]);

  const startNewSearch = () => {
    setPage(1);
    setSearch({ query, license: licenseFilter, onlyModelReleased, onlyAiGenerated, includeInactive });
  };

  const lastPage = Math.max(1, Math.ceil(totalCount / pageSize));

  const field =
    "min-h-12 px-3 border border-ndla-kant rounded-sm bg-white hover:border-ndla-handling focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary";
  const primaryButton =
    "min-h-12 px-4 py-2 font-heading text-white bg-primary rounded-sm transition-colors hover:bg-ndla-hover active:bg-ndla-aktiv disabled:opacity-60";
  const secondaryButton =
    "min-h-12 px-4 py-2 font-heading text-primary bg-white border border-primary rounded-sm transition-colors hover:bg-ndla-lilla disabled:opacity-40 disabled:hover:bg-white";

  return (
    <div className="px-4 py-8 mx-auto max-w-[1128px]">
      <h1 className="mb-2 text-[38px] leading-[48px] sm:text-5xl sm:leading-[60px] font-heading tracking-[-0.01em] text-primary">
        NDLA bildesøk
      </h1>
      <p className="mb-8 text-ndla-dempa">
        Dette er ein uoffisiell app basert på <a href="https://api.ndla.no">api.ndla.no</a>.
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <label className="flex flex-col gap-1 font-heading">
          Søkjeord
          <input
            type="search"
            className={`${field} w-full font-normal`}
            placeholder="Til dømes hund, fjell eller mikroskop"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                startNewSearch();
              }
            }}
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            aria-label="Lisens"
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
            className={field}
          >
            <option value="all">Alle lisensar</option>
            <option value="public">Berre opne lisensar</option>
            {LICENSES.map((license) => (
              <option key={license} value={license}>{license}</option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyModelReleased}
              onChange={() => setOnlyModelReleased(!onlyModelReleased)}
              className="w-5 h-5 accent-primary"
            />
            Berre modellklarerte
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlyAiGenerated}
              onChange={() => setOnlyAiGenerated(!onlyAiGenerated)}
              className="w-5 h-5 accent-primary"
            />
            Berre KI-genererte
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={() => setIncludeInactive(!includeInactive)}
              className="w-5 h-5 accent-primary"
            />
            Vis inaktive bilete
          </label>
        </div>

        <button onClick={startNewSearch} disabled={loading} className={`${primaryButton} sm:self-start sm:px-8`}>
          {loading ? "Søkjer …" : "Søk"}
        </button>
      </div>

      {error && (
        <p role="alert" className="p-6 mb-8 border rounded-sm border-ndla-feil bg-ndla-feil-flate text-ndla-feil">
          {error}
        </p>
      )}

      {search && !loading && !error && (
        <p className="mb-4 text-sm text-ndla-dempa">{totalCount} treff</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <article
            key={item.id}
            className="relative overflow-hidden bg-white rounded-sm shadow-kort transition-shadow hover:shadow-kort-hover"
          >
            <img
              src={thumbnailUrl(item.image)}
              alt={item.alttext?.alttext || ""}
              loading="lazy"
              className="object-cover w-full h-[200px] bg-ndla-flate"
            />
            <div className="p-4 space-y-1">
              {AI_BADGE[item.aiGenerated] && (
                <span className="inline-block px-3 mb-1 text-sm border rounded-sm border-ndla-motivasjon bg-ndla-lilla text-ndla-tekst">
                  {AI_BADGE[item.aiGenerated]}
                </span>
              )}
              <h2 className="text-lg leading-6 font-heading tracking-[-0.01em] text-primary">
                {/* Knappen dekkjer heile kortet */}
                <button
                  onClick={() => setSelected(item)}
                  className="text-left after:absolute after:inset-0 after:content-['']"
                >
                  {item.title?.title}
                </button>
              </h2>
              {item.alttext?.alttext && (
                <p className="text-sm text-ndla-dempa">Alt-tekst: {item.alttext.alttext}</p>
              )}
              {item.copyright?.license?.license && (
                <p className="text-sm">
                  Lisens:{" "}
                  {item.copyright.license.url ? (
                    <a
                      href={item.copyright.license.url}
                      className="relative z-10"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.copyright.license.license}
                    </a>
                  ) : (
                    item.copyright.license.license
                  )}
                </p>
              )}
              {item.copyright?.creators?.length > 0 && (
                <p className="text-sm">
                  Opphavsperson: {item.copyright.creators.map((c) => c.name).join(", ")}
                </p>
              )}
              <p className="text-sm text-ndla-dempa">
                Modellklarert: {MODEL_RELEASE[item.modelRelease] || item.modelRelease}
              </p>
            </div>
          </article>
        ))}
      </div>

      {results.length > 0 && (
        <nav aria-label="Sider" className="flex items-center justify-center gap-4 my-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={secondaryButton}
            disabled={page === 1 || loading}
          >
            Førre
          </button>
          <span className="text-sm">Side {page} av {lastPage}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className={secondaryButton}
            disabled={page >= lastPage || loading}
          >
            Neste
          </button>
        </nav>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-tittel"
            className="bg-white p-6 rounded-sm shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dialog-tittel" className="mb-4 pr-10 text-[22px] leading-[30px] font-heading tracking-[-0.01em] text-primary">
              {selected.title?.title}
            </h2>
            <img
              src={selected.image?.imageUrl}
              alt={selected.alttext?.alttext}
              className="w-full max-h-[40vh] object-contain mb-4 bg-ndla-flate"
            />
            <p className="mb-2 text-sm">{selected.caption?.caption}</p>

            <div className="pt-4 space-y-1 text-sm border-t border-ndla-diskre">
              <p><strong>Språk:</strong> {selected.supportedLanguages?.join(", ")}</p>
              <p><strong>Alt-tekst:</strong> {selected.alttext?.alttext}</p>
              <p><strong>Lisens:</strong>{" "}
                {selected.copyright?.license?.url ? (
                  <a
                    href={selected.copyright.license.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.copyright.license.license}
                  </a>
                ) : (
                  selected.copyright?.license?.license
                )}
              </p>
              <p><strong>Opphav:</strong> {selected.copyright?.origin}</p>
              <p><strong>Gyldig frå:</strong> {selected.copyright?.validFrom}</p>
              <p><strong>Gyldig til:</strong> {selected.copyright?.validTo}</p>
              <p><strong>Bearbeidd av:</strong> {selected.copyright?.processors?.map((p) => p.name).join(", ")}</p>
              <p><strong>Opphavspersonar:</strong> {selected.copyright?.creators?.map((c) => c.name).join(", ")}</p>
              <p><strong>Rettshavarar:</strong> {selected.copyright?.rightsholders?.map((r) => r.name).join(", ")}</p>
              <p><strong>Handsama:</strong> {selected.copyright?.processed ? "Ja" : "Nei"}</p>
              <p><strong>Modellklarert:</strong> {MODEL_RELEASE[selected.modelRelease] || selected.modelRelease}</p>
              <p><strong>KI-generert:</strong> {AI_GENERATED[selected.aiGenerated] || "Ukjent"}</p>
              <p><strong>Emneord:</strong> {selected.tags?.tags?.join(", ")}</p>
              <p><strong>Storleik:</strong>{" "}
                {selected.image?.dimensions && `${selected.image.dimensions.width} × ${selected.image.dimensions.height} px, `}
                {selected.image?.size && `${Math.round(selected.image.size / 1024)} kB, `}
                {selected.image?.contentType}
              </p>
              <p><strong>Oppretta:</strong> {selected.created?.slice(0, 10)}</p>
              {selected.inactive && <p><strong>Inaktivt:</strong> Ja</p>}
            </div>

            <a
              href={selected.image?.imageUrl}
              download
              className={`${primaryButton} inline-flex items-center mt-6 no-underline text-white`}
            >
              Last ned biletet
            </a>

            <button
              onClick={() => setSelected(null)}
              aria-label="Lukk"
              className="absolute flex items-center justify-center w-10 h-10 text-2xl rounded-sm top-2 right-2 text-primary hover:bg-ndla-lilla"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
