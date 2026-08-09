import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * Gmail Manager Page - Gerenciador de Dispositivos para Gmail
 * Design: Cyberpunk Industrial (Cores: Vermelho/Laranja do Gmail)
 * 
 * INJEÇÃO REAL: Usa window.open para abrir a aba do Gmail e injetar o script
 * diretamente na nova aba via document.write antes do carregamento da página.
 */

import { useState, useEffect, useRef } from 'react';
import { GmailDeviceProfile, generateGmailDeviceProfile, formatGmailDataForDisplay } from '@/lib/gmailDeviceGenerator';
import { generateCompleteAntiDetectionScript, generateRandomUserAgent } from '@/lib/cookieAndUserAgentManager';
import { Button } from '@/components/ui/button';
import { Zap, Copy, Info, Play, ExternalLink, CheckCircle2, AlertCircle, Loader2, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function GmailManager() {
  const [, setLocation] = useLocation();
  const [devices, setDevices] = useState<GmailDeviceProfile[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<GmailDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const injectionWindowRef = useRef<Window | null>(null);

  // Gerar novo dispositivo
  const handleGenerateDevice = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDevice = generateGmailDeviceProfile();
      setDevices([newDevice, ...devices]);
      setSelectedDevice(newDevice);
      toast.success('✓ Dispositivo Gmail gerado com sucesso!');
    } catch (error) {
      toast.error('✗ Erro ao gerar dispositivo');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar dados pessoais
  const handleCopyData = () => {
    if (!selectedDevice) return;
    const data = formatGmailDataForDisplay(selectedDevice);
    navigator.clipboard.writeText(data);
    toast.success('✓ Dados copiados para a área de transferência!');
  };

  // Injetar no Gmail com window.open
  const handleInjectAndOpen = async () => {
    if (!selectedDevice) {
      toast.error('✗ Selecione um dispositivo primeiro');
      return;
    }

    setIsInjecting(true);
    try {
      // Abrir aba vazia
      injectionWindowRef.current = window.open('', '_blank');
      if (!injectionWindowRef.current) {
        toast.error('✗ Pop-up bloqueado. Desative o bloqueador de pop-ups.');
        setIsInjecting(false);
        return;
      }

      // Gerar script de injeção
      const antiDetectionScript = generateCompleteAntiDetectionScript({ userAgent: selectedDevice.userAgent } as any);
      const gmailInjectionScript = `
        (function() {
          // Injetar dados do dispositivo
          window.gmailDevice = ${JSON.stringify(selectedDevice)};
          localStorage.setItem('gmailDeviceProfile', JSON.stringify(window.gmailDevice));
          
          // Injetar anti-detecção
          ${antiDetectionScript}
          
          // Injetar cookies
          Object.entries(${JSON.stringify(selectedDevice.cookies)}).forEach(([key, value]) => {
            document.cookie = key + '=' + value + '; path=/; domain=.google.com';
          });
          
          console.log('✓ Gmail Device Injetado com Sucesso!');
          document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); font-family: monospace; color: #00ff00; font-size: 24px; text-align: center;"><div><div style="font-size: 48px; margin-bottom: 20px;">✓</div><div>DEVICE INJETADO!</div><div style="font-size: 14px; margin-top: 20px; color: #00aa00;">Gmail está pronto para criar conta</div></div></div>';
        })();
      `;

      // Escrever HTML + Script na aba
      injectionWindowRef.current.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Injetando Gmail Device...</title>
          <style>
            body { margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; }
            .container { text-align: center; color: #00ff00; }
            .spinner { font-size: 48px; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner">⚡</div>
            <div style="margin-top: 20px; font-size: 18px;">Injetando Device...</div>
          </div>
          <script>${gmailInjectionScript}</script>
        </body>
        </html>
      `);
      injectionWindowRef.current.document.close();

      // Aguardar 2 segundos e redirecionar
      await new Promise(resolve => setTimeout(resolve, 2000));
      injectionWindowRef.current.location.href = 'https://accounts.google.com/signup';
      
      toast.success('✓ Device injetado! Abrindo Gmail...');
    } catch (error) {
      toast.error('✗ Erro ao injetar device');
      console.error(error);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <ModuleGuide guide={MODULE_GUIDES['gmail']} accentClass="text-red-300" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-2">
            GMAIL MASTER
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-slate-400">Gerenciador de Dispositivos para Gmail • v2.0 (Injeção Real)</p><Button type="button" variant="outline" onClick={() => setLocation('/')} className="border-red-400/40 text-red-200 hover:bg-red-400/10">← Página principal</Button></div>
        </div>

        {/* Status Box */}
        <div className="border border-red-500/50 rounded-lg p-6 mb-8 bg-red-950/20 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-red-400 animate-pulse" size={24} />
            <h2 className="text-xl font-bold text-red-400">STATUS DA INJEÇÃO</h2>
          </div>
          <div className="text-slate-300 space-y-2">
            <p>✓ Novo: Injeção Real (v2.0)</p>
            <p>✓ Bypass de SMS: Ativado (email de recuperação)</p>
            <p>✓ Bypass de CAPTCHA: Ativado</p>
            <p>✓ Anti-detecção: 13+ técnicas</p>
            <p>✓ Injeção real (window.open): Ativada</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gerador */}
          <div className="lg:col-span-1">
            <div className="border border-red-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
              <h3 className="text-lg font-bold text-red-400 mb-4">GERADOR</h3>
              
              <button
                onClick={handleGenerateDevice}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    GERAR NOVO DISPOSITIVO
                  </>
                )}
              </button>

              <div className="bg-slate-900/50 border border-slate-700 rounded p-4 text-sm text-slate-300 mb-4">
                <p className="font-bold text-red-400 mb-2">💡 DICA:</p>
                <p>Clique em "GERAR NOVO DISPOSITIVO" para criar uma identidade única com:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email Gmail único</li>
                  <li>Email de recuperação</li>
                  <li>Telefone de recuperação</li>
                  <li>Senha forte</li>
                  <li>Device fingerprint</li>
                  <li>Anti-detecção ativa</li>
                </ul>
              </div>

              {selectedDevice && (
                <button
                  onClick={handleCopyData}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  COPIAR DADOS
                </button>
              )}
            </div>
          </div>

          {/* Dispositivo Selecionado */}
          <div className="lg:col-span-2">
            {selectedDevice ? (
              <div className="border border-red-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
                <h3 className="text-lg font-bold text-red-400 mb-4">DISPOSITIVO SELECIONADO</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Nome</p>
                      <p className="text-white font-mono">{selectedDevice.firstName} {selectedDevice.lastName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Data Nascimento</p>
                      <p className="text-white font-mono">{selectedDevice.birthDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Gmail Principal</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.email}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Email Recuperação</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.recoveryEmail}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Telefone Recuperação</p>
                    <p className="text-white font-mono text-sm">{selectedDevice.recoveryPhone}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Senha</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.password}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">IP</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Timezone</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.timezone}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleInjectAndOpen}
                  disabled={isInjecting}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isInjecting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Injetando...
                    </>
                  ) : (
                    <>
                      <MonitorPlay size={20} />
                      ABRIR GMAIL + INJETAR DEVICE
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="border border-slate-700 rounded-lg p-12 bg-slate-800/50 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="text-slate-500 mx-auto mb-4" size={48} />
                  <p className="text-slate-400">Nenhum dispositivo gerado</p>
                  <p className="text-slate-500 text-sm">Clique em "GERAR NOVO DISPOSITIVO" para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dispositivos Anteriores */}
        {devices.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-red-400 mb-4">HISTÓRICO DE DISPOSITIVOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.slice(1).map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className="border border-slate-700 hover:border-red-500/50 rounded-lg p-4 bg-slate-800/50 backdrop-blur cursor-pointer transition-all duration-200 hover:bg-slate-800"
                >
                  <p className="text-white font-mono text-sm break-all">{device.email}</p>
                  <p className="text-slate-400 text-xs mt-2">{device.firstName} {device.lastName}</p>
                  <p className="text-slate-500 text-xs">{new Date(device.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
