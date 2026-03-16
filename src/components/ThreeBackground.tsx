import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        camera.position.z = 3;

        // Config
        const particlesCount = 400; // Optimized for N^2 connections
        const connectionDistance = 0.8;
        const mouseInfluenceRadius = 2.0;

        // Arrays
        const positions = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount * 3);

        // Initialize particles
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5; // Shallower depth

            velocities[i * 3] = (Math.random() - 0.5) * 0.005;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Material for Dots
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: '#FF4444', // Red Pulse
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lines Geometry (Dynamic)
        const linesGeometry = new THREE.BufferGeometry();
        const linesMaterial = new THREE.LineBasicMaterial({
            color: '#CC0000', // Darker red lines
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
        scene.add(linesMesh);

        // Mouse State
        const mouse = { x: 0, y: 0 };
        const attractor = { x: 0, y: 0 }; // Lerped position
        const lerpFactor = 0.1; // Smooth following

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Lerp Attractor
            attractor.x += (mouse.x - attractor.x) * lerpFactor;
            attractor.y += (mouse.y - attractor.y) * lerpFactor;

            // Constrain attractor on mobile
            const isMobile = window.innerWidth < 768;
            const limit = isMobile ? 3.0 : 5.0; // Viewport units approx
            const attractorX = Math.max(-limit, Math.min(limit, attractor.x * 5));
            const attractorY = Math.max(-limit, Math.min(limit, attractor.y * 5));

            const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
            const posArray = posAttr.array as Float32Array;

            // Update Particles
            for (let i = 0; i < particlesCount; i++) {
                const ix = i * 3;

                // 1. Basic Velocity Movement
                posArray[ix] += velocities[ix];
                posArray[ix + 1] += velocities[ix + 1];
                posArray[ix + 2] += velocities[ix + 2];

                // 2. Wrap around edges (Screen Loop)
                if (posArray[ix] > 5) posArray[ix] = -5;
                if (posArray[ix] < -5) posArray[ix] = 5;
                if (posArray[ix + 1] > 3) posArray[ix + 1] = -3;
                if (posArray[ix + 1] < -3) posArray[ix + 1] = 3;

                // 3. Attractor Influence (Mouse)
                // Calculate distance to attractor
                const dx = attractorX - posArray[ix];
                const dy = -attractorY - posArray[ix + 1]; // Invert Y
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseInfluenceRadius) {
                    const force = (mouseInfluenceRadius - dist) * 0.005;
                    posArray[ix] += dx * force;
                    posArray[ix + 1] += dy * force;
                }
            }

            posAttr.needsUpdate = true;

            // Update Lines (Constellations)
            const linePositions: number[] = [];
            // O(N^2) / 2 Check
            for (let i = 0; i < particlesCount; i++) {
                for (let j = i + 1; j < particlesCount; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3];
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < connectionDistance) {
                        // Alpha based on distance? (Not easily in basic line mat, but visually ok)
                        linePositions.push(
                            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
                        );
                    }
                }
            }

            linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));


            renderer.render(scene, camera);
        };

        // Event Handlers
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                mouse.y = (touch.clientY / window.innerHeight) * 2 - 1;
            }
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('resize', handleResize);

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            linesGeometry.dispose();
            linesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />;
};

export default ThreeBackground;
