import React, { useState } from 'react';
import { Search, Link } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractVideoLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVideoLinks([]);

    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const html = data.contents;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const links: string[] = [];
      const videoElements = doc.getElementsByTagName('video');
      const iframeElements = doc.getElementsByTagName('iframe');

      for (const video of videoElements) {
        const source = video.getAttribute('src');
        if (source) links.push(source);
      }

      for (const iframe of iframeElements) {
        const source = iframe.getAttribute('src');
        if (source && (source.includes('youtube.com') || source.includes('vimeo.com'))) {
          links.push(source);
        }
      }

      setVideoLinks(links);
    } catch (err) {
      setError('Error al extraer los enlaces de video. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Extractor de Enlaces de Video</h1>
      <form onSubmit={extractVideoLinks} className="w-full max-w-md">
        <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="url"
            placeholder="Ingrese la URL de la página web"
            aria-label="URL de la página web"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            <Search size={20} />
          </button>
        </div>
      </form>
      {loading && <p className="mt-4">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {videoLinks.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Enlaces de Video Extraídos:</h2>
          <ul className="space-y-2">
            {videoLinks.map((link, index) => (
              <li key={index} className="flex items-center">
                <Link size={16} className="mr-2 text-blue-500" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;