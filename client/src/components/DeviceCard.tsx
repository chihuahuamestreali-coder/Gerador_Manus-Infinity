/**
 * Device Card Component - Exibe perfil de dispositivo com estilo Cyberpunk
 * Design: Bordas neon luminosas, efeitos de glow, tipografia monoespacial
 */

import { DeviceProfile, addAccountToProfile } from '@/lib/deviceGenerator';
import { Copy, Download, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeviceCardProps {
  profile: DeviceProfile;
  onDelete?: (id: string) => void;
  onUpdate?: (profile: DeviceProfile) => void;
}

export function DeviceCard({ profile, onDelete, onUpdate }: DeviceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`, {
      description: text.substring(0, 30) + '...',
    });
  };

  const handleAddAccount = () => {
    if (!newEmail.trim()) {
      toast.error('Email inválido');
      return;
    }
    
    const updatedProfile = { ...profile };
    addAccountToProfile(updatedProfile, newEmail);
    onUpdate?.(updatedProfile);
    setNewEmail('');
    setShowAddAccount(false);
    toast.success('Conta adicionada!');
  };

  const handleDeleteAccount = (accountId: string) => {
    const updatedProfile = {
      ...profile,
      accounts: profile.accounts.filter(acc => acc.id !== accountId),
    };
    onUpdate?.(updatedProfile);
    toast.success('Conta removida');
  };

  const downloadProfile = () => {
    const json = JSON.stringify(profile, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device_${profile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Perfil baixado!');
  };

  return (
    <div className="neon-glow rounded-lg p-6 bg-card text-card-foreground transition-all duration-300 hover:scale-105">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cyan-400 mb-1 font-mono">
            {profile.deviceName}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">
            {profile.manufacturer} • {profile.model}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-400 hover:text-magenta-500 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="bg-secondary/50 rounded p-2 border border-cyan-400/30">
          <p className="text-muted-foreground text-xs font-mono">Resolução</p>
          <p className="text-cyan-400 font-mono font-bold">{profile.resolution}</p>
        </div>
        <div className="bg-secondary/50 rounded p-2 border border-cyan-400/30">
          <p className="text-muted-foreground text-xs font-mono">RAM</p>
          <p className="text-cyan-400 font-mono font-bold">{profile.ramMb}GB</p>
        </div>
        <div className="bg-secondary/50 rounded p-2 border border-cyan-400/30">
          <p className="text-muted-foreground text-xs font-mono">CPU Cores</p>
          <p className="text-cyan-400 font-mono font-bold">{profile.cpuCores}</p>
        </div>
        <div className="bg-secondary/50 rounded p-2 border border-cyan-400/30">
          <p className="text-muted-foreground text-xs font-mono">Contas</p>
          <p className="text-green-400 font-mono font-bold">{profile.accounts.length}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => copyToClipboard(profile.macAddress, 'MAC')}
          className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-accent text-accent-foreground rounded text-xs font-mono transition-colors"
          title="Copiar MAC Address"
        >
          <Copy size={14} /> MAC
        </button>
        <button
          onClick={() => copyToClipboard(profile.imei, 'IMEI')}
          className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-accent text-accent-foreground rounded text-xs font-mono transition-colors"
          title="Copiar IMEI"
        >
          <Copy size={14} /> IMEI
        </button>
        <button
          onClick={() => copyToClipboard(profile.fingerprint, 'Fingerprint')}
          className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-accent text-accent-foreground rounded text-xs font-mono transition-colors"
          title="Copiar Fingerprint"
        >
          <Copy size={14} /> FP
        </button>
        <button
          onClick={downloadProfile}
          className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary-foreground text-secondary-foreground hover:text-secondary rounded text-xs font-mono transition-colors"
          title="Baixar perfil como JSON"
        >
          <Download size={14} /> JSON
        </button>
        <button
          onClick={() => onDelete?.(profile.id)}
          className="flex items-center gap-2 px-3 py-2 bg-destructive/20 hover:bg-destructive text-destructive hover:text-destructive-foreground rounded text-xs font-mono transition-colors ml-auto"
          title="Deletar dispositivo"
        >
          <Trash2 size={14} /> DEL
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-cyan-400/30 pt-4 mt-4 space-y-3">
          {/* Technical Details */}
          <div className="space-y-2">
            <h4 className="text-cyan-400 font-mono font-bold text-sm">ESPECIFICAÇÕES</h4>
            
            <div className="bg-secondary/30 rounded p-3 border border-cyan-400/20 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">MAC Address:</span>
                <span className="text-cyan-400 font-bold">{profile.macAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IMEI:</span>
                <span className="text-cyan-400 font-bold">{profile.imei}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Android ID:</span>
                <span className="text-cyan-400 font-bold">{profile.androidId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fingerprint:</span>
                <span className="text-green-400 font-bold">{profile.fingerprint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build:</span>
                <span className="text-cyan-400 font-bold">{profile.buildVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Patch:</span>
                <span className="text-cyan-400 font-bold">{profile.securityPatch}</span>
              </div>
            </div>
          </div>

          {/* User Agent */}
          <div>
            <h4 className="text-cyan-400 font-mono font-bold text-sm mb-2">USER-AGENT</h4>
            <div className="bg-secondary/30 rounded p-3 border border-cyan-400/20">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {profile.userAgent}
              </p>
            </div>
          </div>

          {/* Accounts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-cyan-400 font-mono font-bold text-sm">CONTAS ({profile.accounts.length})</h4>
              <button
                onClick={() => setShowAddAccount(!showAddAccount)}
                className="flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-secondary-foreground text-secondary-foreground hover:text-secondary rounded text-xs font-mono transition-colors"
              >
                <Plus size={12} /> Adicionar
              </button>
            </div>

            {showAddAccount && (
              <div className="bg-secondary/30 rounded p-3 border border-cyan-400/20 mb-3 flex gap-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAccount()}
                  className="flex-1 bg-input text-foreground rounded px-2 py-1 text-xs font-mono border border-cyan-400/30 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleAddAccount}
                  className="px-3 py-1 bg-green-400/20 hover:bg-green-400/40 text-green-400 rounded text-xs font-mono transition-colors"
                >
                  OK
                </button>
              </div>
            )}

            {profile.accounts.length > 0 ? (
              <div className="space-y-2">
                {profile.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-secondary/30 rounded p-2 border border-cyan-400/20 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex-1">
                      <p className="text-foreground">{account.email}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(account.createdAt).toLocaleDateString('pt-BR')} • {account.status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-destructive hover:text-destructive-foreground transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-xs font-mono italic">Nenhuma conta registrada</p>
            )}
          </div>

          {/* Created Date */}
          <p className="text-xs text-muted-foreground font-mono">
            Criado em: {new Date(profile.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  );
}
