// Multimedia + libros publicados.
// Datos compartidos entre QuienesSomos (resumen en home) y SobreMi (vista completa).

export type MultimediaItem = {
  title: string;
  shortTitle?: string;
  type?: string;
  source?: string;
  url?: string;
  duration?: string;
  badgeColor?: string;
  image?: string;
  date?: string;
};

export type Book = {
  title: string;
  image: string;
  publisher: string;
  year: string;
  link: string | null;
};

export const multimedia: { interviews: MultimediaItem[]; podcasts: MultimediaItem[] } = {
  interviews: [
    {
      title: 'Entrevista caso Chahla c/ Paredes Alan. Mal uso de IA. Datos biométricos y deepfakes',
      shortTitle: 'Caso Chahla: IA y Deepfakes',
      type: 'Video',
      source: 'YouTube',
      url: 'https://youtu.be/38fzZmfny68?si=bpSXPjpzgnR_wPnO',
      duration: '15:42',
      badgeColor: 'bg-red-600',
    },
    {
      title: 'Charla en La Gaceta: El futuro de la Justicia Digital',
      shortTitle: 'Evento La gaceta IA y Sustentabilidad',
      type: 'Video',
      source: 'LA GACETA TV',
      url: 'https://www.youtube.com/watch?v=PbbiO69oV9w&t=5s',
      image: '/content/media/la-gaceta-ia-sustentabilidad.webp',
      badgeColor: 'bg-red-600',
    },
    {
      title: 'Quién es Marco Rossi: el abogado que pone a Tucumán en el mapa de la mano de la IA',
      shortTitle: 'El abogado que pone a Tucumán en el mapa de la IA',
      type: 'Artículo',
      source: 'Show Online',
      url: 'https://showonline.com.ar/contenido/11110/quien-es-marco-rossi-el-abogado-que-pone-a-tucuman-en-el-mapa-de-la-mano-de-la-i',
      image: '/content/media/show-online-tucuman-ia.webp',
      date: 'Nov 2024',
      badgeColor: 'bg-indigo-600',
    },
    {
      title: 'Inteligencia Artificial en el ejercicio legal',
      shortTitle: 'Entrevista sobre IA y Derecho',
      type: 'Video',
      source: 'ENTREVISTA',
      url: 'https://www.youtube.com/watch?v=cBHpaYR9QlE&t=1s',
      badgeColor: 'bg-emerald-600',
    },
    {
      title: "Marco Rossi: 'La Justicia también puede innovar y humanizar'",
      shortTitle: '“La justicia también puede innovar y humanizar”',
      type: 'Artículo',
      source: 'La Gaceta',
      url: 'https://www.lagaceta.com.ar/nota/amp/1088664/sociedad/marco-rossi-justicia-tambien-puede-innovar-humanizar.html',
      image: '/content/media/la-gaceta-innovar.webp',
      date: 'Nov 2024',
      badgeColor: 'bg-blue-600',
    },
    {
      title: 'La Inteligencia Artificial aplicada al beneficio de los tucumanos',
      shortTitle: 'La Inteligencia Artificial aplicada en beneficio de los tucumanos',
      type: 'Radio',
      source: 'LV12',
      url: 'https://www.lv12.com.ar/inteligencia-artificial/la-inteligencia-artificial-aplicada-beneficio-los-tucumanos-n167419',
      image: '/content/media/lv12-beneficio.webp',
      date: 'Oct 2024',
      badgeColor: 'bg-orange-500',
    },
    {
      title: "Marco Rossi: 'Hoy todos somos informáticos'",
      shortTitle: 'Marco Rossi sobre la IA',
      type: 'Artículo',
      source: 'ENTERATE',
      url: 'https://www.enteratenoticias.com.ar/actualidad/marco-rossi-hoy-todos-somos-informaticos/',
      image: '/content/media/enterate-noticias.webp',
      badgeColor: 'bg-amber-500',
    },
    {
      title: 'Debate sobre Inteligencia Artificial en el ámbito legal',
      shortTitle: 'IA en Universidad Tecnológica de México',
      type: 'Video',
      source: 'PANEL',
      url: 'https://www.youtube.com/watch?v=l-EeDpqTX-I',
      image: '/content/media/debate-ia-mexico.webp',
      badgeColor: 'bg-red-500',
    },
  ],
  podcasts: [
    {
      title: 'Un innovador de verdad en la justicia',
      url: 'https://open.spotify.com/episode/2NCJg4x36jJFSZJ5h14JZ0?si=SIlxfJu2QHuYQdwupOGh_w&t=0&pi=-Tt-piIDQ2em7',
      duration: '45 min',
      source: 'Spotify',
      image: '/content/media/derecho-y-codigo.webp',
    },
    {
      title: 'Justicia 4.0 - Transformación Digital',
      url: 'https://open.spotify.com/episode/36d5ZrqKNRHC7lWcrJfOgq?si=RZPdXz2DRCunNX986xjZHg',
      duration: '32 min',
      source: 'Spotify',
    },
    {
      title: 'Entrevista Radial - Inteligencia Artificial',
      url: 'https://youtu.be/X7niXzmvaEs',
      type: 'YouTube',
      source: 'Radio',
      duration: '20 min',
    },
    {
      title: 'Legal Tech Talk',
      duration: '50 min',
      image: '/content/podcasts/legal-tech-talk.webp',
      source: 'Podcast',
    },
  ],
};

export const books: Book[] = [
  {
    title: 'Impacto de la Inteligencia Artificial en el ámbito legal',
    image: '/books/impacto-ia.webp',
    publisher: 'Editorial Hammurabi',
    year: '2025',
    link: null,
  },
  {
    title: 'Justicia Algorítmica',
    image: '/content/books/justicia-algoritmica.webp',
    publisher: 'Editorial IADPI',
    year: '2024',
    link: 'https://ebook.iadpi.com.ar/shop/detalle/16',
  },
  {
    title: 'Metaverso y Resolución de Conflictos',
    image: '/content/books/metaverso-conflictos.webp',
    publisher: 'elDial.com',
    year: '2024',
    link: 'https://tienda.eldial.com/productos/e-book-metaverso-y-resolucion-de-conflictos/',
  },
  {
    title: '¿Qué me hace especIAl? La conflictiva relación entre la ficción y la realidad',
    image: '/content/books/que-me-hace-especial.webp',
    publisher: 'Editorial Bibliotex',
    year: '2024',
    link: 'https://bibliotexlibros.mitiendanube.com/productos/rossi-maidana-que-me-hace-especial-gc5ni/',
  },
];

// YouTube helpers
export const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};
