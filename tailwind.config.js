/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Fargar frå NDLA-profilen / ndla.no (preset-panda)
      colors: {
        primary: "#2D1B62",
        ndla: {
          tekst: "#18181B",
          dempa: "#61616B",
          lenke: "#155784",
          handling: "#823CC8",
          hover: "#5E1F9E",
          aktiv: "#40116F",
          flate: "#F2F2F3",
          lilla: "#F2EBFC",
          kant: "#94949E",
          diskre: "#C9C9CF",
          feil: "#AD0000",
          "feil-flate": "#FFE6E6",
        },
      },
      fontFamily: {
        sans: ['"NDLA-Satoshi"', '"NDLA Satoshi"', "Arial", "Helvetica", "sans-serif"],
      },
      fontWeight: {
        heading: "670",
      },
      boxShadow: {
        kort: "0 1px 4px rgba(0,0,0,.15), 0 0 1px rgba(0,0,0,.18)",
        "kort-hover": "0 3px 8px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.1), 0 0 1px rgba(0,0,0,.18)",
      },
    },
  },
  plugins: [],
};
