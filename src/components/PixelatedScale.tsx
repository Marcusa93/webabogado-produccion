import React, { useEffect, useRef } from 'react';

// --- CONFIGURATION ---
// --- CONFIGURATION ---
const CONFIG = {
    colors: {
        particle: '#ffffff',
        line: 'rgba(255, 255, 255, 0.1)',
        glow: 'rgba(0, 217, 255, 0.4)', // Reduced glow
        accent: '#00D9FF',
        forbidden: '#FF0000',
        forbiddenGlow: 'rgba(255, 0, 0, 0.4)',
        forbiddenLine: 'rgba(255, 0, 0, 0.1)',
        whatsapp: '#25D366',
        whatsappLine: 'rgba(37, 211, 102, 0.1)'
    },
    particles: {
        count: 80,            // Reduced for background
        connectionRadius: 80,
        baseSize: 2,          // Smaller
        mouseRepel: 150       // Higher interaction
    },
    physics: {
        friction: 0.96,
        spring: 0.03,
        explosionForce: 0.08
    },
    cycle: {
        holdDuration: 8000,
        explodeDuration: 3000,
        shapes: ['scale', 'contract', 'hammer', 'forbidden', 'dna', 'fingerprint', 'whatsapp', 'logo'] as const
    },
    labels: {
        scale: '',
        forbidden: '',
        logo: ''
    }
};

type ShapeType = typeof CONFIG.cycle.shapes[number];

interface Point {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    size: number;
    shapeTargets: Record<ShapeType, { x: number, y: number } | null>;
}

interface PixelatedScaleProps {
    triggerExplosion?: boolean;
}

