// README.md
# 📷 NDLA Bildesøk

En webapplikasjon bygget med React og NDLA Designsystem for å søke og vise bilder via NDLA sitt bilde-API.

## 🚀 Live

Deployet på Vercel: [https://<ditt-prosjektnavn>.vercel.app](https://<ditt-prosjektnavn>.vercel.app)

---

## 🔧 Teknologi

- ⚛️ React + Vite
- 🎨 [@ndla/ui](https://www.npmjs.com/package/@ndla/ui)
- 🔍 Axios for API-kall
- 💽 NDLA Image API v3
- ☁️ Vercel for hosting

---

## 📦 Kom i gang

1. **Klon repoet**

```bash
git clone https://github.com/<brukernavn>/<repo>.git
cd <repo>
```

2. **Installer avhengigheter**

```bash
npm install
```

3. **Kjør lokalt**

```bash
npm run dev
```

4. **Bygg for produksjon**

```bash
npm run build
```

---

## 🌍 Deploy til Vercel

1. Push koden til GitHub
2. Gå til [https://vercel.com](https://vercel.com)
3. Opprett nytt prosjekt og koble til repoet
4. Vercel oppdager `vite` automatisk
5. Klikk **Deploy**

> Appen blir nå tilgjengelig på en egendefinert `*.vercel.app` URL 🎉

---

## 📁 Prosjektstruktur

```
.
├── public/
├── src/
│   ├── ImageSearchApp.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
├── .github/workflows/deploy.yml
└── README.md
```

---

## 📜 Lisens

Dette prosjektet er under MIT-lisens og er utviklet med ❤️ for NDLA og åpen kildekode.