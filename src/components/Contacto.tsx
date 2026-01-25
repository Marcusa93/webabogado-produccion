import { useState } from 'react';
import { MessageCircle, Send, Mail, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useToast } from '@/hooks/use-toast';
import { trackContactFormSubmit, trackWhatsAppClick, trackConsultationRequest } from '@/lib/analytics';
import StaggeredTitle from './StaggeredTitle';

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

    // Track form submission
    trackContactFormSubmit('email');
    trackConsultationRequest();

    try {
      const response = await fetch("https://formsubmit.co/ajax/dr.marcorossi9@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Nueva consulta de ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (response.ok) {
        toast({
          title: 'Mensaje enviado con éxito',
          description: 'Gracias por contactarte. Te responderé a la brevedad.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      toast({
        title: 'Error en el envío',
        description: 'Hubo un problema. Por favor intenta por WhatsApp.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    // Track WhatsApp click
    trackWhatsAppClick('contact_section');
    trackConsultationRequest();

    const message = encodeURIComponent(
      'Hola Marco, me gustaría agendar una consulta inicial estratégica.'
    );
    window.open(`https://wa.me/5493813007791?text=${message}`, '_blank');
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32 pb-16 md:pb-24 transition-colors duration-500 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-[0.02]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#577C8E_0%,_transparent_50%)] opacity-5" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div ref={ref} className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Column: Intake Paragraph & Benefits */}
          <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Canales Directos</span>
            </div>

            <StaggeredTitle
              text="Iniciemos una estrategia ganadora."
              highlightWords={['estrategia', 'ganadora.']}
              className="text-[clamp(2rem,5vw,3.75rem)] md:text-5xl lg:text-6xl font-black text-foreground mb-8 leading-[1.1] justify-start text-left"
            />

            <p className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed mb-12 max-w-xl">
              La consulta inicial estratégica es la base de todo éxito legal. Analizamos el plano fáctico, técnico y jurídico para darte una ruta clara.
            </p>

            {/* Benefits Cards - Visual Separation */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                { icon: Shield, title: "Confidencialidad Total", desc: "Protocolo de seguridad en comunicaciones." },
                { icon: Clock, title: "Respuesta Ejecutiva", desc: "Feedback en menos de 24 horas hábiles." },
                { icon: Zap, title: "Visión Técnica", desc: "No solo abogados, entendemos tu tecnología." }
              ].map((benefit, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border-2 border-foreground/10 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500 icon-hover">
                    <benefit.icon size={24} />
                  </div>
                  <h4 className="font-black text-foreground text-base mb-2">{benefit.title}</h4>
                  <p className="text-foreground/60 text-sm font-medium leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="btn-interactive group relative flex items-center gap-4 px-10 py-6 text-white font-black rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] w-full sm:w-auto overflow-hidden"
              style={{
                backgroundColor: 'var(--whatsapp-green)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--whatsapp-green-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--whatsapp-green)'}
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
                className="relative p-10 md:p-14 bg-card rounded-[3rem] border border-foreground/5 shadow-strong flex flex-col gap-8 group/form overflow-hidden"
              >
                {/* Visual Indicator */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent scale-x-0 group-hover/form:scale-x-100 transition-transform duration-1000" />

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground">Envío Seguro</h3>
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-tighter">dr.marcorossi9@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Identidad</label>
                    <div className="relative">
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Nombre completo o razón social"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-5 bg-foreground/5 border-2 border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium invalid:border-red-300"
                      />
                      {formData.name.length > 3 && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in" size={20} />
                      )}
                    </div>
                  </div>

                  {/* Contact Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Conexión</label>
                    <div className="relative">
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="email@ejemplo.com o teléfono"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-6 py-5 bg-foreground/5 border-2 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium ${formData.email && !formData.email.includes('@') ? 'border-red-300 focus:border-red-400' : 'border-foreground/10'
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
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Caso</label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Describe tu conflicto en 2-3 líneas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-5 bg-foreground/5 border-2 border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-interactive w-full flex items-center justify-center gap-3 py-6 bg-foreground text-background font-black rounded-2xl hover:bg-accent hover:text-white transition-all duration-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/btn mb-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="uppercase tracking-[0.2em] text-sm">Enviando...</span>
                        </>
                      ) : (
                        <>
                          <span className="uppercase tracking-[0.2em] text-sm">Ejecutar Envío</span>
                          <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Microcopy */}
                    <p className="text-center text-[10px] md:text-xs text-foreground/60 font-medium">
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
