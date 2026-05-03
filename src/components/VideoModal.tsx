import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getYouTubeVideoId, type MultimediaItem } from '@/data/multimedia';

type VideoModalProps = {
  video: MultimediaItem;
  onClose: () => void;
};

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const videoId = video.url ? getYouTubeVideoId(video.url) : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar video"
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
        >
          <X size={24} />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-6 bg-[#01101E] border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-black uppercase tracking-wider py-1 px-2 rounded-md text-white ${
                video.badgeColor || 'bg-blue-600'
              }`}
            >
              {video.source}
            </span>
            {video.date && <span className="text-sm text-white/60">{video.date}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
