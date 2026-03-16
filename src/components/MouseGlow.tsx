import React, { useEffect, useRef, useState } from 'react';

export default function MouseGlow() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisibleRef.current) {
                isVisibleRef.current = true;
                setIsVisible(true);
            }
        };

        const handleMouseLeave = () => {
            isVisibleRef.current = false;
            setIsVisible(false);
        };
        const handleMouseEnter = () => {
            isVisibleRef.current = true;
            setIsVisible(true);
        };

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 pointer-events-none"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--mouse-glow-rgb, 120, 160, 255), 0.08), transparent 80%)`,
            }}
        />
    );
}
