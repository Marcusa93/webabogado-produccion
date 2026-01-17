import { useState } from 'react';
import { MessageCircle, Send, Mail, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useToast } from '@/hooks/use-toast';

export default function Contacto() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Mensaje enviado',
      description: 'Te responderé a la brevedad. Gracias por contactarte.',
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Hola Marco, me gustaría agendar una consulta inicial estratégica.'
    );
    window.open(`https://wa.me/5493813007791?text=${message}`, '_blank');
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32 bg-background overflow-hidden font-montserrat">
      {/* Background decoration */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div ref={ref} className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Column: Intake Paragraph & Benefits */}
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Canales Directos</span>
            </div>

            <h2 className="text-[clamp(2rem,5vw,3.75rem)] md:text-5xl lg:text-6xl font-black text-navy-deep mb-8 leading-[1.1]">
              Iniciemos una <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">estrategia ganadora.</span>
            </h2>

            <p className="text-lg md:text-xl text-slate font-medium leading-relaxed mb-12 max-w-xl">
              La consulta inicial estratégica es la base de todo éxito legal. Analizamos el plano fáctico, técnico y jurídico para darte una ruta clara.
            </p>

            {/* Benefits Bullets */}
            <div className="space-y-6 mb-12">
              {[
                { icon: Shield, title: "Confidencialidad Total", desc: "Protocolo de seguridad en comunicaciones." },
                { icon: Clock, title: "Respuesta Ejecutiva", desc: "Feedback en menos de 24 horas hábiles." },
                { icon: Zap, title: "Visión Técnica", desc: "No solo abogados, entendemos tu tecnología." }
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white shadow-soft border border-navy-deep/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 group-hover:scale-110">
                    <benefit.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-navy-deep text-lg">{benefit.title}</h4>
                    <p className="text-slate/60 text-sm font-medium">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="group relative flex items-center gap-4 px-10 py-6 bg-[#25D366] text-white font-black rounded-[2rem] transition-all duration-500 hover:bg-[#20BD5A] hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] hover:-translate-y-1 active:scale-95 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <MessageCircle size={28} className="relative z-10" />
              <div className="relative z-10 text-left">
                <span className="block text-xs opacity-80 uppercase tracking-widest font-bold">Vía Directa</span>
                <span className="text-lg">Contactar por WhatsApp</span>
              </div>
            </button>
          </div>

          {/* Right Column: Form */}
          <div className={`transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[3rem] blur-2xl opacity-10" />

              <form
                onSubmit={handleSubmit}
                className="relative p-10 md:p-14 bg-white rounded-[3rem] border border-navy-deep/5 shadow-strong flex flex-col gap-8 group/form overflow-hidden"
              >
                {/* Visual Indicator */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent scale-x-0 group-hover/form:scale-x-100 transition-transform duration-1000" />

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-navy-deep text-white flex items-center justify-center shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-navy-deep">Envío Seguro</h3>
                    <p className="text-sm text-slate/40 font-bold uppercase tracking-tighter">dr.marcorossi9@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-deep/40 ml-1">Tu Identidad</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="Nombre completo o razón social"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-5 bg-ice-blue/30 border border-navy-deep/5 rounded-2xl text-navy-deep placeholder:text-navy-deep/20 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium invalid:border-red-300"
                      />
                      {formData.name.length > 3 && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in" size={20} />
                      )}
                    </div>
                  </div>

                  {/* Contact Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-deep/40 ml-1">Tu Conexión</label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        placeholder="email@ejemplo.com o teléfono"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-6 py-5 bg-ice-blue/30 border rounded-2xl text-navy-deep placeholder:text-navy-deep/20 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium ${formData.email && !formData.email.includes('@') ? 'border-red-300 focus:border-red-400' : 'border-navy-deep/5'
                          }`}
                      />
                      {formData.email.includes('@') && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in" size={20} />
                      )}
                    </div>
                    {formData.email && !formData.email.includes('@') && (
                      <p className="text-xs text-red-500 ml-2 font-bold animate-in slide-in-from-top-1">Formato de email incorrecto</p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-deep/40 ml-1">Tu Caso</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe tu conflicto en 2-3 líneas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-5 bg-ice-blue/30 border border-navy-deep/5 rounded-2xl text-navy-deep placeholder:text-navy-deep/20 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 py-6 bg-navy-deep text-white font-black rounded-2xl hover:bg-accent transition-all duration-500 shadow-glow disabled:opacity-50 active:scale-[0.98] group/btn mb-4"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="uppercase tracking-[0.2em] text-sm">Ejecutar Envío</span>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Microcopy */}
                    <p className="text-center text-[10px] md:text-xs text-slate/50 font-medium">
                      ⚡ Respuesta en menos de 24hs. <span className="mx-1">·</span> 🔒 Confidencialidad garantizada.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
