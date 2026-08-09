import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { UniversalDeviceProfile, generateUniversalDevice, generateDirectInjectionScript } from '@/lib/universalDeviceGenerator';
import { Button } from '@/components/ui/button';
import { Zap, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function InstagramManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('instagram');
    setDevice(newDev);
    setIsGenerating(false);
    toast.success('Novo dispositivo Instagram gerado!');
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    setIsInjecting(true);
    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado! Permita pop-ups no navegador.');
        setIsInjecting(false);
        return;
      }

      const script = generateDirectInjectionScript(device, 'https://www.instagram.com/accounts/emailsignup/', 'instagram', '#ec4899');

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Injetando Instagram Device...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ec4899; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px; animation: spin 1s linear infinite;">⚡</div>
            <div style="margin-top: 20px; font-size: 18px;">Injetando Device no Instagram...</div>
          </div>
          <script>${script}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Device injetado com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6">
        <ModuleGuide guide={MODULE_GUIDES['instagram']} accentClass="text-pink-300" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-pink-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-pink-400">INSTAGRAM DEVICE MANAGER</h1>
            <p className="text-sm text-muted-foreground">Injeção direta e anti-detecção para Instagram</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-pink-500/50 text-pink-400">
            ← Voltar ao Início
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="border border-pink-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-pink-300">1. Gerar Dispositivo</h2>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
              GERAR DISPOSITIVO INSTAGRAM
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded bg-secondary/30 border border-pink-500/20 space-y-2">
                <p><strong>Dispositivo:</strong> {device.deviceName} ({device.model})</p>
                <p><strong>MAC:</strong> {device.macAddress}</p>
                <p><strong>IMEI:</strong> {device.imei}</p>
                <p><strong>User-Agent:</strong> {device.userAgent}</p>
              </div>
            )}
          </div>

          <div className="border border-pink-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-pink-300">2. Injetar e Abrir Instagram</h2>
            <Button onClick={handleInjectAndOpen} disabled={!device || isInjecting} className="bg-green-600 hover:bg-green-700 text-white font-bold">
              {isInjecting ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
              ABRIR INSTAGRAM + INJETAR DEVICE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
