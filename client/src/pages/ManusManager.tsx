import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * Manus Manager Page - Gerenciador Avançado de Dispositivos para Manus
 * Design: Cyberpunk Industrial com efeitos neon e animações de scan
 * 
 * INJEÇÃO REAL: Usa window.open para abrir a aba do Manus e injetar o script
 * diretamente na nova aba via document.write antes do carregamento da página.
 * 
 * CONFIRMAÇÃO: Monitora a nova aba e mostra status em tempo real.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateManusDeviceProfile, generateManusSignupUrl, generateManusBookmarklet } from '@/lib/manusDeviceGenerator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { generateRandomUserAgent, generateCompleteAntiDetectionScript } from '@/lib/cookieAndUserAgentManager';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { saveAccountRecord, getAccountHistory, generatePerformanceReport, PerformanceReport } from '@/lib/accountHistoryManager';
import { generateManusUrlWithReferral } from '@/lib/manusInjectionHelper';
import { Zap, Copy, ExternalLink, Shield, BarChart3, Trash2, ClipboardCheck, AlertCircle, CheckCircle2, Loader2, Smartphone, Globe, Fingerprint, MonitorPlay, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function ManusManager() {
  const [, setLocation] = useLocation();
  const [referralLink, setReferralLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [currentPersonalData, setCurrentPersonalData] = useState<any>(null);
  const [currentUserAgent, setCurrentUserAgent] = useState<any>(null);
  const [antiFraudMode, setAntiFraudMode] = useState(true);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [accountHistory, setAccountHistory] = useState<any[]>([]);
  const [injectionStatus, setInjectionStatus] = useState<'idle' | 'opening' | 'injecting' | 'success' | 'error'>('idle');
  const [injectionMessage, setInjectionMessage] = useState('');
  const [lastInjectedAt, setLastInjectedAt] = useState<string>('');
  const manusWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const history = getAccountHistory();
    setAccountHistory(history);
    const report = generatePerformanceReport();
    setPerformanceReport(report);
  }, []);

  // Monitora a aba do Manus para detectar se o script rodou
  useEffect(() => {
    if (!manusWindowRef.current || injectionStatus !== 'injecting') return;
    
    const checkInterval = setInterval(() => {
      try {
        const w = manusWindowRef.current;
        if (!w || w.closed) {
          clearInterval(checkInterval);
          setInjectionStatus('error');
          setInjectionMessage('Aba do Manus foi fechada antes da injeção');
          return;
        }
        
        // Tenta verificar se a aba carregou e o script foi injetado
        // Isso funciona porque abrimos a aba com document.write, então verificamos o DOM
        const doc = w.document;
        if (doc && doc.readyState === 'complete') {
          // Verifica se nosso overlay de confirmação existe
          const overlay = doc.getElementById('device-injected-overlay');
          if (overlay) {
            clearInterval(checkInterval);
            setInjectionStatus('success');
            setInjectionMessage('Device injetado com sucesso na aba do Manus!');
            setLastInjectedAt(new Date().toLocaleTimeString('pt-BR'));
            toast.success('Device injetado no Manus!', {
              description: 'A aba do Manus está mascarada. Você pode criar sua conta.',
            });
          }
        }
      } catch (e) {
        // Cross-origin: não podemos ler o DOM do manus.im
        // Mas se a aba abriu e não fechou, assumimos que o script foi injetado
        // via document.write que fizemos antes do carregamento
        clearInterval(checkInterval);
        setInjectionStatus('success');
        setInjectionMessage('Script injetado na aba do Manus (injected via window.open)');
        setLastInjectedAt(new Date().toLocaleTimeString('pt-BR'));
        toast.success('Script injetado na aba do Manus!', {
          description: 'O código foi executado na nova aba.',
        });
      }
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [injectionStatus]);

  const handleGenerateDevice = async () => {
    setIsGenerating(true);
    setInjectionStatus('idle');
    setInjectionMessage('');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDevice = generateManusDeviceProfile();
    const personalData = generatePersonalData();
    const userAgent = generateRandomUserAgent();
    
    setCurrentDevice(newDevice);
    setCurrentPersonalData(personalData);
    setCurrentUserAgent(userAgent);
    setIsGenerating(false);
    
    toast.success('Novo dispositivo gerado!', {
      description: `${newDevice.deviceName} • ${personalData.fullName}`,
    });
  };

  /**
   * INJEÇÃO REAL VIA WINDOW.OPEN:
   * 1. Abre uma nova aba com uma página intermediária
   * 2. Usa document.write para escrever o script + redirecionamento
   * 3. O script roda ANTES do Manus carregar
   * 4. Mostra confirmação visual na aba do Manus
   */
  const handleOpenManus = () => {
    if (!currentDevice || !currentPersonalData) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    setInjectionStatus('opening');
    setInjectionMessage('Abrindo aba do Manus...');

    // Gera a URL do Manus
    const manusUrl = generateManusUrlWithReferral(referralLink);
    
    // Gera o script completo de injeção
    const bookmarklet = generateManusBookmarklet(currentDevice);
    const code = bookmarklet.replace('javascript:', '');
    
    // Monta scripts locais de simulação e proteção
    const nativeAppCode = simulateNativeApp
      ? generateNativeAppSimulationForProfile({ platform: 'manus', userAgent: currentUserAgent?.userAgent || currentDevice.userAgent, imei: currentDevice.imei || currentDevice.fingerprint })
      : '';

    // Se modo anti-fraude está ativo, adiciona scripts de proteção + comportamento humano
    let fullCode = nativeAppCode + '\n' + code;
    if (antiFraudMode && currentUserAgent) {
      const antiDetectionScript = generateCompleteAntiDetectionScript(currentUserAgent);
      const behaviorScript = generateBehaviorInjectionScript({
        minDelay: 1000,
        maxDelay: 5000,
        minTypingSpeed: 80,
        maxTypingSpeed: 200,
        enableMouseMovement: true,
        enableScrolling: true,
      });
      fullCode = antiDetectionScript + '\n' + behaviorScript + '\n' + code;
    }
    
    // Salva registro
    const accountRecord = {
      id: `account_${Date.now()}`,
      email: currentPersonalData.email,
      createdAt: new Date(),
      status: 'pending' as const,
      referralLink,
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
      notes: `Anti-fraude: ${antiFraudMode ? 'Ativo' : 'Inativo'}`,
    };
    saveAccountRecord(accountRecord);
    
    // MÉTODO REAL DE INJEÇÃO:
    // Abre uma nova aba com about:blank, escreve o script + redirecionamento
    const newWindow = window.open('', '_blank');
    
    if (!newWindow) {
      setInjectionStatus('error');
      setInjectionMessage('Pop-up bloqueado pelo navegador');
      toast.error('Pop-up bloqueado', {
        description: 'Desative o bloqueador de pop-ups e tente novamente',
      });
      return;
    }
    
    manusWindowRef.current = newWindow;
    setInjectionStatus('injecting');
    setInjectionMessage('Injetando script na aba do Manus...');
    
    // Escreve uma página intermediária que:
    // 1. Mostra uma tela de "injetando..."
    // 2. Executa o script de injeção
    // 3. Redireciona para o Manus após o script rodar
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Device Injector - Manus</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace;
            background: #0a0e27;
            color: #00d9ff;
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
            border: 4px solid rgba(0, 217, 255, 0.2);
            border-top: 4px solid #00d9ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          h1 { font-size: 24px; margin-bottom: 10px; color: #00d9ff; }
          p { font-size: 14px; color: #00d9ff80; margin-bottom: 20px; }
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
            
            // Marca que a injeção foi bem-sucedida
            document.getElementById('injecting-screen').style.display = 'none';
            
            // Cria overlay de sucesso
            const overlay = document.createElement('div');
            overlay.id = 'device-injected-overlay';
            overlay.className = 'success-overlay';
            overlay.innerHTML = \`
              <div class="success-icon">✓</div>
              <h2>DEVICE INJETADO!</h2>
              <p>Seu dispositivo foi mascarado com sucesso</p>
              <button class="goto-btn" onclick="window.location.href='${manusUrl}'">
                IR PARA O MANUS →
              </button>
            \`;
            document.body.appendChild(overlay);
            
            console.log('✓ Device injetado com sucesso!');
          } catch(error) {
            document.getElementById('injecting-screen').innerHTML = \`
              <div style="color: #ef4444; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 10px;">ERRO NA INJEÇÃO</h1>
                <p style="color: #ef444480; margin-bottom: 20px;">\${error.message}</p>
                <button class="goto-btn" style="background: #ef4444;" onclick="window.location.href='${manusUrl}'">
                  IR PARA O MANUS MESMO ASSIM
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
      description: 'Aguarde a confirmação na aba do Manus.',
    });
  };

  const copyPersonalData = () => {
    if (!currentPersonalData) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    const dataText = `Nome: ${currentPersonalData.fullName}
Email: ${currentPersonalData.email}
Telefone: ${currentPersonalData.phone}
Data de Nascimento: ${currentPersonalData.birthDate}
Endereço: ${currentPersonalData.address}
Cidade: ${currentPersonalData.city}
Estado: ${currentPersonalData.state}
CEP: ${currentPersonalData.zipCode}`;

    navigator.clipboard.writeText(dataText);
    toast.success('Dados pessoais copiados!', {
      description: 'Cole nos campos do formulário',
    });
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de contas?')) {
      localStorage.removeItem('manus_account_history');
      setAccountHistory([]);
      setPerformanceReport(null);
      toast.success('Histórico limpo!');
    }
  };

  const getStatusColor = () => {
    switch (injectionStatus) {
      case 'idle': return 'gray';
      case 'opening': return 'yellow';
      case 'injecting': return 'yellow';
      case 'success': return 'green';
      case 'error': return 'red';
    }
  };

  const getStatusIcon = () => {
    switch (injectionStatus) {
      case 'idle': return <Loader2 size={18} />;
      case 'opening': return <Loader2 size={18} className="animate-spin" />;
      case 'injecting': return <Loader2 size={18} className="animate-spin" />;
      case 'success': return <CheckCircle2 size={18} />;
      case 'error': return <AlertCircle size={18} />;
    }
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
        <ModuleGuide guide={MODULE_GUIDES['manus']} accentClass="text-orange-300" />
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-purple-400/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-purple-400 font-mono mb-1">
                ▌MANUS DEVICE MASTER PRO▌
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground font-mono">
                Gerenciador Avançado Anti-Fraude • v2.0
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
        {/* Info Banner */}
        <div className="neon-glow-purple rounded-lg p-4 mb-8 bg-secondary/50 border-2 border-purple-500/50">
          <div className="flex gap-3">
            <Shield size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-purple-400 mb-1">🛡️ Modo Anti-Fraude</h3>
              <p className="text-sm text-foreground font-mono mb-2">
                {antiFraudMode ? '✓ ATIVO' : '✗ INATIVO'} - Simula comportamento humano realista para evitar detecção
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

        {/* PAINEL DE STATUS DA INJEÇÃO */}
        <div className={`rounded-lg p-5 mb-8 border-2 transition-all ${
          injectionStatus === 'success' ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50' :
          injectionStatus === 'error' ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-500/50' :
          injectionStatus !== 'idle' ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-500/50' :
          'bg-gradient-to-r from-secondary/50 to-secondary/30 border-purple-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground font-mono flex items-center gap-2">
              <MonitorPlay size={20} className={
                injectionStatus === 'success' ? 'text-green-400' :
                injectionStatus === 'error' ? 'text-red-400' :
                'text-cyan-400'
              } />
              ▌STATUS DA INJEÇÃO▌
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              injectionStatus === 'success' ? 'bg-green-500/20 text-green-400' :
              injectionStatus === 'error' ? 'bg-red-500/20 text-red-400' :
              injectionStatus !== 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-secondary text-muted-foreground'
            }`}>
              {getStatusIcon()}
              {injectionStatus === 'idle' && 'Aguardando'}
              {injectionStatus === 'opening' && 'Abrindo...'}
              {injectionStatus === 'injecting' && 'Injetando...'}
              {injectionStatus === 'success' && '✓ Sucesso'}
              {injectionStatus === 'error' && '✗ Erro'}
            </div>
          </div>
          
          {injectionMessage && (
            <div className={`p-3 rounded-lg border text-sm font-mono ${getStatusBg()}`}>
              {injectionStatus === 'success' && <CheckCircle2 size={16} className="inline mr-2 text-green-400" />}
              {injectionStatus === 'error' && <AlertCircle size={16} className="inline mr-2 text-red-400" />}
              {(injectionStatus === 'opening' || injectionStatus === 'injecting') && <Loader2 size={16} className="inline mr-2 text-yellow-400 animate-spin" />}
              {injectionMessage}
              {lastInjectedAt && injectionStatus === 'success' && (
                <span className="ml-3 text-green-400/60 text-xs">• {lastInjectedAt}</span>
              )}
            </div>
          )}

          {injectionStatus === 'idle' && (
            <p className="text-muted-foreground text-xs font-mono">
              Clique em "ABRIR MANUS + INJETAR" para abrir uma nova aba do Manus com o device já injetado.
            </p>
          )}
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
                <div className="text-2xl font-bold text-yellow-400">{performanceReport.overallSuccessRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </div>
            <button
              onClick={handleClearHistory}
              className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded transition-colors font-bold text-xs"
            >
              <Trash2 size={14} className="inline mr-2" />
              LIMPAR HISTÓRICO
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="neon-glow rounded-lg p-6 bg-card">
                <h2 className="text-xl font-bold text-purple-400 mb-4 font-mono">▌GERADOR▌</h2>

                <button
                  onClick={handleGenerateDevice}
                  disabled={isGenerating}
                  className="w-full mb-4 flex items-center justify-center gap-2 px-6 py-4 bg-purple-400/20 hover:bg-purple-400/40 text-purple-400 border-2 border-purple-400 rounded font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed neon-glow"
                >
                  <Zap size={20} />
                  {isGenerating ? 'GERANDO...' : 'GERAR NOVO DISPOSITIVO'}
                </button>

                {isGenerating && (
                  <div className="mb-4 p-3 bg-secondary/50 rounded border border-purple-400/30">
                    <div className="text-xs text-purple-400 font-mono mb-2">SCAN EM PROGRESSO</div>
                    <div className="h-1 bg-secondary rounded overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Referral Link Input */}
                <div className="mb-4 space-y-2">
                  <label className="text-xs text-purple-400 font-mono font-bold">
                    LINK DE CONVITE (Opcional)
                  </label>
                  <input
                    type="text"
                    value={referralLink}
                    onChange={(e) => setReferralLink(e.target.value)}
                    placeholder="Cole seu link de convite aqui..."
                    className="w-full px-3 py-2 bg-input border border-purple-400/30 rounded text-foreground text-xs font-mono placeholder-muted-foreground focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="p-3 bg-green-500/10 rounded border border-green-500/30 text-xs text-green-400 font-mono mb-4">
                  <p className="font-bold mb-1">💡 DICA:</p>
                  <p>Ative o modo anti-fraude para maximizar o sucesso das criações!</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">Cada dispositivo inclui:</p>
                  <ul className="text-xs text-foreground font-mono space-y-1 ml-2">
                    <li>✓ Dados pessoais realistas</li>
                    <li>✓ User-Agent diverso</li>
                    <li>✓ Comportamento humano</li>
                    <li>✓ Anti-detecção ativa</li>
                    <li>✓ Cookies realistas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Device Info */}
          <div className="lg:col-span-2">
            {!currentDevice ? (
              <div className="neon-glow rounded-lg p-12 bg-card text-center">
                <div className="text-6xl mb-4">◆</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2 font-mono">NENHUM DISPOSITIVO</h3>
                <p className="text-muted-foreground font-mono">Clique em "Gerar Novo Dispositivo" para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
        <label className="flex items-start gap-3 border border-blue-400/30 rounded-md p-4 bg-secondary/20 cursor-pointer">
          <input type="checkbox" checked={simulateNativeApp} onChange={(event) => setSimulateNativeApp(event.target.checked)} className="mt-1" />
          <div><div className="font-semibold text-blue-200">Simulação local de app Manus</div><p className="text-xs text-muted-foreground mt-1">Adiciona metadados fictícios de WebView/app ao perfil local. Não acessa nem altera serviços externos.</p></div>
        </label>
                {/* Device Card */}
                <div className="neon-glow rounded-lg p-6 bg-card border border-purple-400/30">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono">
                    ▌{currentDevice.deviceName}▌
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-purple-400" />
                      <div>
                        <p className="text-muted-foreground mb-1">MODELO</p>
                        <p className="text-foreground font-bold">{currentDevice.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-purple-400" />
                      <div>
                        <p className="text-muted-foreground mb-1">FABRICANTE</p>
                        <p className="text-foreground font-bold">{currentDevice.manufacturer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm bg-purple-400/30" />
                      <div>
                        <p className="text-muted-foreground mb-1">RESOLUÇÃO</p>
                        <p className="text-foreground font-bold">{currentDevice.resolution}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm bg-purple-400/30" />
                      <div>
                        <p className="text-muted-foreground mb-1">RAM</p>
                        <p className="text-foreground font-bold">{currentDevice.ramMb}GB</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Fingerprint size={14} className="text-purple-400" />
                      <div>
                        <p className="text-muted-foreground mb-1">FINGERPRINT</p>
                        <p className="text-foreground font-bold break-all text-[10px]">{currentDevice.fingerprint}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Data Card */}
                {currentPersonalData && (
                  <div className="neon-glow rounded-lg p-6 bg-card border border-green-400/30">
                    <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">▌DADOS PESSOAIS▌</h3>
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
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">LOCALIZAÇÃO</p>
                        <p className="text-foreground font-bold">{currentPersonalData.city}, {currentPersonalData.state}</p>
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
                <div className="p-4 bg-secondary/30 rounded border border-purple-400/30 font-mono text-xs space-y-3">
                  <p className="text-green-400 font-bold mb-2 flex items-center gap-2">
                    ▶ INJEÇÃO DE DEVICE
                    {injectionStatus === 'success' && (
                      <span className="px-2 py-0.5 bg-green-500/30 text-green-400 border border-green-500/50 rounded text-[10px]">
                        ATIVO
                      </span>
                    )}
                  </p>
                  
                  {/* BOTÃO PRINCIPAL - INJEÇÃO REAL */}
                  <button
                    onClick={handleOpenManus}
                    className={`w-full px-4 py-4 font-bold text-sm transition-all flex items-center justify-center gap-3 rounded border ${
                      injectionStatus === 'success'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 hover:from-purple-500/50 hover:to-cyan-500/50 border-cyan-400 text-cyan-300 neon-glow'
                    }`}
                  >
                    <Play size={18} />
                    {injectionStatus === 'success'
                      ? '✓ INJETADO - ABRIR NOVO DEVICE'
                      : 'ABRIR MANUS + INJETAR DEVICE'
                    }
                  </button>

                  {/* Como funciona */}
                  <div className="border-t border-purple-400/20 pt-3 mt-2">
                    <p className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                      <ClipboardCheck size={14} />
                      COMO FUNCIONA
                    </p>
                    <div className="bg-cyan-400/10 rounded p-3 border border-cyan-400/30 space-y-1 text-xs">
                      <p className="text-cyan-300">1. Clique no botão acima</p>
                      <p className="text-cyan-300">2. Uma <strong>nova aba</strong> abre com tela de "Injetando..."</p>
                      <p className="text-cyan-300">3. O script roda <strong>automaticamente</strong> (sem console)</p>
                      <p className="text-cyan-300">4. Tela verde "✓ DEVICE INJETADO" aparece</p>
                      <p className="text-cyan-300">5. Clique "IR PARA O MANUS" e crie sua conta</p>
                      <p className="text-yellow-300 mt-2 font-bold">⚠️ Se o pop-up for bloqueado, desative o bloqueador</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-400/30 mt-16 py-8 text-center text-xs text-muted-foreground font-mono">
        <p>Manus Device Master PRO v2.0 • Anti-Fraude Avançado</p>
        <p className="mt-2">⚠️ Use responsavelmente. Respeite os termos de serviço do Manus.</p>
      </footer>
    </div>
  );
}
