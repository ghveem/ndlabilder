# NDLA Bildesøk

En React + Vite + Tailwind-app som lar deg søke i NDLA sitt bilde-API og filtrere etter lisens, modellklarering og metadata.

## 🚀 Funksjoner

- Søk etter bilder med tittel, alt-tekst og tagger
- Vis metadata: lisens, skapere, bearbeidere, rettighetshavere, modellklarering, KI-generert, tags, dimensjoner og filstørrelse
- Paginering med neste/forrige og totalt antall treff
- Filtrering (gjøres i API-et, ikke i nettleseren):
  - ✅ Kun offentlig tilgjengelige bilder (utelater `COPYRIGHTED`)
  - 📸 Kun modellklarerte bilder (`model-released=yes`)
  - Kun KI-genererte bilder, helt eller delvis (`ai-generated=Yes,Partial`). Merk at de fleste bildene mangler denne verdien, så det går ikke an å filtrere *bort* KI-genererte bilder pålitelig.
  - Valg av enkeltlisens (`license`)
  - Inaktive bilder skjules som standard (`inactive=false`), kan slås på
- Miniatyrbilder bruker `small.webp`-varianten fra API-et
- Merkelapp «KI-generert» / «Delvis KI-generert» på kortene når bildet er merket slik i API-et
- Utseende etter NDLAs visuelle profil: farger, typografi (NDLA-Satoshi med Arial som reserve), knapper, felt, kort og fokusmarkering som på ndla.no. Grensesnittet er på nynorsk.
- Modal for forhåndsvisning av bilde og detaljer
- Nedlasting av bilde

## 🚧 Teknologi

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite` (tema i `src/index.css`)
- [Axios](https://axios-http.com/)

## ⚡ Installasjon

```bash
git clone https://github.com/ghveem/ndlabilder.git
cd ndlabilder
npm install
npm run dev
```

🌐 Appen kjører på [http://localhost:5173](http://localhost:5173)

## 💼 Bygg for produksjon

```bash
npm run build
```

## 🌌 Distribusjon

Kjører på [ndlabilder.vercel.app](https://ndlabilder.vercel.app). Vercel bygger appen selv (`npm run build`) ved push til `main`, så `dist/` sjekkes ikke inn i git.

## 🔗 API-kilde

Bilder og metadata hentes fra NDLA sitt offentlige bilde-API:
```
https://api.ndla.no/image-api/v3/images
```

**Kjent API-feil (CORS):** CloudFront foran `api.ndla.no` cacher `Access-Control-Allow-Origin` uten `Vary: Origin`, så et svar laget for ett domene kan bli servert til et annet og blokkert av nettleseren. Appen sender derfor `klient=<vertsnavn>` som ekstra parameter, slik at hvert domene får sin egen cache-oppføring. Kan fjernes når feilen er rettet i API-et.

Dokumentasjon: [api.ndla.no/swagger](https://api.ndla.no/swagger?url=https://api.ndla.no/image-api/api-docs). Merk at query-parametrene bruker bindestrek (`page-size`, `model-released`), og at `page` starter på 1.

## 🚩 Lisens

Kildekoden er åpen og kan tilpasses. Bilder fra NDLA må brukes i henhold til spesifisert lisens i hvert enkelt bilde.

---

Laga mest med KI ✨

