import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2, Bot } from 'lucide-react';

export default function UrsaManager() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redireciona diretamente para o link externo solicitado
    const targetUrl = 'https://claude.ai';
    const timer = setTimeout(() => {
      window.location.href = targetUrl;
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full border border-blue-500/30 rounded-2xl p-8 bg-card/60 backdrop-blur-md text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Bot className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-blue-400 mb-2">URSA EXTERNAL LINK</h1>
        <p className="text-xs text-muted-foreground mb-6">
          Redirecionando automaticamente para o serviço externo configurado...
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Abrindo destino...</span>
        </div>
        <div className="mt-8 pt-4 border-t border-border/40">
          <button
            onClick={() => setLocation('/')}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Voltar ao Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
}
