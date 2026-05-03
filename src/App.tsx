import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import MouseGlow from "./components/MouseGlow";
import ScrollProgress from "./components/ScrollProgress";
import Analytics from "./components/Analytics";

// Index queda eager: es la página de entrada más común y los visitantes
// llegan ahí en la mayoría de los casos. Lazy-loadearla solo agregaría
// flicker innecesario en la home.
import Index from "./pages/Index";

// Resto de las pages: se descargan en chunks separados solo cuando el
// router las pide. Vite genera un .js por cada lazy import, así el bundle
// del home no carga el código de /sobre-mi, /herramientas, COTIO, etc.
const Agendar = lazy(() => import("./pages/Agendar"));
const Herramientas = lazy(() => import("./pages/Herramientas"));
const SobreMi = lazy(() => import("./pages/SobreMi"));
const Cotio = lazy(() => import("./pages/Cotio"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Fallback minimalista para navegaciones a rutas lazy mientras se descarga
// el chunk. Reusa colores de marca y queda invisible si el chunk ya estaba
// en cache (transición instantánea).
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-foreground/10 border-t-accent rounded-full animate-spin" />
      <span className="text-[10px] font-bold tracking-[0.2em] text-foreground/40 uppercase">
        Cargando
      </span>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MouseGlow />
        <ScrollProgress />
        <Analytics />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/agendar" element={<Agendar />} />
                <Route path="/herramientas" element={<Herramientas />} />
                <Route path="/sobre-mi" element={<SobreMi />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                  path="/herramientas/cotio"
                  element={
                    <ProtectedRoute>
                      <Cotio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
