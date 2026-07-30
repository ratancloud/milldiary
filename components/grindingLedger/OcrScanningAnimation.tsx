import React, { useEffect, useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";

export default function OcrScanningAnimation({ imageSrc }: { imageSrc: string | null }) {
    const [scanProgress, setScanProgress] = useState(0);
    const [statusText, setStatusText] = useState("Preparing image...");

    useEffect(() => {
        const steps = [
            { at: 5, text: "Enhancing image contrast..." },
            { at: 15, text: "Detecting handwritten text regions..." },
            { at: 30, text: "Reading customer names..." },
            { at: 45, text: "Identifying village abbreviations..." },
            { at: 60, text: "Extracting weight values..." },
            { at: 75, text: "Mapping villages to master list..." },
            { at: 88, text: "Validating extracted data..." },
            { at: 95, text: "Finalizing JSON output..." },
        ];

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                const next = Math.min(prev + 0.6 + Math.random() * 0.8, 98);
                const step = steps.findLast((s) => s.at <= next);
                if (step) setStatusText(step.text);
                return next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-8 px-4 max-w-md mx-auto w-full">
            {/* Animated scanner container */}
            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 bg-muted/30">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Scanning..."
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-muted/40 to-muted/80 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                )}

                {/* Scanning line effect */}
                <div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-lg shadow-amber-500/60"
                    style={{
                        top: `${scanProgress}%`,
                        transition: "top 0.1s linear",
                    }}
                />

                {/* Glow overlay above scan line */}
                <div
                    className="absolute left-0 right-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"
                    style={{
                        top: 0,
                        height: `${scanProgress}%`,
                        transition: "height 0.1s linear",
                    }}
                />

                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-500 rounded-tl-md" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-500 rounded-tr-md" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-500 rounded-bl-md" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-500 rounded-br-md" />

                {/* Floating detected text lines (fake OCR detections) */}
                <div className="absolute inset-0 pointer-events-none">
                    {scanProgress > 20 && (
                        <div className="absolute top-[18%] left-[10%] right-[15%] h-3 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse" />
                    )}
                    {scanProgress > 35 && (
                        <div className="absolute top-[30%] left-[8%] right-[20%] h-3 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse" style={{ animationDelay: "0.3s" }} />
                    )}
                    {scanProgress > 50 && (
                        <div className="absolute top-[44%] left-[12%] right-[10%] h-3 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse" style={{ animationDelay: "0.6s" }} />
                    )}
                    {scanProgress > 65 && (
                        <div className="absolute top-[58%] left-[9%] right-[18%] h-3 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse" style={{ animationDelay: "0.9s" }} />
                    )}
                    {scanProgress > 80 && (
                        <div className="absolute top-[72%] left-[11%] right-[14%] h-3 rounded bg-amber-500/15 border border-amber-500/30 animate-pulse" style={{ animationDelay: "1.2s" }} />
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[280px] space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${scanProgress}%` }}
                    />
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                        {statusText}
                    </span>
                    <span className="font-mono font-bold text-amber-600 tabular-nums">
                        {Math.round(scanProgress)}%
                    </span>
                </div>
            </div>

            {/* Pulsing Gemini branding */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Gemini AI is analyzing your handwriting...
                </span>
            </div>
        </div>
    );
};