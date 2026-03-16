import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Detect if device handles hover (desktop)
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                // Use transform directly for better performance than state
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer') ||
                target.classList.contains('btn-interactive')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Global style to hide default cursor - careful with this, 
                usually better applied to specific interactive areas or just body 
                if we are confident strictly on desktop. 
                For safety, we just hide usage cursor on body via CSS class usually, 
                but we can start by just having this follow strictly. 
            */}
            <style>{`
                @media (pointer: fine) {
                    body {
                        cursor: none;
                    }
                    a, button, [role="button"] {
                        cursor: none;
                    }
                }
            `}</style>

            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-75 ease-out will-change-transform mix-blend-difference`}
                style={{ marginLeft: -12, marginTop: -12 }} // Center the cursor (w-6/2)
            >
                <div
                    className={`
                        relative flex items-center justify-center rounded-full transition-all duration-300 ease-out border-2 border-white
                        ${isHovering ? 'w-14 h-14 bg-white/20 scale-110' : 'w-8 h-8 bg-transparent'}
                    `}
                >
                    <div
                        className={`
                            rounded-full bg-white transition-all duration-300
                            ${isHovering ? 'w-3 h-3' : 'w-2 h-2'}
                        `}
                    />
                </div>
            </div>
        </>
    );
}
