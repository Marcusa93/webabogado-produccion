import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, Box } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

export default function Recursos() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="recursos" ref={sectionRef} className="py-40 md:py-48 relative overflow-hidden bg-[#0F0F0F]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0529] to-black opacity-80" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#7B2CBF_0%,_transparent_40%)] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_#00E5FF_0%,_transparent_40%)] opacity-10 pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Featured Card */}
          <div className="bg-[#121212] border-2 border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#7B2CBF]/30 transition-all duration-500 shadow-2xl">

            {/* Glow Effect following mouse */}
            <div
              className="absolute pointer-events-none w-[500px] h-[500px] bg-[#7B2CBF] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                left: mousePos.x - 250,
                top: mousePos.y - 250,
              } as React.CSSProperties}
            />

            <div className="flex flex-col items-center text-center gap-8 relative z-10">

              {/* Logo */}
              <div className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center">
                {/* Decorative Rings */}
                <div className="absolute inset-0 border border-[#7B2CBF]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-[#00E5FF]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                {/* Logo Image */}
                <OptimizedImage
                  src="/ready-lawyer-one.jpg"
                  alt="Ready Lawyer One Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(123,44,191,0.6)] rounded-full hover:drop-shadow-[0_0_35px_rgba(0,229,255,0.4)] transition-all duration-500"
                  width={160}
                  height={160}
                  blurPlaceholder={false}
                />
              </div>

              {/* Content */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2CBF]/10 border border-[#7B2CBF]/20 mb-4 backdrop-blur-md">
                  <Box size={14} className="text-[#00E5FF]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#00E5FF] uppercase shadow-[#00E5FF]/20 drop-shadow-sm">Tech & Law Innovation</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight font-montserrat tracking-tight">
                  Ready Lawyer One
                </h2>
                <h3 className="text-base md:text-lg text-[#7B2CBF] font-bold mb-4 font-mono tracking-wide">
                  Fundador y Miembro de la Comunidad
                </h3>

                <p className="text-[#F0F0F0] text-base md:text-lg leading-relaxed mb-8 font-medium">
                  Formación especializada y herramientas tech para la nueva generación de abogados.
                </p>

                {/* Secondary Button Style */}
                <a
                  href="https://readylawyer1.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-[#7B2CBF] hover:bg-[#7B2CBF] hover:border-[#9D4EDD] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(123,44,191,0.2)] hover:shadow-[0_0_30px_rgba(123,44,191,0.5)] group/btn"
                >
                  <span>Conocer Ready Lawyer One</span>
                  <ExternalLink size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
