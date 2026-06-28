"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, X } from "lucide-react";

interface Props {
  /** Called in real-time as speech is transcribed; also called with final text on end */
  onResult: (text: string) => void;
}

type Phase = "idle" | "listening" | "done";

export function VoiceSearch({ onResult }: Props) {
  const [supported, setSupported] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setPhase("idle");
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition: any = new SR();
    recognition.lang = "tr-TR";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setPhase("listening");
      setTranscript("");
      setErrorMsg(null);
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interim += event.results[i][0].transcript;
      }
      setTranscript(interim);
      onResult(interim);
    };

    recognition.onerror = (event: any) => {
      const msgs: Record<string, string> = {
        "not-allowed": "Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarınızı kontrol edin.",
        "no-speech": "Ses algılanamadı. Lütfen tekrar deneyin.",
        "audio-capture": "Mikrofon bulunamadı.",
        "network": "Ağ hatası oluştu.",
      };
      setErrorMsg(msgs[event.error] ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
      setPhase("idle");
    };

    recognition.onend = () => {
      setPhase((prev) => (prev === "listening" ? "done" : "idle"));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [supported, onResult]);

  // Escape closes the overlay
  useEffect(() => {
    if (phase === "idle") return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") stop(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, stop]);

  if (!supported) return null;

  const isActive = phase !== "idle";

  return (
    <>
      {/* Button inside search bar */}
      <button
        onMouseDown={(e) => {
          e.preventDefault(); // prevent input blur
          isActive ? stop() : start();
        }}
        title={isActive ? "Dinlemeyi durdur" : "Sesli arama"}
        className={`relative flex-shrink-0 p-2 transition-colors ${
          isActive ? "text-[#FF0036]" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        {isActive && (
          <span className="absolute inset-0 rounded-full bg-[#FF0036]/10 animate-ping" />
        )}
        <Mic size={16} />
      </button>

      {/* Full-screen listening overlay */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={stop}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated mic */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {phase === "listening" && (
                <>
                  <span className="absolute inset-0 rounded-full bg-[#FF0036]/15 animate-ping" />
                  <span className="absolute inset-3 rounded-full bg-[#FF0036]/10 animate-ping [animation-delay:150ms]" />
                </>
              )}
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                phase === "listening" ? "bg-[#FF0036]" : "bg-green-500"
              }`}>
                <Mic size={34} className="text-white" />
              </div>
            </div>

            {phase === "listening" ? (
              <>
                <p className="text-base font-bold text-gray-800 mb-1">Dinliyorum…</p>
                <p className="text-xs text-gray-400 mb-3">Aramak istediğinizi söyleyin</p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-gray-800 mb-1">Anlaşıldı!</p>
                <p className="text-xs text-gray-400 mb-3">Aramak için Ara butonuna tıklayın</p>
              </>
            )}

            {transcript && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm font-semibold text-[#FF0036]">"{transcript}"</p>
              </div>
            )}

            <button
              onClick={stop}
              className="flex items-center gap-1.5 mx-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={13} />
              {phase === "listening" ? "Durdur" : "Kapat"}
            </button>
          </div>
        </div>
      )}

      {/* Error toast */}
      {errorMsg && (
        <div className="absolute top-full right-0 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600 shadow-lg z-[55] whitespace-nowrap max-w-xs">
          {errorMsg}
          <button
            onClick={() => setErrorMsg(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <X size={11} className="inline" />
          </button>
        </div>
      )}
    </>
  );
}
