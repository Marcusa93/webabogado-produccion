import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', updateScrollProgress);
        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-accent via-navy-light to-accent transition-all duration-150 ease-out shadow-glow"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}
