# CLAUDE.md for ndlabilder

Bildesøk for NDLA: React 18, Vite og Tailwind CSS 4 mot det opne image-api-et til NDLA. Grensesnittet er på nynorsk. Sjå README.md for funksjonar og API-detaljar.

## Køyring

- `npm install`, deretter `npm run dev` (http://localhost:5173)
- `npm run build` byggjer til `dist/`, `npm run preview` viser bygget lokalt. Mappa er i .gitignore, Vercel byggjer sjølv ved push til `main` (ndlabilder.vercel.app)
- Det finst ingen testar eller lint-steg

## Struktur

- `src/ImageSearchApp.jsx`: heile appen (søk, filter, sortering, kort, dialog, nedlasting)
- `src/index.css`: Tailwind-tema med NDLA-fargar og NDLA-Satoshi (Arial som reserve)
- `src/main.jsx` og `index.html`: oppstart
- API: `https://api.ndla.no/image-api/v3/images`

## Fallgruver

- Query-parametrane brukar bindestrek (`page-size`, `model-released`, `ai-generated`, `query-fields`), og `page` byrjar på 1
- Filtrering skjer i API-et, ikkje i nettlesaren
- `ai-generated` manglar på dei fleste bileta. Me kan difor berre filtrere *til* K.I.-genererte, ikkje *bort* frå dei
- Miniatyrbilete brukar varianten med `size === "small"` frå API-et, med `imageUrl` som reserve

## Reglar

- Bruk git med små, tydelege commits, og aldri push direkte til `main`. Bruk eiga grein og PR
- Trygg .gitignore, ingen hemmelegheiter eller tokens i repoet (`.env*` er alt ignorert)
- Oppdater README.md når noko endrar seg
- Bruk /ndla-brand for UI
- Skriv nynorsk, utan tankestrek, bruk «me» og «K.I.»
- Gjer berre det som er bede om, kvar endra linje skal følgje av oppgåva
