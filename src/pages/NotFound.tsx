import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        {/* Decorative 404 */}
        <div className="relative mb-8">
          <span className="text-[160px] md:text-[200px] font-black text-foreground/5 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 font-montserrat">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La página que buscás no existe o fue movida. Verificá la URL o volvé al inicio.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
