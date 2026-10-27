import { useEffect } from 'react';
import { SITE_URL } from '@/data/seo';

interface Meta {
  title: string;
  description: string;
  path: string;
}

const setAttr = (selector: string, attr: string, value: string) => {
  const el = document.head.querySelector(selector);
  if (!el) return undefined;
  const previous = el.getAttribute(attr);
  el.setAttribute(attr, value);
  return () => {
    if (previous !== null) el.setAttribute(attr, previous);
  };
};

export function usePageMeta(meta: Meta | null) {
  const title = meta?.title;
  const description = meta?.description;
  const path = meta?.path;

  useEffect(() => {
    if (!title || !description || !path) return;
    const url = `${SITE_URL}${path}`;
    const previousTitle = document.title;
    document.title = title;
    const restores = [
      setAttr('meta[name="description"]', 'content', description),
      setAttr('link[rel="canonical"]', 'href', url),
      setAttr('meta[property="og:url"]', 'content', url),
      setAttr('meta[property="og:title"]', 'content', title),
      setAttr('meta[property="og:description"]', 'content', description),
    ];
    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, [title, description, path]);
}
