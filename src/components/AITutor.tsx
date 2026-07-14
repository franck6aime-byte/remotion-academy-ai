import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Brain, Terminal, X, RefreshCw } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AITutorProps {
  contexte?: string;
  codeActuel?: string;
  onClose?: () => void;
}

export function AITutor({ contexte, codeActuel, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'model',
      content: "Bonjour ! Je suis ton tuteur IA expert en Remotion. 🎬\n\nQue tu aies besoin d'aide pour comprendre les interpolations, les ressorts (`spring`), la gestion du temps avec des séquences, ou pour déboguer un exercice, je suis là pour t'accompagner. Comment puis-je t'aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'prompt'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build discussion history for the API
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Enrich context with code and active lesson details
      let enrichedContext = contexte || "Playground libre Remotion";
      if (codeActuel) {
        enrichedContext += `\n\nCode actuel de l'étudiant :\n\`\`\`tsx\n${codeActuel}\n\`\`\``;
      }

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          contexte: enrichedContext,
          thinkingEnabled
        })
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: `msg_${Math.random().toString(36).substr(2, 9)}`,
          role: 'model',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          thinking: data.thinking
        };
        setMessages(prev => [...prev, modelMsg]);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur inconnue");
      }
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'model',
        content: `⚠️ Désolé, une erreur est survenue lors de l'appel au tuteur IA. Veuillez vérifier que votre clé API est bien configurée dans le menu **Settings > Secrets**.\n\nDétail : ${e.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const PROMPTS = [
    {
      title: 'Expliquer interpolate()',
      desc: "Découvre comment fonctionne l'interpolation linéaire.",
      prompt: "Explique-moi le fonctionnement de la fonction interpolate() de Remotion avec un exemple simple pour animer l'opacité d'un titre."
    },
    {
      title: 'Expliquer spring()',
      desc: 'Comprends les ressorts physiques.',
      prompt: "Comment fonctionne la fonction spring() de Remotion ? Quels réglages utiliser pour obtenir un effet rebondissant amusant (stiffness, damping) ?"
    },
    {
      title: 'Aide-moi à corriger mon code',
      desc: 'Corrige les erreurs de ton exercice actuel.',
      prompt: "Peux-tu analyser mon code actuel et m'expliquer ce qui ne va pas, sans me donner directement la solution complète ?"
    },
    {
      title: 'Comment utiliser <Sequence> ?',
      desc: "Maîtrise l'orchestration temporelle.",
      prompt: "Explique-moi la différence entre le temps absolu et le temps relatif à l'intérieur du composant <Sequence>."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#101830] border-l border-[#1e293b] text-[#f9fafb] w-full max-w-md shadow-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#152042] border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Tuteur IA Remotion</h2>
            <p className="text-xs text-blue-300">En ligne • Propulsé par Gemini</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThinkingEnabled(!thinkingEnabled)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-300 ${
              thinkingEnabled 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
            }`}
            title="Activer le mode réflexion avancée (Thinking Level HIGH)"
          >
            <Brain className={`w-3.5 h-3.5 ${thinkingEnabled ? 'animate-bounce' : ''}`} />
            <span>Thinking</span>
          </button>
          
          {onClose && (
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0a1128] border-b border-[#1e293b] text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
            activeTab === 'chat' ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Discussion
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-all ${
            activeTab === 'prompt' ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Aide Express
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'prompt' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">Clique sur l'une des questions rapides ci-dessous pour l'envoyer directement au tuteur IA :</p>
            <div className="grid gap-3">
              {PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(p.prompt);
                  }}
                  className="p-3 text-left rounded-xl bg-[#152042]/50 hover:bg-[#1d2b5a]/60 border border-[#1e293b] hover:border-blue-500/50 transition-all group"
                >
                  <div className="font-semibold text-xs text-blue-400 group-hover:text-blue-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {p.title}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Thinking bubble if present */}
                {msg.thinking && (
                  <div className="mb-1 p-2 rounded-lg bg-orange-950/20 border border-orange-500/20 text-orange-400 text-[11px] font-mono leading-relaxed flex items-start gap-2">
                    <Terminal className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-[10px] uppercase tracking-wider text-orange-500/80">Réflexion de l'IA</div>
                      {msg.thinking}
                    </div>
                  </div>
                )}
                
                {/* Main Message bubble */}
                <div
                  className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#152042] text-slate-200 border border-[#1e293b] rounded-tl-none'
                  }`}
                >
                  {/* Handle code blocks highlight styling */}
                  {msg.content.split('```').map((chunk, idx) => {
                    if (idx % 2 === 1) {
                      // Code block
                      const lines = chunk.split('\n');
                      const lang = lines[0];
                      const code = lines.slice(1).join('\n');
                      return (
                        <div key={idx} className="my-2 bg-[#050b1a] rounded-lg overflow-hidden border border-[#1e293b]">
                          {lang && (
                            <div className="px-2 py-1 bg-[#0d152a] border-b border-[#1e293b] text-[10px] text-slate-400 font-mono flex items-center justify-between">
                              <span>{lang}</span>
                              <span>Remotion Code</span>
                            </div>
                          )}
                          <pre className="p-2 overflow-x-auto text-[11px] font-mono text-emerald-400 leading-tight">
                            <code>{code}</code>
                          </pre>
                        </div>
                      );
                    }
                    // Text
                    return chunk;
                  })}
                </div>
                
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 max-w-[85%] mr-auto bg-[#152042]/50 px-3 py-2.5 rounded-2xl text-xs text-slate-400 border border-[#1e293b]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[11px]">
                  {thinkingEnabled ? "L'IA analyse en profondeur votre code Remotion..." : "Le tuteur réfléchit..."}
                </span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input container */}
      <div className="p-3 bg-[#152042] border-t border-[#1e293b]">
        <div className="relative flex items-center bg-[#0a1128] border border-[#1e293b] focus-within:border-blue-500 rounded-xl px-3 py-2 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              thinkingEnabled 
                ? "Pose une colle au tuteur (Thinking HIGH)..." 
                : "Demande de l'aide sur cet exercice..."
            }
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none pr-8"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="absolute right-2 text-blue-500 hover:text-blue-400 disabled:text-slate-700 disabled:hover:text-slate-700 p-1 rounded-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {contexte && (
          <div className="flex items-center gap-1.5 mt-2 justify-center text-[10px] text-slate-400 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Contexte de l'exercice automatiquement partagé</span>
          </div>
        )}
      </div>
    </div>
  );
}
