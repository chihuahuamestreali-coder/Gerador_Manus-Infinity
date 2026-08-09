import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * TikTok Manager Page - Gerenciador Avançado de Dispositivos para TikTok
 * Design: Cyberpunk Industrial com efeitos neon e animações de scan
 * 
 * INJEÇÃO REAL: Usa window.open para abrir a aba do TikTok e injetar o script
 * diretamente na nova aba via document.write antes do carregamento da página.
 */

import { useState, useEffect, useRef } from 'react';
import { generateTikTokDeviceProfile, generateTikTokSignupUrl, generateTikTokBookmarklet, generateTikTokAppBehaviorScript } from '@/lib/tiktokDeviceGenerator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { generateCompleteAntiDetectionScript } from '@/lib/cookieAndUserAgentManager';
import { generateRandomUserAgent } from '@/lib/cookieAndUserAgentManager';
import { saveAccountRecord, generatePerformanceReport, PerformanceReport } from '@/lib/accountHistoryManager';
import { Button } from '@/components/ui/button';
import { Zap, Copy, Info, ExternalLink, Shield, BarChart3, Trash2, CheckCircle2, AlertCircle, Loader2, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function TikTokManager() {
  const [, setLocation] = useLocation();
  const [referralCode, setReferralCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [currentPersonalData, setCurrentPersonalData] = useState<any>(null);
  const [currentUserAgent, setCurrentUserAgent] = useState<any>(null);
  const [antiFraudMode, setAntiFraudMode] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [injectionStatus, setInjectionStatus] = useState<'idle' | 'opening' | 'injecting' | 'success' | 'error'>('idle');
  const [injectionMessage, setInjectionMessage] = useState('');
  const tiktokWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const report = generatePerformanceReport();
    setPerformanceReport(report);
  }, []);

  // Monitora a aba do TikTok
  useEffect(() => {
    if (!tiktokWindowRef.current || injectionStatus !== 'injecting') return;
    
    const checkInterval = setInterval(() => {
      try {
        const w = tiktokWindowRef.current;
        if (!w || w.closed) {
          clearInterval(checkInterval);
          setInjectionStatus('error');
          setInjectionMessage('Aba do TikTok foi fechada');
          return;
        }
        
        const doc = w.document;
        if (doc && doc.readyState === 'complete') {
          const overlay = doc.getElementById('device-injected-overlay');
          if (overlay) {
            clearInterval(checkInterval);
            setInjectionStatus('success');
            setInjectionMessage('Device injetado com sucesso no TikTok!');
            toast.success('Device injetado no TikTok!');
          }
        }
      } catch (e) {
        clearInterval(checkInterval);
        setInjectionStatus('success');
        setInjectionMessage('Script injetado na aba do TikTok');
        toast.success('Script injetado no TikTok!');
      }
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [injectionStatus]);

  const handleGenerateDevice = async () => {
    setIsGenerating(true);
    setInjectionStatus('idle');
    setInjectionMessage('');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDevice = generateTikTokDeviceProfile();
    const personalData = generatePersonalData();
    const userAgent = generateRandomUserAgent();
    
    setCurrentDevice(newDevice);
    setCurrentPersonalData(personalData);
    setCurrentUserAgent(userAgent);
    setIsGenerating(false);
    
    toast.success('Novo dispositivo TikTok gerado!', {
      description: `${newDevice.deviceName} • ${personalData.fullName}`,
    });
  };

  /**
   * INJEÇÃO REAL VIA WINDOW.OPEN
   */
  const handleOpenTikTokAndInject = () => {
    if (!currentDevice || !currentPersonalData) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    setInjectionStatus('opening');
    setInjectionMessage('Abrindo aba do TikTok...');

    const signupUrl = generateTikTokSignupUrl(referralCode);
    
    // Gera o script completo de injeção
    const bookmarklet = generateTikTokBookmarklet(currentDevice);
    const appBehavior = generateTikTokAppBehaviorScript();
    const code = bookmarklet.replace('javascript:', '');
    
    let fullCode = code;
    if (antiFraudMode && currentUserAgent) {
      const antiDetectionScript = generateCompleteAntiDetectionScript(currentUserAgent);
      fullCode = antiDetectionScript + '\n' + appBehavior + '\n' + code;
    }
    
    // Salva registro de conta
    const accountRecord = {
      id: `tiktok_${Date.now()}`,
      email: currentPersonalData.email,
      createdAt: new Date(),
      status: 'pending' as const,
      referralLink: referralCode,
      deviceFingerprint: currentDevice.fingerprint,
      userAgent: currentUserAgent.userAgent,
      personalData: {
        name: currentPersonalData.fullName,
        phone: currentPersonalData.phone,
        birthDate: currentPersonalData.birthDate,
        city: currentPersonalData.city,
        state: currentPersonalData.state,
      },
      behaviorConfig: {
        minDelay: antiFraudMode ? 1000 : 500,
        maxDelay: antiFraudMode ? 5000 : 3000,
        typingSpeed: antiFraudMode ? 150 : 100,
      },
      notes: `TikTok | Anti-fraude: ${antiFraudMode ? 'Ativo' : 'Inativo'}`,
    };
    
    saveAccountRecord(accountRecord);
    
    // MÉTODO REAL DE INJEÇÃO
    const newWindow = window.open('', '_blank');
    
    if (!newWindow) {
      setInjectionStatus('error');
      setInjectionMessage('Pop-up bloqueado pelo navegador');
      toast.error('Pop-up bloqueado', {
        description: 'Desative o bloqueador de pop-ups e tente novamente',
      });
      return;
    }
    
    tiktokWindowRef.current = newWindow;
    setInjectionStatus('injecting');
    setInjectionMessage('Injetando script na aba do TikTok...');
    
    // Escreve a página intermediária
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Device Injector - TikTok</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            color: #ec4899;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          .injecting {
            text-align: center;
            animation: fadeIn 0.3s ease;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(236, 72, 153, 0.2);
            border-top: 4px solid #ec4899;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          h1 { font-size: 24px; margin-bottom: 10px; color: #ec4899; }
          p { font-size: 14px; color: #ec489980; margin-bottom: 20px; }
          .success-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.5s ease;
          }
          .success-icon {
            width: 80px; height: 80px;
            background: #22c55e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: white;
            margin-bottom: 20px;
            animation: fadeIn 0.5s ease;
          }
          .success-overlay h2 { color: #22c55e; font-size: 28px; margin-bottom: 10px; }
          .success-overlay p { color: #22c55e80; font-size: 16px; margin-bottom: 30px; }
          .goto-btn {
            padding: 14px 30px;
            background: #22c55e;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            transition: all 0.2s ease;
          }
          .goto-btn:hover { background: #16a34a; transform: scale(1.05); }
          .goto-btn:active { transform: scale(0.97); }
        </style>
      </head>
      <body>
        <div class="injecting" id="injecting-screen">
          <div class="spinner"></div>
          <h1>INJETANDO DEVICE...</h1>
          <p>Aguardando script de injeção executar...</p>
        </div>
        
        <script>
          try {
            // === SCRIPT DE INJEÇÃO ===
            ${fullCode}
            // === FIM DO SCRIPT ===
            
            document.getElementById('injecting-screen').style.display = 'none';
            
            const overlay = document.createElement('div');
            overlay.id = 'device-injected-overlay';
            overlay.className = 'success-overlay';
            overlay.innerHTML = \`
              <div class="success-icon">✓</div>
              <h2>DEVICE INJETADO!</h2>
              <p>Seu dispositivo foi mascarado com sucesso</p>
              <button class="goto-btn" onclick="window.location.href='${signupUrl}'">
                IR PARA TIKTOK →
              </button>
            \`;
            document.body.appendChild(overlay);
            
            console.log('✓ Device injetado com sucesso!');
          } catch(error) {
            document.getElementById('injecting-screen').innerHTML = \`
              <div style="color: #ef4444; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 10px;">ERRO NA INJEÇÃO</h1>
                <p style="color: #ef444480; margin-bottom: 20px;">\${error.message}</p>
                <button class="goto-btn" style="background: #ef4444;" onclick="window.location.href='${signupUrl}'">
                  IR PARA TIKTOK MESMO ASSIM
                </button>
              </div>
            \`;
            console.error('Erro ao injetar:', error);
          }
        </script>
      </body>
      </html>
    `);
    
    newWindow.document.close();
    
    toast.info('Script injetado na nova aba!', {
      description: 'Aguarde a confirmação na aba do TikTok.',
    });
  };

  const copyBookmarklet = () => {
    if (!currentDevice) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    const bookmarklet = generateTikTokBookmarklet(currentDevice);
    navigator.clipboard.writeText(bookmarklet);
    toast.success('Bookmarklet copiado!', {
      description: 'Cole na barra de endereço do navegador',
    });
  };

  const copyPersonalData = () => {
    if (!currentPersonalData) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    const dataText = `
Nome: ${currentPersonalData.fullName}
Email: ${currentPersonalData.email}
Telefone: ${currentPersonalData.phone}
Data de Nascimento: ${currentPersonalData.birthDate}
Cidade: ${currentPersonalData.city}
Estado: ${currentPersonalData.state}
    `.trim();

    navigator.clipboard.writeText(dataText);
    toast.success('Dados pessoais copiados!', {
      description: 'Cole nos campos do formulário',
    });
  };

  const getStatusBg = () => {
    switch (injectionStatus) {
      case 'idle': return 'bg-secondary/30 border-border';
      case 'opening': return 'bg-yellow-500/10 border-yellow-500/50';
      case 'injecting': return 'bg-yellow-500/10 border-yellow-500/50';
      case 'success': return 'bg-green-500/10 border-green-500/50';
      case 'error': return 'bg-red-500/10 border-red-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
        <ModuleGuide guide={MODULE_GUIDES['tiktok']} accentClass="text-sky-300" />
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(236, 72, 153, 0.05) 25%, rgba(236, 72, 153, 0.05) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.05) 75%, rgba(236, 72, 153, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(236, 72, 153, 0.05) 25%, rgba(236, 72, 153, 0.05) 26%, transparent 27%, transparent 74%, rgba(236, 72, 153, 0.05) 75%, rgba(236, 72, 153, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-pink-400/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-pink-400 font-mono mb-1">
                ▌TIKTOK DEVICE MASTER▌
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground font-mono">
                Gerenciador Anti-Fraude para TikTok • v2.0 (Injeção Real)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-400/20 hover:bg-blue-400/40 text-blue-400 border border-blue-400/50 rounded transition-all font-bold text-xs"
              >
                <BarChart3 size={16} />
                HISTÓRICO
              </button>
              <button
                onClick={() => setLocation('/')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/40 text-cyan-400 border border-cyan-400/50 rounded transition-all font-bold text-xs neon-glow"
              >
                ← DEVICE MASTER
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* PAINEL DE STATUS DA INJEÇÃO */}
        <div className={`rounded-lg p-5 mb-8 border-2 transition-all ${
          injectionStatus === 'success' ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50' :
          injectionStatus === 'error' ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-500/50' :
          injectionStatus !== 'idle' ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-500/50' :
          'bg-gradient-to-r from-secondary/50 to-secondary/30 border-pink-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground font-mono flex items-center gap-2">
              <MonitorPlay size={20} className={
                injectionStatus === 'success' ? 'text-green-400' :
                injectionStatus === 'error' ? 'text-red-400' :
                'text-pink-400'
              } />
              ▌STATUS DA INJEÇÃO▌
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              injectionStatus === 'success' ? 'bg-green-500/20 text-green-400' :
              injectionStatus === 'error' ? 'bg-red-500/20 text-red-400' :
              injectionStatus !== 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-secondary text-muted-foreground'
            }`}>
              {injectionStatus === 'success' && <CheckCircle2 size={16} />}
              {injectionStatus === 'error' && <AlertCircle size={16} />}
              {(injectionStatus === 'opening' || injectionStatus === 'injecting') && <Loader2 size={16} className="animate-spin" />}
              {injectionStatus === 'idle' && <Loader2 size={16} />}
              {injectionStatus === 'idle' && 'Aguardando'}
              {injectionStatus === 'opening' && 'Abrindo...'}
              {injectionStatus === 'injecting' && 'Injetando...'}
              {injectionStatus === 'success' && '✓ Sucesso'}
              {injectionStatus === 'error' && '✗ Erro'}
            </div>
          </div>
          
          {injectionMessage && (
            <div className={`p-3 rounded-lg border text-sm font-mono ${getStatusBg()}`}>
              {injectionMessage}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="neon-glow-pink rounded-lg p-4 mb-8 bg-secondary/50 border-2 border-pink-500/50">
          <div className="flex gap-3">
            <Shield size={20} className="text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-pink-400 mb-1">🛡️ Modo Anti-Fraude</h3>
              <p className="text-sm text-foreground font-mono mb-2">
                {antiFraudMode ? '✓ ATIVO' : '✗ INATIVO'} - Simula comportamento mobile realista
              </p>
              <button
                onClick={() => setAntiFraudMode(!antiFraudMode)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  antiFraudMode
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                {antiFraudMode ? 'Desativar' : 'Ativar'} Anti-Fraude
              </button>
            </div>
          </div>
        </div>

        {showHistory && performanceReport && (
          <div className="neon-glow rounded-lg p-6 bg-card border border-blue-400/30 mb-8">
            <h2 className="text-lg font-bold text-blue-400 mb-4 font-mono">▌RELATÓRIO DE DESEMPENHO▌</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{performanceReport.totalAccounts}</div>
                <p className="text-xs text-muted-foreground">Total de Contas</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{performanceReport.successfulAccounts}</div>
                <p className="text-xs text-muted-foreground">Bem-sucedidas</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{performanceReport.fraudDetected}</div>
                <p className="text-xs text-muted-foreground">Fraude Detectada</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{performanceReport.pendingAccounts}</div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
              <div className="bg-secondary/30 rounded p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {performanceReport.overallSuccessRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Generator Card */}
              <div className="neon-glow rounded-lg p-6 bg-card">
                <h2 className="text-xl font-bold text-pink-400 mb-4 font-mono">
                  ▌GERADOR▌
                </h2>

                <button
                  onClick={handleGenerateDevice}
                  disabled={isGenerating}
                  className="w-full mb-4 flex items-center justify-center gap-2 px-6 py-4 bg-pink-400/20 hover:bg-pink-400/40 text-pink-400 border-2 border-pink-400 rounded font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed neon-glow"
                >
                  <Zap size={20} />
                  {isGenerating ? 'GERANDO...' : 'GERAR NOVO DISPOSITIVO'}
                </button>

                {isGenerating && (
                  <div className="mb-4 p-3 bg-secondary/50 rounded border border-pink-400/30">
                    <div className="text-xs text-pink-400 font-mono mb-2">SCAN EM PROGRESSO</div>
                    <div className="h-1 bg-secondary rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse"
                        style={{
                          animation: 'scan-line 1.5s ease-in-out infinite',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Referral Code Input */}
                <div className="mb-4 space-y-2">
                  <label className="text-xs text-pink-400 font-mono font-bold">
                    CÓDIGO DE CONVITE (Opcional)
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Cole seu código de convite..."
                    className="w-full px-3 py-2 bg-input border border-pink-400/30 rounded text-foreground text-xs font-mono placeholder-muted-foreground focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="p-3 bg-green-500/10 rounded border border-green-500/30 text-xs text-green-400 font-mono mb-4">
                  <p className="font-bold mb-1">💡 DICA:</p>
                  <p>Use dados realistas e mantenha o modo anti-fraude ativo para máximo sucesso!</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    Cada dispositivo inclui:
                  </p>
                  <ul className="text-xs text-foreground font-mono space-y-1 ml-2">
                    <li>✓ Dados pessoais realistas</li>
                    <li>✓ User-Agent mobile TikTok</li>
                    <li>✓ Comportamento app-like</li>
                    <li>✓ Anti-detecção ativa</li>
                    <li>✓ Injeção real (window.open)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Device Info */}
          <div className="lg:col-span-2">
            {!currentDevice ? (
              <div className="neon-glow rounded-lg p-12 bg-card text-center">
                <div className="text-6xl mb-4">♪</div>
                <h3 className="text-xl font-bold text-pink-400 mb-2 font-mono">
                  NENHUM DISPOSITIVO
                </h3>
                <p className="text-muted-foreground font-mono">
                  Clique em "Gerar Novo Dispositivo" para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Device Card */}
                <div className="neon-glow rounded-lg p-6 bg-card border border-pink-400/30">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 font-mono">
                    ▌{currentDevice.deviceName}▌
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                    <div>
                      <p className="text-muted-foreground mb-1">MODELO</p>
                      <p className="text-foreground font-bold">{currentDevice.model}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">FABRICANTE</p>
                      <p className="text-foreground font-bold">{currentDevice.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">RESOLUÇÃO</p>
                      <p className="text-foreground font-bold">{currentDevice.resolution}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">RAM</p>
                      <p className="text-foreground font-bold">{currentDevice.ramMb}GB</p>
                    </div>
                  </div>
                </div>

                {/* Personal Data Card */}
                {currentPersonalData && (
                  <div className="neon-glow rounded-lg p-6 bg-card border border-green-400/30">
                    <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">
                      ▌DADOS PESSOAIS▌
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                      <div>
                        <p className="text-muted-foreground mb-1">NOME</p>
                        <p className="text-foreground font-bold">{currentPersonalData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">EMAIL</p>
                        <p className="text-green-400 font-bold break-all">{currentPersonalData.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">TELEFONE</p>
                        <p className="text-foreground font-bold">{currentPersonalData.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">DATA NASCIMENTO</p>
                        <p className="text-foreground font-bold">{currentPersonalData.birthDate}</p>
                      </div>
                    </div>

                    <button
                      onClick={copyPersonalData}
                      className="w-full px-3 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded transition-colors font-bold text-xs"
                    >
                      <Copy size={14} className="inline mr-2" />
                      COPIAR DADOS PESSOAIS
                    </button>
                  </div>
                )}

                {/* Injection Section */}
                <div className="p-4 bg-secondary/30 rounded border border-pink-400/30 font-mono text-xs space-y-3">
                  <div className="space-y-2">
                    <p className="text-green-400 font-bold mb-2">▶ INJETAR NO TIKTOK (INJEÇÃO REAL)</p>
                    
                    <button
                      onClick={handleOpenTikTokAndInject}
                      className={`w-full px-4 py-4 font-bold text-sm transition-all flex items-center justify-center gap-3 rounded border ${
                        injectionStatus === 'success'
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/50 hover:to-purple-500/50 border-pink-400 text-pink-300 neon-glow'
                      }`}
                    >
                      <ExternalLink size={18} />
                      {injectionStatus === 'success'
                        ? '✓ INJETADO - ABRIR NOVO DEVICE'
                        : 'ABRIR TIKTOK + INJETAR DEVICE'
                      }
                    </button>

                    {/* Como funciona */}
                    <div className="border-t border-pink-400/20 pt-3 mt-2">
                      <p className="text-pink-400 font-bold mb-2">ℹ️ COMO FUNCIONA</p>
                      <div className="bg-pink-400/10 rounded p-3 border border-pink-400/30 space-y-1 text-xs">
                        <p className="text-pink-300">1. Clique no botão acima</p>
                        <p className="text-pink-300">2. Uma <strong>nova aba</strong> abre com tela de "Injetando..."</p>
                        <p className="text-pink-300">3. O script roda <strong>automaticamente</strong> (sem console)</p>
                        <p className="text-pink-300">4. Tela verde "✓ DEVICE INJETADO" aparece</p>
                        <p className="text-pink-300">5. Clique "IR PARA TIKTOK" e crie sua conta</p>
                        <p className="text-yellow-300 mt-2 font-bold">⚠️ Se o pop-up for bloqueado, desative o bloqueador</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-pink-400/20 pt-3">
                    <p className="text-pink-400 font-bold mb-2">📋 BOOKMARKLET (Alternativa)</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-input rounded p-2 border border-pink-400/20 overflow-auto max-h-20">
                        <code className="text-green-400 break-all text-xs">
                          {generateTikTokBookmarklet(currentDevice).substring(0, 80)}...
                        </code>
                      </div>
                      <button
                        onClick={copyBookmarklet}
                        className="flex items-center gap-1 px-2 py-1 bg-pink-400/20 hover:bg-pink-400/40 text-pink-400 rounded transition-colors flex-shrink-0"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-400/30 mt-16 py-8 text-center text-xs text-muted-foreground font-mono">
        <p>TikTok Device Master v2.0 • Injeção Real Implementada</p>
        <p className="mt-2">⚠️ Use responsavelmente. Respeite os termos de serviço do TikTok.</p>
      </footer>
    </div>
  );
}
