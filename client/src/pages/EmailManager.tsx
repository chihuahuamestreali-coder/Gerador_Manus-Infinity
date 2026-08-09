import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * Email Manager Page - Gerenciador de Emails
 * Design: Cyberpunk Industrial
 */

import { useState, useEffect } from 'react';
import { EMAIL_PROVIDERS, COUNTRIES, generateSignupUrl, generateRandomEmail, generateEmailWithBirthday, generateEmailWithNameAndBirthday, generateMicrosoftPassword, EmailAccount } from '@/lib/emailManager';
import { Button } from '@/components/ui/button';
import { Mail, Globe, Copy, ExternalLink, Plus, Trash2, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function EmailManager() {
  const [, setLocation] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState(EMAIL_PROVIDERS[0]);
  
  // Brasil é o país padrão (encontra Brasil na lista)
  const brasilCountry = COUNTRIES.find(c => c.id === 'br') || COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState(brasilCountry);
  const [selectedDomain, setSelectedDomain] = useState(brasilCountry.defaultDomain);
  
  const [emailType, setEmailType] = useState<'name' | 'birthday' | 'combined'>('name');
  const [generatedEmail, setGeneratedEmail] = useState(generateRandomEmail());
  const [generatedPassword, setGeneratedPassword] = useState(generateMicrosoftPassword());
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Carrega contas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('email_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEmailAccounts(parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
        })));
      } catch (e) {
        console.error('Erro ao carregar contas:', e);
      }
    }
  }, []);

  // Salva contas no localStorage
  useEffect(() => {
    localStorage.setItem('email_accounts', JSON.stringify(emailAccounts));
  }, [emailAccounts]);

  // Atualiza domínios quando provedor muda
  useEffect(() => {
    if (selectedProvider.id === 'outlook' || selectedProvider.id === 'hotmail') {
      if (!selectedProvider.domains.includes(selectedDomain)) {
        setSelectedDomain(selectedProvider.domains[0]);
      }
    } else {
      setSelectedDomain(selectedProvider.domains[0]);
    }
  }, [selectedProvider]);

  // Regenera email e senha quando o tipo muda
  useEffect(() => {
    handleGenerateNewEmail();
  }, [emailType]);

  const handleGenerateNewEmail = () => {
    let email = '';
    switch (emailType) {
      case 'name':
        email = generateRandomEmail();
        break;
      case 'birthday':
        email = generateEmailWithBirthday();
        break;
      case 'combined':
        email = generateEmailWithNameAndBirthday();
        break;
    }
    setGeneratedEmail(email);
    setGeneratedPassword(generateMicrosoftPassword());
  };

  const handleCopyEmail = () => {
    const fullEmail = `${generatedEmail}@${selectedDomain}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Email copiado!', {
      description: fullEmail,
    });
  };

  const handleCopyEmailWithPassword = () => {
    const fullEmail = `${generatedEmail}@${selectedDomain}`;
    const emailWithPassword = `${fullEmail}\n\n${generatedPassword}`;
    navigator.clipboard.writeText(emailWithPassword);
    toast.success('Email e senha copiados!', {
      description: `${fullEmail}\n\n${generatedPassword}`,
    });
  };

  const handleRegeneratePassword = () => {
    setGeneratedPassword(generateMicrosoftPassword());
    toast.success('Senha regenerada!');
  };

  const handleOpenSignup = () => {
    const url = generateSignupUrl(selectedProvider, selectedDomain);
    window.open(url, '_blank');
    toast.success('Abrindo página de signup...', {
      description: `${selectedProvider.name} - ${selectedDomain}`,
    });
  };

  const handleAddAccount = () => {
    if (!newEmail.trim()) {
      toast.error('Email vazio', {
        description: 'Digite um email válido',
      });
      return;
    }

    const account: EmailAccount = {
      id: `${Date.now()}`,
      email: newEmail,
      provider: selectedProvider.id,
      country: selectedCountry.id,
      domain: selectedDomain,
      createdAt: new Date(),
      password: generatedPassword,
      status: 'created',
    };

    setEmailAccounts([...emailAccounts, account]);
    setNewEmail('');
    setShowAddForm(false);
    toast.success('Conta adicionada!', {
      description: newEmail,
    });
  };

  const handleDeleteAccount = (id: string) => {
    setEmailAccounts(emailAccounts.filter(a => a.id !== id));
    toast.success('Conta removida');
  };

  const handleCopyAccountEmailPassword = (account: EmailAccount) => {
    const text = `${account.email}\n\n${account.password || 'Sem senha'}`;
    navigator.clipboard.writeText(text);
    toast.success('Email e senha copiados!', {
      description: text,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
        <ModuleGuide guide={MODULE_GUIDES['email']} accentClass="text-cyan-300" />
      {/* Header */}
      <div className="border-b border-cyan-400/30 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="text-cyan-400" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400 font-mono">EMAIL MASTER</h1>
              <p className="text-xs text-muted-foreground font-mono">Gerenciador de Emails • v1.1</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 rounded transition-colors font-bold text-sm"
            >
              <Zap size={16} /> DEVICE MASTER
            </button>
            <div className="text-right">
              <p className="text-cyan-400 font-bold font-mono">{emailAccounts.length}</p>
              <p className="text-xs text-muted-foreground font-mono">Contas</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Provider Selection */}
              <div className="border border-cyan-400/30 rounded-lg p-4 bg-card">
                <label className="text-xs font-bold text-cyan-400 font-mono mb-2 block">PROVEDOR</label>
                <select
                  value={selectedProvider.id}
                  onChange={(e) => {
                    const provider = EMAIL_PROVIDERS.find(p => p.id === e.target.value);
                    if (provider) setSelectedProvider(provider);
                  }}
                  className="w-full px-3 py-2 bg-secondary border border-cyan-400/30 rounded text-foreground font-mono text-sm"
                >
                  {EMAIL_PROVIDERS.map(provider => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>

              {/* Country Selection */}
              <div className="border border-cyan-400/30 rounded-lg p-4 bg-card">
                <label className="text-xs font-bold text-cyan-400 font-mono mb-2 block">PAÍS</label>
                <select
                  value={selectedCountry.id}
                  onChange={(e) => {
                    const country = COUNTRIES.find(c => c.id === e.target.value);
                    if (country) {
                      setSelectedCountry(country);
                      setSelectedDomain(country.defaultDomain);
                    }
                  }}
                  className="w-full px-3 py-2 bg-secondary border border-cyan-400/30 rounded text-foreground font-mono text-sm"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* Domain Selection */}
              {(selectedProvider.id === 'outlook' || selectedProvider.id === 'hotmail') && (
                <div className="border border-cyan-400/30 rounded-lg p-4 bg-card">
                  <label className="text-xs font-bold text-cyan-400 font-mono mb-2 block">DOMÍNIO</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-cyan-400/30 rounded text-foreground font-mono text-sm"
                  >
                    {selectedProvider.domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email Type Selection */}
              <div className="border border-cyan-400/30 rounded-lg p-4 bg-card">
                <label className="text-xs font-bold text-cyan-400 font-mono mb-2 block">TIPO DE EMAIL</label>
                <div className="space-y-2">
                  {[
                    { value: 'name', label: 'Nome + Números' },
                    { value: 'birthday', label: 'Data de Nascimento' },
                    { value: 'combined', label: 'Nome + Data' },
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="emailType"
                        value={type.value}
                        checked={emailType === type.value}
                        onChange={(e) => setEmailType(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-mono">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generated Email */}
              <div className="border-2 border-cyan-400 rounded-lg p-4 bg-secondary/50">
                <p className="text-xs text-cyan-400 font-mono mb-2">EMAIL GERADO</p>
                <p className="text-lg font-bold text-cyan-300 font-mono break-all mb-2">
                  {generatedEmail}@{selectedDomain}
                </p>
                <p className="text-xs text-muted-foreground font-mono mb-3">SENHA GERADA (copiada ao adicionar conta)</p>
                <p className="text-lg font-bold text-green-400 font-mono break-all mb-4">
                  {generatedPassword}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateNewEmail}
                    className="flex-1 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 rounded transition-colors font-bold text-xs"
                  >
                    <Zap size={14} className="inline mr-1" /> GERAR
                  </button>
                  <button
                    onClick={handleRegeneratePassword}
                    className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded transition-colors font-bold text-xs"
                  >
                    <RefreshCw size={14} className="inline mr-1" /> SENHA
                  </button>
                </div>
              </div>

              {/* Copy Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCopyEmail}
                  className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 rounded transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> COPIAR EMAIL
                </button>
                <button
                  onClick={handleCopyEmailWithPassword}
                  className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> EMAIL + SENHA
                </button>
                <button
                  onClick={handleOpenSignup}
                  className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 rounded transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} /> ABRIR SIGNUP
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Accounts List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-cyan-400 font-mono">CONTAS SALVAS</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 rounded transition-colors font-bold text-sm flex items-center gap-2"
              >
                <Plus size={16} /> ADICIONAR
              </button>
            </div>

            {showAddForm && (
              <div className="border border-cyan-400/30 rounded-lg p-4 bg-card mb-4">
                <input
                  type="text"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Digite o email"
                  className="w-full px-3 py-2 bg-secondary border border-cyan-400/30 rounded text-foreground font-mono text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAccount}
                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded transition-colors font-bold text-sm"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded transition-colors font-bold text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {emailAccounts.length === 0 ? (
              <div className="border border-cyan-400/30 rounded-lg p-12 bg-card text-center">
                <Mail size={48} className="mx-auto mb-4 text-cyan-400/50" />
                <p className="text-muted-foreground font-mono">Nenhuma conta salva</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emailAccounts.map(account => (
                  <div key={account.id} className="border border-cyan-400/30 rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-cyan-400 font-mono break-all">{account.email}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          {account.provider} • {account.domain}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="px-3 py-1 text-red-400 hover:bg-red-500/20 rounded transition-colors font-bold text-xs"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {account.password && (
                      <p className="text-sm text-green-400 font-mono mb-3 break-all">
                        Senha: {account.password}
                      </p>
                    )}
                    <p className="text-xs text-emerald-400 font-mono mb-3">
                      ✓ Status: {account.status === 'created' ? 'Criada' : account.status || 'Ativa'} • Dados persistidos em localStorage
                    </p>
                    <button
                      onClick={() => handleCopyAccountEmailPassword(account)}
                      className="w-full px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 rounded transition-colors font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> COPIAR EMAIL + SENHA
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
