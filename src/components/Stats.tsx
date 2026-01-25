import { useRef, useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

const stats = [
    { number: 8, suffix: '+', label: "Años de Experiencia Judicial" },
    { number: 100, suffix: '%', label: "Enfoque Digital & Tech" },
    { number: 50, suffix: '+', label: "Casos Complejos Resueltos" }, // Placeholder estimate
    { number: 24, suffix: 'h', label: "Tiempo de Respuesta Promedio" }
];

const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const { ref, isInView } = useInView({ threshold: 0.5 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
            let startTime: number;
            let animationFrame: number;

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);

                // Ease out function
                const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

                setCount(Math.floor(easeOutQuart * end));

                if (progress < duration) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };

            animationFrame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrame);
        }
    }, [isInView, end, duration, hasAnimated]);

    return <span ref={ref}>{count}</span>;
};

export default function Stats() {
    return (
        <section className="py-12 border-y border-foreground/5 bg-foreground/5 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 mb-2 font-montserrat flex items-center">
                                <Counter end={stat.number} />
                                <span className="text-accent text-3xl md:text-4xl ml-1">{stat.suffix}</span>
                            </div>
                            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/60 group-hover:text-accent transition-colors max-w-[150px]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
