# NDLA Bildesøk

En React + Vite + Tailwind-app som lar deg søke i NDLA sitt bilde-API og filtrere etter lisens, modellklarering og metadata.

## 🚀 Funksjoner

- Søk etter bilder med tittel, alt-tekst og tagger
- Vis metadata: lisens, skapere, rettighetshavere, modellklarering
- Paginering med neste/forrige
- Filtrering:
  - ✅ Kun offentlig tilgjengelige bilder (lisens)
  - 📸 Kun bilder med modellklarering
  - Dynamisk dropdown for lisensvalg
- Modal for forhåndsvisning av bilde og detaljer
- Nedlasting av bilde

## 🚧 Teknologi

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

## ⚡ Installasjon

```bash
git clone https://github.com/ndla/bildesok.git
cd bildesok
npm install
npm run dev
```

🌐 Appen kjører på [http://localhost:5173](http://localhost:5173)

## 💼 Bygg for produksjon

```bash
npm run build
```

## 🌌 Distribusjon

Deployes enkelt med [Vercel](https://vercel.com/) eller annen statisk host.

## 🔗 API-kilde

Bilder og metadata hentes fra NDLA sitt offentlige bilde-API:
```
https://api.ndla.no/image-api/v3/images
```

## 🚩 Lisens

Kildekoden er åpen og kan tilpasses. Bilder fra NDLA må brukes i henhold til spesifisert lisens i hvert enkelt bilde.

---

Laga mest med KI ✨

