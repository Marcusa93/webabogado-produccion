import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle, Send, Mail, Clock, CheckCircle, Shield, Zap, AlertCircle } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useToast } from '@/hooks/use-toast';
import { trackContactFormSubmit, trackWhatsAppClick, trackConsultationRequest } from '@/lib/analytics';
import { contactSchema, type ContactInput } from '@/lib/contactSchema';
import BookingButton from './BookingButton';
import StaggeredTitle from './StaggeredTitle';

const SUBMIT_COOLDOWN_MS = 15_000;
const SUCCESS_RESET_MS = 6_000;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function Contacto() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { toast } = useToast();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [topError, setTopError] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { nombre: '', email: '', telefono: '', mensaje: '', website: '' },
  });

  const watchedNombre = watch('nombre') || '';
  const watchedEmail = watch('email') || '';

  const onSubmit = async (data: ContactInput) => {
    // Cooldown anti-spam (defensa en profundidad además del rate limit del server)
    const now = Date.now();
    const elapsed = now - lastSubmitRef.current;
    if (lastSubmitRef.current > 0 && elapsed < SUBMIT_COOLDOWN_MS) {
      const waitSec = Math.ceil((SUBMIT_COOLDOWN_MS - elapsed) / 1000);
      toast({
        title: 'Esperá un momento',
        description: `Para evitar duplicados, podés volver a enviar en ${waitSec}s.`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitState('submitting');
    setTopError(null);
    lastSubmitRef.current = now;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await response.json().catch(() => ({}));

      if (response.ok && json?.ok) {
        // Track solo en éxito real
        trackContactFormSubmit('email');
        trackConsultationRequest();

        setSubmitState('success');
        reset();
        toast({
          title: 'Mensaje enviado',
          description: 'Te respondo en menos de 24hs hábiles.',
        });

        window.setTimeout(() => {
          setSubmitState((prev) => (prev === 'success' ? 'idle' : prev));
        }, SUCCESS_RESET_MS);
        return;
      }

      // Error con detalle del server
      const detail =
        json?.error === 'validation' && Array.isArray(json?.issues) && json.issues[0]?.message
          ? json.issues[0].message
          : json?.error || 'Hubo un problema. Probá de nuevo o escribime por WhatsApp.';

      console.error('[contact] Server returned error:', { status: response.status, json });

      setSubmitState('error');
      setTopError(detail);
      toast({
        title: 'No se pudo enviar',
        description: detail,
        variant: 'destructive',
      });
    } catch (error: unknown) {
      console.error('[contact] Network/fetch error:', error);
      setSubmitState('error');
      setTopError('Error de red. Probá de nuevo o escribime por WhatsApp.');
      toast({
        title: 'Error de red',
        description: 'No pudimos contactar al servidor. Probá por WhatsApp.',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsApp = () => {
    trackWhatsAppClick('contact_section');
    trackConsultationRequest();
    const message = encodeURIComponent(
      'Hola Marco, me gustaría agendar una consulta inicial estratégica.'
    );
    window.open(`https://wa.me/5493813007791?text=${message}`, '_blank');
  };

  const isSubmitting = submitState === 'submitting';
  const isSuccess = submitState === 'success';

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

            {/* Primary CTA — Agendar consulta (Cal.com) */}
            <div className="flex flex-col gap-3 mb-5">
              <BookingButton
                source="contacto"
                label="Reservar diagnóstico gratuito · 30 min"
                variant="primary"
                className="btn-interactive group relative flex items-center justify-center gap-4 px-10 py-6 bg-foreground text-background font-black rounded-[2rem] transition-all duration-500 hover:bg-accent hover:text-white hover:shadow-[0_20px_40px_rgba(10,25,41,0.3)] w-full sm:w-auto"
                icon={true}
              />
              <p className="text-xs text-foreground/55 font-medium ml-1">
                Sin compromiso · Confirmás antes de avanzar · Te llega link de Meet por mail
              </p>
            </div>

            {/* Secondary CTA — WhatsApp como acción rápida (no peer del booking) */}
            <button
              onClick={handleWhatsApp}
              className="group inline-flex items-center gap-2.5 text-sm md:text-base font-bold text-foreground/70 hover:text-[var(--whatsapp-green)] transition-colors py-2"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full transition-colors" style={{ backgroundColor: 'var(--whatsapp-green)' }}>
                <MessageCircle size={18} className="text-white fill-white" />
              </span>
              <span>¿Pregunta rápida? Escribime por WhatsApp →</span>
            </button>
          </div>

          {/* Right Column: Form */}
          <div className={`transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[3rem] blur-2xl opacity-10" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
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
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-tighter">Confidencial · Respuesta directa</p>
                  </div>
                </div>

                {/* Top-level error banner */}
                {topError && submitState === 'error' && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
                    <div className="flex-1 text-sm text-red-700 dark:text-red-300 font-medium">
                      {topError}
                    </div>
                  </div>
                )}

                {/* Honeypot — invisible, anti-bot */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
                  <label htmlFor="contact-website">No completes este campo</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                <div className="space-y-6">
                  {/* Nombre */}
                  <div className="space-y-2 group">
                    <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Identidad</label>
                    <div className="relative">
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Nombre completo o razón social"
                        aria-invalid={!!errors.nombre}
                        aria-describedby={errors.nombre ? 'contact-name-error' : undefined}
                        disabled={isSubmitting || isSuccess}
                        className={`w-full px-6 py-5 bg-foreground/5 border-2 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          errors.nombre ? 'border-red-300 focus:border-red-400' : 'border-foreground/10'
                        }`}
                        {...register('nombre')}
                      />
                      {!errors.nombre && watchedNombre.length >= 2 && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in" size={20} />
                      )}
                    </div>
                    {errors.nombre && (
                      <p id="contact-name-error" className="text-xs text-red-500 ml-2 font-bold animate-in slide-in-from-top-1">
                        {errors.nombre.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Email</label>
                    <div className="relative">
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="email@ejemplo.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        disabled={isSubmitting || isSuccess}
                        autoComplete="email"
                        className={`w-full px-6 py-5 bg-foreground/5 border-2 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          errors.email ? 'border-red-300 focus:border-red-400' : 'border-foreground/10'
                        }`}
                        {...register('email')}
                      />
                      {!errors.email && watchedEmail.includes('@') && watchedEmail.includes('.') && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in" size={20} />
                      )}
                    </div>
                    {errors.email && (
                      <p id="contact-email-error" className="text-xs text-red-500 ml-2 font-bold animate-in slide-in-from-top-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Teléfono (opcional) */}
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">
                      Teléfono <span className="text-foreground/30">(opcional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+54 9 381 ..."
                      aria-invalid={!!errors.telefono}
                      aria-describedby={errors.telefono ? 'contact-phone-error' : undefined}
                      disabled={isSubmitting || isSuccess}
                      autoComplete="tel"
                      className={`w-full px-6 py-5 bg-foreground/5 border-2 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.telefono ? 'border-red-300 focus:border-red-400' : 'border-foreground/10'
                      }`}
                      {...register('telefono')}
                    />
                    {errors.telefono && (
                      <p id="contact-phone-error" className="text-xs text-red-500 ml-2 font-bold animate-in slide-in-from-top-1">
                        {errors.telefono.message}
                      </p>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1">Tu Caso</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Describe tu conflicto en 2-3 líneas..."
                      aria-invalid={!!errors.mensaje}
                      aria-describedby={errors.mensaje ? 'contact-message-error' : undefined}
                      disabled={isSubmitting || isSuccess}
                      className={`w-full px-6 py-5 bg-foreground/5 border-2 rounded-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-medium resize-none disabled:opacity-60 disabled:cursor-not-allowed ${
                        errors.mensaje ? 'border-red-300 focus:border-red-400' : 'border-foreground/10'
                      }`}
                      {...register('mensaje')}
                    />
                    {errors.mensaje && (
                      <p id="contact-message-error" className="text-xs text-red-500 ml-2 font-bold animate-in slide-in-from-top-1">
                        {errors.mensaje.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`btn-interactive w-full flex items-center justify-center gap-3 py-6 font-black rounded-2xl transition-all duration-500 shadow-lg disabled:cursor-not-allowed group/btn mb-4 ${
                        isSuccess
                          ? 'bg-green-600 text-white'
                          : 'bg-foreground text-background hover:bg-accent hover:text-white disabled:opacity-50'
                      }`}
                    >
                      {isSubmitting && (
                        <>
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="uppercase tracking-[0.2em] text-sm">Enviando...</span>
                        </>
                      )}
                      {isSuccess && (
                        <>
                          <CheckCircle size={20} />
                          <span className="uppercase tracking-[0.2em] text-sm">Mensaje enviado</span>
                        </>
                      )}
                      {!isSubmitting && !isSuccess && (
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
