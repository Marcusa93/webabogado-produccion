import React from 'react';
import { useInView } from '@/hooks/useInView';

interface StaggeredTitleProps {
    text: string;
    className?: string;
    wordClassName?: string;
    highlightWords?: string[]; // Words to highlight in accent color
}

export default function StaggeredTitle({ text, className = "", wordClassName = "", highlightWords = [] }: StaggeredTitleProps) {
    const { ref, isInView } = useInView({ threshold: 0.2 });

    return (
        <h2 ref={ref} className={`flex flex-wrap gap-x-3 justify-center md:justify-start ${className}`}>
            {text.split(" ").map((word, i) => {
                // Check if word should be highlighted (stripped of punctuation for check)
                const cleanWord = word.replace(/[,.]/g, '');
                const isHighlighted = highlightWords.includes(cleanWord);

                return (
                    <span
                        key={i}
                        className={`inline-block transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: `${100 + (i * 50)}ms` }}
                    >
                        {isHighlighted ? (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">{word}</span>
                        ) : (
                            <span className={wordClassName}>{word}</span>
                        )}
                    </span>
                );
            })}
        </h2>
    );
}