const PixelatedScale: React.FC<PixelatedScaleProps> = ({ triggerExplosion = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const pointsRef = useRef<Point[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    const cycleRef = useRef({
        index: 0,
        state: 'forming' as 'forming' | 'holding' | 'exploding',
        timer: 0,
        lastTime: 0
    });

    // --- SHAPE GENERATORS ---
    const getShapePoints = (width: number, height: number, type: ShapeType): { x: number, y: number }[] => {
        const pts: { x: number, y: number }[] = [];
        const cx = width / 2;
        const cy = height / 2;
        const scale = Math.min(width, height) / (width < 640 ? 500 : 700);

        const add = (x: number, y: number) => pts.push({ x: cx + x * scale, y: cy + y * scale });

        switch (type) {
            case 'scale':
                for (let y = -200; y <= 250; y += 40) add(0, y);
                for (let x = -250; x <= 250; x += 40) add(x, -180 + Math.abs(x) * 0.05);
                [-250, 250].forEach(ox => {
                    const py = -30;
                    add(ox, py); add(ox, py + 60); add(ox, py + 120);
                    for (let a = 0; a <= Math.PI; a += 0.5) add(ox + Math.cos(a) * 60, py + 120 + Math.sin(a) * 40);
                });
                break;

            case 'contract':
                const pH = 280; const pW = 200;
                for (let x = -pW / 2; x <= pW / 2; x += 30) { add(x, -pH / 2); add(x, pH / 2); }
                for (let y = -pH / 2; y <= pH / 2; y += 30) { add(-pW / 2, y); add(pW / 2, y); }
                for (let y = -pH / 2 + 60; y < 50; y += 45) {
                    for (let x = -pW / 2 + 30; x < pW / 2 - 30; x += 25) add(x, y);
                }
                for (let i = 0; i < 150; i += 20) add(30 + i, 50 - i);
                const sealY = 80; const sealX = 50;
                for (let a = 0; a < Math.PI * 2; a += 0.6) add(sealX + Math.cos(a) * 40, sealY + Math.sin(a) * 40);
                add(sealX, sealY);
                break;

            case 'hammer':
                const yOff = 50;
                for (let y = 0; y <= 300; y += 35) { add(0, y + yOff); add(10, y + yOff); }
                const headW = 120; const headH = 60;
                for (let x = -headW; x <= headW; x += 25) {
                    for (let y = -headH; y <= headH; y += 25) {
                        if (Math.abs(x) > 40 || Math.abs(y) < 20) add(x, y - 20 + yOff);
                    }
                }
                break;

            case 'forbidden':
                const r = 160;
                for (let a = 0; a < Math.PI * 2; a += 0.18) {
                    add(Math.cos(a) * r, Math.sin(a) * r);
                    add(Math.cos(a) * (r - 15), Math.sin(a) * (r - 15));
                }
                // Slash / (Bottom-Left to Top-Right or vice versa)
                // Standard No: Circle + backslash \ (TL to BR) or slash /? 
                // International standard is TL to BR diagonal.
                for (let i = -r + 20; i < r - 20; i += 20) {
                    add(-i, i); // Diagonal top-left (-x, -y) to bottom-right (+x, +y)
                }
                break;

            case 'dna':
                const dnaH = 300;
                for (let y = -dnaH / 2; y <= dnaH / 2; y += 20) {
                    const x1 = Math.sin(y * 0.025) * 60;
                    const x2 = Math.sin(y * 0.025 + Math.PI) * 60;
                    add(x1, y);
                    add(x2, y);
                    if (Math.abs(y % 50) < 10) {
                        const midX = 0;
                        add(midX, y);
                    }
                }
                break;

            case 'fingerprint':
                for (let i = 30; i < 160; i += 25) {
                    for (let a = 0; a < Math.PI * 2; a += 0.25) {
                        const rVar = i + Math.sin(a * 3 + i) * 8;
                        if (Math.random() > 0.15) add(Math.cos(a) * rVar * 0.8, Math.sin(a) * rVar);
                    }
                }
                break;

            case 'whatsapp':
                // Speech Bubble
                const wr = 120;
                for (let a = 0; a < Math.PI * 2; a += 0.18) {
                    // Tail at approx 135 deg (bottom left)
                    if (a > 2.2 && a < 2.5) {
                        add(Math.cos(a) * wr * 1.4, Math.sin(a) * wr * 1.4); // Tail tip
                    } else {
                        add(Math.cos(a) * wr, Math.sin(a) * wr);
                    }
                }
                // Phone
                const pScale = 0.6;
                // Simplified receiver visual
                for (let a = 0.5; a < Math.PI - 0.5; a += 0.2) {
                    // Bow
                    add(Math.cos(a) * wr * pScale, Math.sin(a) * wr * pScale - 20);
                }
                // Ends
                add(-50, 20); add(50, 20);
                break;

            case 'logo':
                const mx = -150; const my = -100; const size = 200;
                for (let y = 0; y <= size; y += 30) add(mx, my + y);
                for (let y = 0; y <= size; y += 30) add(mx + size * 0.8, my + y);
                for (let x = 0; x <= size * 0.4; x += 20) add(mx + x, my + x * 1.5);
                for (let x = 0; x <= size * 0.4; x += 20) add(mx + size * 0.8 - x, my + x * 1.5);
                const rx = 80;
                for (let y = 0; y <= size; y += 30) add(rx, my + y);
                for (let a = -Math.PI / 2; a <= Math.PI / 2; a += 0.4) add(rx + Math.cos(a) * 60, my + 60 + Math.sin(a) * 60);
                for (let x = 0; x <= 60; x += 20) add(rx + x, my);
        }
        return pts;
    };

    const initPoints = (width: number, height: number) => {
        const shapeData: Record<ShapeType, { x: number, y: number }[]> = {} as any;
        CONFIG.cycle.shapes.forEach(shape => {
            shapeData[shape] = getShapePoints(width, height, shape);
        });

        const pts: Point[] = [];
        const count = CONFIG.particles.count;

        for (let i = 0; i < count; i++) {
            const getTarget = (type: ShapeType) => {
                const targets = shapeData[type];
                if (!targets || targets.length === 0) return null;
                return targets[i % targets.length];
            };

            const shapeTargets: Record<ShapeType, { x: number, y: number } | null> = {} as any;
            CONFIG.cycle.shapes.forEach(shape => {
                shapeTargets[shape] = getTarget(shape);
            });

            pts.push({
                x: Math.random() * width,
                y: Math.random() * height,
                targetX: Math.random() * width,
                targetY: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * (CONFIG.particles.baseSize * 1.5 - 2) + 2, // 2-4.5px
                shapeTargets
            });
        }
        return pts;
    };

    const animate = (time: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !canvasRef.current) return;

        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        const dt = time - cycleRef.current.lastTime;
        cycleRef.current.lastTime = time;

        const { state, timer, index } = cycleRef.current;
        const currentShape = CONFIG.cycle.shapes[index];

        // State Machine
        if (state === 'forming') {
            if (timer > 2500) {
                cycleRef.current.state = 'holding';
                cycleRef.current.timer = 0;
            } else {
                cycleRef.current.timer += dt;
            }
        }
        else if (state === 'holding') {
            if (timer > CONFIG.cycle.holdDuration) {
                cycleRef.current.state = 'exploding';
                cycleRef.current.timer = 0;
                pointsRef.current.forEach(pt => {
                    pt.vx += (Math.random() - 0.5) * 7;
                    pt.vy += (Math.random() - 0.5) * 7;
                });
            } else {
                cycleRef.current.timer += dt;
            }
        }
        else if (state === 'exploding') {
            if (timer > CONFIG.cycle.explodeDuration) {
                cycleRef.current.state = 'forming';
                cycleRef.current.timer = 0;
                cycleRef.current.index = (index + 1) % CONFIG.cycle.shapes.length;
            } else {
                cycleRef.current.timer += dt;
            }
        }

        ctx.clearRect(0, 0, width, height);

        // --- COLOR LOGIC ---
        let pColor = CONFIG.colors.particle;
        let lColor = CONFIG.colors.line;

        if (currentShape === 'forbidden') {
            pColor = CONFIG.colors.forbidden;
            lColor = CONFIG.colors.forbiddenLine;
        } else if (currentShape === 'whatsapp') {
            pColor = CONFIG.colors.whatsapp;
            lColor = CONFIG.colors.whatsappLine;
        }

        const isExploding = state === 'exploding';

        // --- OPTIMIZATION: NO SHADOWBLUR ---
        // Using 'lighter' gives a nice additive glow effect without the heavy cost of shadowBlur
        ctx.globalCompositeOperation = 'lighter';

        pointsRef.current.forEach(pt => {
            // Target Logic
            if (!isExploding) {
                const t = pt.shapeTargets[currentShape];
                if (t) {
                    pt.targetX = t.x;
                    pt.targetY = t.y;
                } else {
                    pt.targetX = width / 2 + Math.sin(time * 0.0005 + pt.x) * 150;
                    pt.targetY = height / 2 + Math.cos(time * 0.0003 + pt.y) * 150;
                }
            }

            // Physics
            if (!isExploding) {
                const dx = pt.targetX - pt.x;
                const dy = pt.targetY - pt.y;
                pt.vx += dx * CONFIG.physics.spring;
                pt.vy += dy * CONFIG.physics.spring;
            }

            // Mouse Repulsion
            if (mouseRef.current.x > -500) {
                const mx = mouseRef.current.x - pt.x;
                const my = mouseRef.current.y - pt.y;
                const distSq = mx * mx + my * my;
                if (distSq < CONFIG.particles.mouseRepel * CONFIG.particles.mouseRepel) {
                    const dist = Math.sqrt(distSq);
                    const force = (CONFIG.particles.mouseRepel - dist) / CONFIG.particles.mouseRepel;
                    const ang = Math.atan2(my, mx);
                    pt.vx -= Math.cos(ang) * force * 1.5;
                    pt.vy -= Math.sin(ang) * force * 1.5;
                }
            }

            pt.vx *= (isExploding ? 0.98 : CONFIG.physics.friction);
            pt.vy *= (isExploding ? 0.98 : CONFIG.physics.friction);
            pt.x += pt.vx;
            pt.y += pt.vy;

            // Draw
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pColor;

            let opacity = isExploding ? 0.5 : 0.9;
            if (!pt.shapeTargets[currentShape] && !isExploding) opacity = 0.3;

            ctx.globalAlpha = opacity;
            ctx.fill();
        });

        // --- CONNECTIONS ---
        ctx.strokeStyle = lColor;
        ctx.lineWidth = 0.6;

        const distLimit = 3600; // 60px

        for (let i = 0; i < pointsRef.current.length; i++) {
            const p1 = pointsRef.current[i];
            for (let j = i + 1; j < pointsRef.current.length; j++) {
                const p2 = pointsRef.current[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                if (Math.abs(dx) > 60 || Math.abs(dy) > 60) continue;

                const distSq = dx * dx + dy * dy;
                if (distSq < distLimit) {
                    const alpha = (1 - distSq / distLimit) * (isExploding ? 0.3 : 0.5);
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // --- LABEL ---
        if (!isExploding) {
            const labelText = CONFIG.labels[currentShape] || '';
            if (labelText) {
                let labelOpacity = 0;
                if (state === 'forming') labelOpacity = Math.min(1, cycleRef.current.timer / 2500);
                if (state === 'holding') labelOpacity = 1;

                if (labelOpacity > 0.05) {
                    // Use system font/Inter for brand consistency as requested
                    ctx.font = 'bold 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = CONFIG.colors.accent;
                    ctx.globalAlpha = labelOpacity * 0.8;
                    ctx.globalCompositeOperation = 'source-over';
                    // Spacing

                    ctx.fillText(labelText.split('').join('  '), width / 2, height - 60);
                }
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current;
                canvasRef.current.width = offsetWidth;
                canvasRef.current.height = offsetHeight;
                pointsRef.current = initPoints(offsetWidth, offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const handleInteract = (e: MouseEvent | TouchEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            let clientX, clientY;
            if ('touches' in e) {
                clientX = (e as any).touches[0].clientX;
                clientY = (e as any).touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }
            mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top };
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('mousemove', handleInteract as any);
            containerRef.current.addEventListener('touchmove', handleInteract as any);
            containerRef.current.addEventListener('mouseleave', () => {
                mouseRef.current = { x: -1000, y: -1000 };
            });
        }

        cycleRef.current.lastTime = performance.now();
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Watch for explosion trigger
    useEffect(() => {
        if (triggerExplosion && pointsRef.current.length > 0) {
            // Force explosion
            cycleRef.current.state = 'exploding';
            cycleRef.current.timer = 0;
            pointsRef.current.forEach(pt => {
                pt.vx += (Math.random() - 0.5) * 15; // Stronger explosion
                pt.vy += (Math.random() - 0.5) * 15;
            });
        }
    }, [triggerExplosion]);

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0 pointer-events-auto opacity-100 flex items-center justify-center">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default PixelatedScale;
