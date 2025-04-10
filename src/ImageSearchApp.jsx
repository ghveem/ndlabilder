// ImageSearchApp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Input,
  Heading,
  Select,
} from "@ndla/ui";
import '@ndla/ui/scss/index.scss';

const PAGE_SIZE = 12;

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStats, setFilterStats] = useState({ languages: {}, tags: {}, creators: {} });

  useEffect(() => {
    if (query) handleSearch();
  }, [page, licenseFilter]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.ndla.no/image-api/v3/images", {
        params: {
          query,
          language: "*",
          fallback: false,
          includeCopyrighted: licenseFilter !== "public-domain",
          page,
          pageSize: PAGE_SIZE,
        },
      });

      let filteredResults = response.data.results || [];

      if (languageFilter)
        filteredResults = filteredResults.filter(
          (item) =>
            item.language === languageFilter ||
            item.supportedLanguages?.includes(languageFilter)
        );

      if (tagFilter)
        filteredResults = filteredResults.filter((item) =>
          item.tags?.tags?.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
        );

      if (creatorFilter)
        filteredResults = filteredResults.filter((item) =>
          item.copyright?.creators?.some((c) =>
            c.name.toLowerCase().includes(creatorFilter.toLowerCase())
          )
        );

      const languageCounts = {};
      const tagCounts = {};
      const creatorCounts = {};
      response.data.results.forEach((item) => {
        const lang = item.language || "ukjent";
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;

        item.tags?.tags?.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });

        item.copyright?.creators?.forEach((c) => {
          creatorCounts[c.name] = (creatorCounts[c.name] || 0) + 1;
        });
      });

      setResults(filteredResults);
      setTotalCount(response.data.totalCount || 0);
      setFilterStats({ languages: languageCounts, tags: tagCounts, creators: creatorCounts });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="ndla-container">
      <Heading level="1">Bildesøk</Heading>

      <div className="ndla-grid ndla-grid--spacing mb-4">
        <Input
          label="Søkeord"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          label="Lisensfilter"
          value={licenseFilter}
          onChange={(val) => {
            setLicenseFilter(val);
            setPage(0);
          }}
        >
          <option value="all">Alle lisenser</option>
          <option value="public-domain">Kun offentlig eiendom</option>
        </Select>
        <Input
          label="Filtrer språk"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        />
        <Input
          label="Filtrer tags"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <Input
          label="Filtrer skaper"
          value={creatorFilter}
          onChange={(e) => setCreatorFilter(e.target.value)}
        />
        <Button onClick={() => { setPage(0); handleSearch(); }}>
          {loading ? "Søker..." : "Søk"}
        </Button>
      </div>

      <div className="ndla-grid ndla-grid--spacing">
        {results.map((item) => (
          <div key={item.id} className="c-card" onClick={() => setSelectedImage(item)}>
            <div className="c-card__image">
              <img src={item.image?.imageUrl} alt={item.alttext?.alttext || "Bilde"} />
            </div>
            <div className="c-card__content">
              <h3>{item.title?.title}</h3>
              <p>{item.caption?.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-5">
          <Button onClick={() => setPage(Math.max(page - 1, 0))} disabled={page === 0}>
            Forrige
          </Button>
          <span className="mx-2">Side {page + 1} av {totalPages}</span>
          <Button onClick={() => setPage(Math.min(page + 1, totalPages - 1))} disabled={page >= totalPages - 1}>
            Neste
          </Button>
        </div>
      )}

      {selectedImage && (
        <Modal isOpen={true} onClose={() => setSelectedImage(null)} title={selectedImage.title?.title}>
          <img
            src={selectedImage.image?.imageUrl}
            alt={selectedImage.alttext?.alttext || ""}
            style={{ maxWidth: "100%", maxHeight: "60vh" }}
          />
          <ul>
            <li><strong>Billedtekst:</strong> {selectedImage.caption?.caption}</li>
            <li><strong>Språk:</strong> {selectedImage.language}</li>
            <li><strong>Skaper:</strong> {selectedImage.copyright?.creators?.map((c) => c.name).join(", ")}</li>
            <li><strong>Lisens:</strong> {selectedImage.copyright?.license?.license}</li>
          </ul>
          <a href={selectedImage.image?.imageUrl} download className="c-button c-button--secondary mt-2">
            Last ned bilde
          </a>
        </Modal>
      )}

      <div className="mt-10">
        <Heading level="2">Filterstatistikk</Heading>
        <div className="ndla-grid ndla-grid--spacing">
          <div>
            <h4>Språk</h4>
            <ul>
              {Object.entries(filterStats.languages).map(([lang, count]) => (
                <li key={lang}>{lang}: {count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Tags</h4>
            <ul>
              {Object.entries(filterStats.tags).map(([tag, count]) => (
                <li key={tag}>{tag}: {count}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Skapere</h4>
            <ul>
              {Object.entries(filterStats.creators).map(([creator, count]) => (
                <li key={creator}>{creator}: {count}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
