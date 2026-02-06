import React, { useState, useRef } from 'react';
import { Copy, Check, FileText, Upload, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
// @ts-ignore
import Hashes from 'jshashes';
import { toast } from 'sonner';
import { useActivityTracker, logActivity } from '@/hooks/useActivityTracker';

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function Hasher() {
    useActivityTracker('hasheador');

    const [text, setText] = useState('');
    const [textAlgo, setTextAlgo] = useState<Algorithm>('SHA-256');
    const [textHash, setTextHash] = useState('');

    const [file, setFile] = useState<File | null>(null);
    const [fileAlgo, setFileAlgo] = useState<Algorithm>('SHA-256');
    const [fileHash, setFileHash] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const bufToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const hashText = async () => {
        if (!text.trim()) {
            toast.error("Por favor, ingresá algún texto.");
            return;
        }

        try {
            if (textAlgo === 'SHA-256' || textAlgo === 'SHA-512') {
                const encoder = new TextEncoder();
                const data = encoder.encode(text);
                const hashBuffer = await crypto.subtle.digest(textAlgo, data);
                setTextHash(bufToHex(hashBuffer));
            } else if (textAlgo === 'MD5') {
                setTextHash(new Hashes.MD5().hex(text));
            } else if (textAlgo === 'SHA-1') {
                setTextHash(new Hashes.SHA1().hex(text));
            }
            toast.success("Hash de texto generado.");
            logActivity({ action: 'tool_use', toolName: 'hasheador', metadata: { type: 'text', algorithm: textAlgo } });
        } catch (err) {
            console.error(err);
            toast.error("Error al generar el hash.");
        }
    };

    const hashFile = async () => {
        if (!file) {
            toast.error("Por favor, seleccioná un archivo.");
            return;
        }

        setIsCalculating(true);
        setFileHash('');

        try {
            const arrayBuffer = await file.arrayBuffer();

            if (fileAlgo === 'SHA-256' || fileAlgo === 'SHA-512' || fileAlgo === 'SHA-1') {
                // Web Crypto supports SHA-1 as well
                const hashBuffer = await crypto.subtle.digest(fileAlgo, arrayBuffer);
                setFileHash(bufToHex(hashBuffer));
            } else if (fileAlgo === 'MD5') {
                // jshashes for MD5 on binary might need different handling, 
                // but jshashes hex() usually takes string. 
                // For MD5 binary, we'd need another approach if jshashes doesn't support words.
                // However, requirement says "MD5 y SHA-1 usá jshashes".
                const binaryString = new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "");
                setFileHash(new Hashes.MD5().hex(binaryString));
            }
            toast.success("Hash de archivo generado.");
            logActivity({ action: 'tool_use', toolName: 'hasheador', metadata: { type: 'file', algorithm: fileAlgo, fileName: file.name } });
        } catch (err) {
            console.error(err);
            toast.error("Error al procesar el archivo.");
        } finally {
            setIsCalculating(false);
        }
    };

    const copyToClipboard = (hash: string) => {
        if (!hash) return;
        navigator.clipboard.writeText(hash);
        toast.success("Copiado al portapapeles");
    };

    const downloadReport = (type: 'text' | 'file') => {
        const val = type === 'text' ? textHash : fileHash;
        const algo = type === 'text' ? textAlgo : fileAlgo;
        const name = type === 'text' ? 'Texto_Ingresado' : file?.name;

        if (!val) return;

        const date = new Date().toLocaleString('es-AR');
        const content = `
ESTUDIO JURÍDICO DR. MARCO ROSSI - REPORTE DE INTEGRIDAD DIGITAL
==============================================================
Fecha y Hora: ${date}
Origen: Kit de Herramientas Digitales (Local Browser-Side)

DETALLES DEL OBJETO:
-------------------
Tipo: ${type === 'text' ? 'Contenido de Texto' : 'Archivo Digital'}
Identificador: ${name}
Algoritmo Utilizado: ${algo}

VALOR HASH (HUELLA DIGITAL):
---------------------------
${val}

NOTA TÉCNICO-LEGAL:
------------------
El valor hash (digest) funciona como el ADN digital del objeto. Cualquier
modificación mínima, incluso un solo bit, cambiará este valor por completo.

Este reporte certifica que, al momento de la generación, el objeto identificado
posee la huella digital arriba mencionada. Para una preservación con validez
forense internacional, se recomienda la intervención de un perito o la 
certificación ante escribano público.

--------------------------------------------------------------
dr.marcorossi9@gmail.com | Tucumán, Argentina
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reporte_Integridad_${name?.replace(/[^a-z0-9]/gi, '_')}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Reporte descargado correctamente.");
    };

    return (
        <div className="w-full space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Text Hashing Block */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-accent" size={20} />
                        <h5 className="font-bold text-lg text-foreground uppercase tracking-tight">Hashear Texto</h5>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest pl-1">Introduce el texto</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Pegá o escribí tu texto aquí..."
                                className="w-full h-32 bg-foreground/5 border border-foreground/10 rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all resize-none font-mono text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[150px] space-y-2">
                                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest pl-1">Algoritmo</label>
                                <select
                                    value={textAlgo}
                                    onChange={(e) => setTextAlgo(e.target.value as Algorithm)}
                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-3 text-foreground focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer font-bold text-sm"
                                >
                                    <option value="SHA-256">SHA-256 (Recomendado)</option>
                                    <option value="SHA-512">SHA-512</option>
                                    <option value="SHA-1">SHA-1</option>
                                    <option value="MD5">MD5</option>
                                </select>
                            </div>
                            <button
                                onClick={hashText}
                                className="px-6 py-3.5 bg-accent text-white font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-glow transition-all active:scale-95"
                            >
                                Generar Hash
                            </button>
                        </div>

                        {textHash && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">Resultado Hexadecimal:</span>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => copyToClipboard(textHash)}
                                            className="text-foreground/40 hover:text-accent transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Copy size={12} /> Copiar
                                        </button>
                                        <button
                                            onClick={() => downloadReport('text')}
                                            className="text-foreground/40 hover:text-accent transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Upload size={12} className="rotate-180" /> Reporte
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 break-all font-mono text-sm text-foreground/80 relative">
                                    {textHash}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* File Hashing Block */}
                <div className="space-y-6 lg:border-l border-foreground/5 lg:pl-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Upload className="text-accent" size={20} />
                        <h5 className="font-bold text-lg text-foreground uppercase tracking-tight">Hashear Archivo</h5>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest pl-1">Cargar documento</label>
                            <label className={`
                                group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
                                ${file ? 'border-accent bg-accent/5' : 'border-foreground/10 h-32 hover:border-accent hover:bg-foreground/5'}
                            `}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {file ? (
                                        <div className="text-center px-4">
                                            <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                                            <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-[10px] text-foreground/40 uppercase font-black mt-1">Archivo Listo</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-foreground/20 group-hover:text-accent group-hover:scale-110 transition-all mb-2" />
                                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Arrastrá aquí o hacé clic</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </label>
                        </div>

                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[150px] space-y-2">
                                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest pl-1">Algoritmo</label>
                                <select
                                    value={fileAlgo}
                                    onChange={(e) => setFileAlgo(e.target.value as Algorithm)}
                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-3 text-foreground focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer font-bold text-sm"
                                >
                                    <option value="SHA-256">SHA-256 (Máxima Seguridad)</option>
                                    <option value="SHA-512">SHA-512</option>
                                    <option value="SHA-1">SHA-1</option>
                                </select>
                            </div>
                            <button
                                onClick={hashFile}
                                disabled={isCalculating}
                                className="px-6 py-3.5 bg-accent text-white font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isCalculating ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Calculando...
                                    </>
                                ) : "Generar Hash del Archivo"}
                            </button>
                        </div>

                        {fileHash && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">Hash del Archivo:</span>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => copyToClipboard(fileHash)}
                                            className="text-foreground/40 hover:text-accent transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Copy size={12} /> Copiar
                                        </button>
                                        <button
                                            onClick={() => downloadReport('file')}
                                            className="text-foreground/40 hover:text-accent transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Upload size={12} className="rotate-180" /> Reporte
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4 break-all font-mono text-sm text-foreground/80 relative">
                                    {fileHash}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer & Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-accent/5 border border-accent/10 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Privacidad Garantizada</p>
                        <p className="text-xs text-foreground/50 leading-relaxed">
                            Procesamiento **100% local**. Tus datos no viajan por internet. Ideal para documentos confidenciales.
                        </p>
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-foreground/5 border border-foreground/10 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground/40 shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Uso Forense</p>
                        <p className="text-xs text-foreground/50 leading-relaxed">
                            Para que esta prueba sea invulnerable en juicio, se recomienda registrar el hash ante un Escribano o mediante un Perito Informático.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
