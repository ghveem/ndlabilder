# NDLA bildesøk

Ein React + Vite + Tailwind-app som lèt deg søkje i bilete-API-et til NDLA og filtrere på lisens, modellklarering og metadata.

## 🚀 Funksjonar

- Søk etter bilete på tittel, alt-tekst og emneord
- Vis metadata: lisens, opphavspersonar, bearbeidarar, rettshavarar, modellklarering, KI-generert, emneord, dimensjonar og filstorleik
- Sideinndeling med førre/neste, talet på treff og val av 12, 24 eller 48 treff per side (`page-size`)
- Sortering på relevans, tittel, sist oppdatert, breidd eller høgd, fallande eller stigande (`sort`)
- Filtrering (skjer i API-et, ikkje i nettlesaren):
  - ✅ Berre opne lisensar (utelèt `COPYRIGHTED`)
  - 📸 Berre modellklarerte bilete (`model-released=yes`)
  - Berre KI-genererte bilete, heilt eller delvis (`ai-generated=Yes,Partial`). Dei fleste bileta manglar denne verdien, så det går ikkje an å filtrere *bort* KI-genererte bilete på ein påliteleg måte.
  - Val av enkeltlisens (`license`)
  - Språk (`language`): bokmål, nynorsk, engelsk, nordsamisk, sørsamisk, kinesisk, tysk eller ukjent (`und`)
  - Kva felt søket gjeld (`query-fields`): tittel, alt-tekst, bilettekst, emneord, opphavsperson, bearbeidar eller rettshavar
  - Inaktive bilete er skjulte som standard (`inactive=false`), men kan visast
- Miniatyrbileta brukar `small.webp`-varianten frå API-et
- Merkelapp «KI-generert» / «Delvis KI-generert» på korta når biletet er merkt slik i API-et
- Utsjånad etter den visuelle profilen til NDLA: fargar, typografi (NDLA-Satoshi med Arial som reserve), knappar, felt, kort og fokusmarkering som på ndla.no. Grensesnittet er på nynorsk.
- Dialog med førehandsvising av biletet og detaljar
- Nedlasting av biletet

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

🌐 Appen køyrer på [http://localhost:5173](http://localhost:5173)

## 💼 Bygg for produksjon

```bash
npm run build
```

## 🌌 Distribusjon

Køyrer på [ndlabilder.vercel.app](https://ndlabilder.vercel.app). Vercel byggjer appen sjølv (`npm run build`) ved push til `main`, så `dist/` blir ikkje sjekka inn i git.

## 🔗 API-kjelde

Bilete og metadata blir henta frå det opne bilete-API-et til NDLA:
```
https://api.ndla.no/image-api/v3/images
```

**Kjend API-feil (CORS):** CloudFront framfor `api.ndla.no` lagrar `Access-Control-Allow-Origin` i mellomlageret utan `Vary: Origin`, så eit svar laga for eitt domene kan bli servert til eit anna og blokkert av nettlesaren. Appen sender difor `klient=<vertsnamn>` som ekstra parameter, slik at kvart domene får si eiga oppføring i mellomlageret. Feilen er meld til dei som driftar API-et (oktober 2026). Parameteren kan fjernast når feilen er retta.

Dokumentasjon: [api.ndla.no/swagger](https://api.ndla.no/swagger?url=https://api.ndla.no/image-api/api-docs). Merk at query-parametrane brukar bindestrek (`page-size`, `model-released`, `ai-generated`), og at `page` byrjar på 1.

## 🚩 Lisens

Kjeldekoden er open og kan tilpassast. Bilete frå NDLA må brukast i samsvar med lisensen som er oppgitt for kvart enkelt bilete.

---

Laga mest med KI ✨
