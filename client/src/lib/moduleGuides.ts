// Field Manual: catálogo editorial dos oito módulos. Este arquivo mantém a documentação separada da lógica operacional.
export type GuideField = { label: string; meaning: string };

export type ModuleGuide = {
  key: string;
  title: string;
  mission: string;
  scope: string;
  family: string;
  fields: GuideField[];
  recommendedFlow: string[];
  whyDifferent: string;
  limitations: string;
};

export const MODULE_GUIDES: Record<string, ModuleGuide> = {
  aliexpress: {
    key: 'aliexpress', title: 'AliExpress Master', family: 'Hardware e sessão',
    mission: 'Gerar um perfil técnico para o fluxo do módulo AliExpress e explicar quais sinais de dispositivo são preparados.',
    scope: 'Este menu prioriza dados técnicos; não é um gerador de identidade civil completa.',
    fields: [
      { label: 'MAC', meaning: 'Identificador de rede exibido no perfil técnico.' },
      { label: 'IMEI', meaning: 'Identificador de hardware móvel gerado para o perfil.' },
      { label: 'Fingerprint', meaning: 'Assinatura técnica usada para agrupar sinais do navegador e do dispositivo.' },
      { label: 'Resolução', meaning: 'Dimensão de tela associada ao perfil escolhido.' },
    ],
    recommendedFlow: ['Leia o escopo do módulo.', 'Gere um perfil novo.', 'Revise os campos técnicos.', 'Use o fluxo de abertura disponível no menu.'],
    whyDifferent: 'CPF, endereço e outros dados de persona não aparecem porque este módulo foi desenhado como perfil técnico, não como cadastro pessoal.',
    limitations: 'A tela documenta o que o código prepara; ela não garante que um serviço externo aceitará ou manterá esses valores.',
  },
  facebook: {
    key: 'facebook', title: 'Facebook Device Manager', family: 'Hardware e sessão',
    mission: 'Organizar a geração do perfil técnico usado pelo fluxo do Facebook, com leitura clara dos sinais mostrados.',
    scope: 'O módulo é centrado em hardware e navegador. Dados pessoais não fazem parte do cartão técnico padrão.',
    fields: [
      { label: 'Dispositivo', meaning: 'Modelo e fabricante escolhidos para compor o perfil.' },
      { label: 'MAC', meaning: 'Identificador de rede apresentado no perfil.' },
      { label: 'IMEI', meaning: 'Identificador móvel associado ao dispositivo gerado.' },
      { label: 'User-Agent', meaning: 'Texto que descreve navegador, sistema e modelo para o contexto da sessão.' },
    ],
    recommendedFlow: ['Confira a finalidade do módulo.', 'Gere o dispositivo.', 'Leia os identificadores exibidos.', 'Siga o botão de abertura/injeção apenas quando entender o fluxo.'],
    whyDifferent: 'Nome, telefone, CPF e endereço não são exibidos porque o schema atual é device-only.',
    limitations: 'A presença de um campo na interface não comprova aceitação por plataformas de terceiros.',
  },
  instagram: {
    key: 'instagram', title: 'Instagram Device Manager', family: 'Hardware e sessão',
    mission: 'Gerar e apresentar os sinais técnicos usados pelo fluxo do Instagram.',
    scope: 'Este menu mostra hardware, fingerprint e navegador; ele não representa uma ficha cadastral completa.',
    fields: [
      { label: 'Dispositivo', meaning: 'Modelo, fabricante e versão de sistema do perfil.' },
      { label: 'MAC', meaning: 'Identificador de rede exibido para conferência.' },
      { label: 'IMEI', meaning: 'Identificador móvel do perfil gerado.' },
      { label: 'User-Agent', meaning: 'Identidade textual do navegador e sistema informada ao contexto local.' },
    ],
    recommendedFlow: ['Leia o escopo.', 'Gere o dispositivo.', 'Confirme o modelo e os identificadores.', 'Use a ação de abertura disponível.'],
    whyDifferent: 'Dados civis e de recuperação não aparecem porque o módulo não usa o gerador de persona completa.',
    limitations: 'O guia explica o comportamento local da aplicação e não promete resultado em um site externo.',
  },
  email: {
    key: 'email', title: 'Email Master', family: 'Credenciais de email',
    mission: 'Gerar endereços e credenciais de email com opções de provedor, país e formato.',
    scope: 'Este é um gerenciador de email e histórico local; não é um emulador de hardware móvel.',
    fields: [
      { label: 'Provedor', meaning: 'Define o serviço/domínio base usado no endereço.' },
      { label: 'País', meaning: 'Ajuda a escolher o padrão regional do endereço.' },
      { label: 'Tipo de email', meaning: 'Controla a composição do nome e dos números.' },
      { label: 'Contas salvas', meaning: 'Lista os registros que foram mantidos no armazenamento local.' },
    ],
    recommendedFlow: ['Escolha o provedor.', 'Selecione país e formato.', 'Gere o email.', 'Copie ou salve a credencial conforme o fluxo do menu.'],
    whyDifferent: 'MAC, IMEI, resolução e fingerprint não são exibidos porque o objetivo é credencial, não dispositivo.',
    limitations: 'O armazenamento local depende do navegador atual e não substitui uma conta real do provedor.',
  },
  manus: {
    key: 'manus', title: 'Manus AI Master', family: 'Hardware + persona',
    mission: 'Combinar um perfil de dispositivo com dados de persona usados pelo fluxo do Manus.',
    scope: 'Este módulo é mais amplo: pode mostrar hardware, identidade e contexto de conta no mesmo perfil.',
    fields: [
      { label: 'Hardware', meaning: 'Modelo, MAC, IMEI, resolução e fingerprint do dispositivo.' },
      { label: 'Persona', meaning: 'Nome, email, telefone, data e outros campos pessoais do perfil.' },
      { label: 'Status', meaning: 'Indica o estado local do fluxo de preparação ou abertura.' },
      { label: 'Convite', meaning: 'Campo opcional para o link informado pelo usuário.' },
    ],
    recommendedFlow: ['Leia o resumo do perfil.', 'Gere o dispositivo e a persona.', 'Revise campos técnicos e pessoais.', 'Use o fluxo do menu mantendo os dados documentados.'],
    whyDifferent: 'Este menu mostra mais dados porque seu schema combina device profile e personal profile.',
    limitations: 'Dados pessoais devem ser tratados com responsabilidade; a interface não valida identidade real nem garante aceitação externa.',
  },
  tiktok: {
    key: 'tiktok', title: 'TikTok Device Master', family: 'Hardware + persona',
    mission: 'Gerar um perfil técnico e um conjunto de dados pessoais compatível com o fluxo do TikTok.',
    scope: 'O módulo combina sinais de dispositivo com uma persona parcial, por isso sua tela é mais rica que os módulos device-only.',
    fields: [
      { label: 'Modelo', meaning: 'Dispositivo e fabricante selecionados no gerador específico do TikTok.' },
      { label: 'IMEI/MAC', meaning: 'Identificadores técnicos mostrados para inspeção do perfil.' },
      { label: 'Persona', meaning: 'Dados pessoais associados ao perfil, quando o gerador fornece esses campos.' },
      { label: 'Fingerprint', meaning: 'Assinatura técnica do perfil de navegador/dispositivo.' },
    ],
    recommendedFlow: ['Leia o escopo.', 'Gere o perfil.', 'Revise hardware e persona.', 'Siga o fluxo operacional do menu apenas após a conferência.'],
    whyDifferent: 'O TikTok usa um gerador específico, com conjunto próprio de campos; por isso ele não é idêntico ao Facebook ou ao Gmail.',
    limitations: 'A implementação local não controla políticas, verificações ou decisões de uma plataforma externa.',
  },
  claude: {
    key: 'claude', title: 'Claude AI Master', family: 'Sessão e contexto',
    mission: 'Organizar uma sessão de uso com credenciais e contexto técnico necessários ao fluxo do módulo Claude.',
    scope: 'O foco está em sessão, rede e contexto de navegação, não em um inventário completo de hardware.',
    fields: [
      { label: 'Email', meaning: 'Identifica a conta informada para a sessão.' },
      { label: 'Senha', meaning: 'Credencial exibida no perfil local; trate-a como dado sensível.' },
      { label: 'IP/Timezone', meaning: 'Contexto de rede e localização temporal associado à sessão.' },
      { label: 'Session ID', meaning: 'Identificador da sessão gerada pelo módulo.' },
    ],
    recommendedFlow: ['Leia o contexto do módulo.', 'Gere uma sessão.', 'Confira credenciais e contexto.', 'Use o botão de abertura do menu com cautela.'],
    whyDifferent: 'CPF, endereço, MAC e IMEI podem não aparecer porque a finalidade principal é sessão e contexto, não persona civil ou hardware completo.',
    limitations: 'Credenciais são sensíveis e não devem ser compartilhadas. A aplicação não garante autenticação ou permanência de uma sessão externa.',
  },
  gmail: {
    key: 'gmail', title: 'Gmail Master', family: 'Conta e recuperação',
    mission: 'Gerenciar um perfil de conta Google com credenciais, recuperação e contexto de sessão.',
    scope: 'Este menu enfatiza a conta e os dados de recuperação; não deve ser comparado campo a campo com um gerador de hardware.',
    fields: [
      { label: 'Gmail principal', meaning: 'Endereço principal da conta gerada ou selecionada.' },
      { label: 'Email/telefone de recuperação', meaning: 'Canais auxiliares associados ao perfil de recuperação.' },
      { label: 'Data de nascimento', meaning: 'Campo de persona exibido para o contexto da conta.' },
      { label: 'IP/Timezone', meaning: 'Contexto de rede e fuso horário atribuído ao perfil.' },
    ],
    recommendedFlow: ['Leia o escopo de conta.', 'Gere o perfil.', 'Revise os dados de recuperação.', 'Use a ação do menu somente após validar o que será exibido.'],
    whyDifferent: 'A interface exibe recuperação e conta porque esse é o objetivo do módulo; outros dados técnicos podem permanecer fora do cartão resumido.',
    limitations: 'Senhas, emails e telefones são dados sensíveis. O módulo local não substitui as verificações e políticas do provedor.',
  },
};
