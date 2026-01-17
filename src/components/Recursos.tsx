import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Box } from 'lucide-react';

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
    <section id="recursos" ref={sectionRef} className="py-32 md:py-40 relative overflow-hidden bg-[#0F0F0F]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0529] to-black opacity-80" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#7B2CBF_0%,_transparent_40%)] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_#00E5FF_0%,_transparent_40%)] opacity-10 pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group hover:border-[#7B2CBF]/30 transition-colors duration-500 shadow-2xl">

            {/* Glow Effect following mouse */}
            <div
              className="absolute pointer-events-none w-[500px] h-[500px] bg-[#7B2CBF] rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                left: mousePos.x - 250,
                top: mousePos.y - 250,
              } as React.CSSProperties}
            />

            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 relative z-10">

              {/* Logo Column */}
              <div className="flex-shrink-0 relative">
                <div className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center p-4">
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 border border-[#7B2CBF]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 border border-[#00E5FF]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                  {/* Logo Image */}
                  <img
                    src="/ready-lawyer-one.jpg"
                    alt="Ready Lawyer One Logo"
                    className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(123,44,191,0.6)] rounded-full hover:drop-shadow-[0_0_35px_rgba(0,229,255,0.4)] transition-all duration-500"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2CBF]/10 border border-[#7B2CBF]/20 mb-6 backdrop-blur-md">
                  <Box size={14} className="text-[#00E5FF]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#00E5FF] uppercase shadow-[#00E5FF]/20 drop-shadow-sm">Tech & Law Innovation</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight font-montserrat tracking-tight">
                  Ready Lawyer One
                </h2>
                <h3 className="text-lg md:text-xl text-[#7B2CBF] font-bold mb-6 font-mono tracking-wide">
                  Fundador y Miembro de la Comunidad
                </h3>

                <p className="text-[#F0F0F0] text-lg leading-relaxed mb-10 max-w-xl mx-auto md:mx-0 font-medium">
                  Formación especializada y herramientas tech para la nueva generación de abogados.
                </p>

                <a
                  href="https://readylawyer1.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#7B2CBF] text-white font-bold rounded-xl hover:bg-[#9D4EDD] hover:brightness-110 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(123,44,191,0.3)] hover:shadow-[0_0_30px_rgba(123,44,191,0.6)] group/btn"
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
