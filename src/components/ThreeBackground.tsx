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

        // Particles
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#3b82f6',
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 3;

        // Interaction State
        const mouse = { x: 0, y: 0 }; // Target position
        const smoothedMouse = { x: 0, y: 0 }; // Interpolated position

        // Lerp factor (0.05 = very smooth/slow, 0.1 = faster)
        const lerpFactor = 0.05;

        const animate = () => {
            requestAnimationFrame(animate);

            // 1. Calculate smoothing (Lerp)
            smoothedMouse.x += (mouse.x - smoothedMouse.x) * lerpFactor;
            smoothedMouse.y += (mouse.y - smoothedMouse.y) * lerpFactor;

            // 2. Constants rotation
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.0005;

            // 3. Apply smoothed position to mesh (Parallax effect)
            particlesMesh.rotation.x += -smoothedMouse.y * 0.1;
            particlesMesh.rotation.y += smoothedMouse.x * 0.1;

            // Optional: Move the mesh slightly for depth
            particlesMesh.position.x = smoothedMouse.x * 0.2;
            particlesMesh.position.y = -smoothedMouse.y * 0.2;

            renderer.render(scene, camera);
        };

        // Event Handlers
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize to -1 to 1
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

        window.addEventListener('mousemove', handleMouseMove);
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
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default THREE ? ThreeBackground : () => null;
