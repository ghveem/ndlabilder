// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ImageSearchApp from './ImageSearchApp';
import '@ndla/ui/scss/index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ImageSearchApp />
  </React.StrictMode>
);