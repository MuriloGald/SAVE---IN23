/* ===================================================================
   SAVE Regularização — App Principal
   IN 23/2026 · IN 05 · NBR 17019
   =================================================================== */

// ─── Estado Global ────────────────────────────────────────────────
const APP = {
  currentView: 'landing',      // 'landing' | 'study' | 'checklist'
  currentSection: 0,
  answers: {},                  // { questionId: value }
  sectionStatus: {},            // { sectionId: 'not-visited'|'incomplete'|'complete' }
  conditionalCache: {},
};

// ─── Dados do Guia de Estudos ─────────────────────────────────────
const STUDY_MODULES = [
  {
    id: 'mod1',
    number: '01',
    title: 'Enquadramento Geral e Caminhos de Regularização',
    ref: 'Art. 1º ao 5º',
    topics: [
      {
        title: 'O que é o SAVE e para quem vale a IN 23?',
        text: 'O <strong>Sistema de Alimentação de Veículos Elétricos (SAVE)</strong> compreende toda a infraestrutura fixa destinada à recarga de veículos elétricos: estações de recarga, circuitos dedicados, quadros de proteção e dispositivos de comando. A IN 23 se aplica a <em>qualquer edificação</em> que possua pontos de recarga — seja ela nova, recente ou preexistente, em ambientes fechados, cobertos ou ao ar livre.',
        highlight: null,
      },
      {
        title: 'Classificação da Edificação',
        text: 'A norma diferencia:<br>• <strong>Edificação Preexistente (IN 23, Art. 3º, III):</strong> Aquela concluída ou com PPCI aprovado antes da vigência da IN 23 (25/06/2026). Possui direito ao prazo de 2 anos para regularização e facilidades de dispensa.<br>• <strong>Edificação Existente (IN 05):</strong> Concluída até 11/11/2013. Admite medidas compensatórias e adaptações simplificadas.<br>• <strong>Edificação Recente (IN 05):</strong> Concluída após 11/11/2013. Deve atender padrões mais próximos das normas vigentes.',
        highlight: 'A classificação correta determina quais facilidades e adaptações são permitidas. Errar aqui pode significar exigir obras desnecessárias do condomínio.',
      },
      {
        title: 'Os Dois Caminhos: Requisitos Gerais vs. PBD',
        text: 'O <strong>Art. 5º</strong> divide as exigências em duas categorias:<br><br>1. <strong>Requisitos Gerais (Art. 7º ao 18º)</strong> — Obrigatórios para TODOS os locais com SAVE, sem exceção. Incluem instalação elétrica, desligamento de emergência, sinalização, afastamentos e resistência estrutural.<br><br>2. <strong>Projeto Baseado em Desempenho — PBD (Art. 19º ao 37º)</strong> — Exigido SOMENTE quando o local NÃO se enquadra nas dispensas do Art. 6º. Envolve simulações computacionais de incêndio (CFD) e estudos de evacuação.',
        highlight: null,
      },
      {
        title: 'Triagem Inicial do Cliente',
        text: 'Na primeira conversa com o cliente, você precisa coletar 4 informações-chave:<br>1. <strong>Data de conclusão da obra</strong> (define se é preexistente/existente/recente)<br>2. <strong>Tipo do local</strong> (descoberto, coberto com ventilação, fechado)<br>3. <strong>Área do pavimento da garagem</strong> (limites de 750 m² e 1.500 m²)<br>4. <strong>Número de rotas de fuga</strong> (impacta diretamente a regra dos 5 metros)',
        highlight: null,
      },
    ],
  },
  {
    id: 'mod2',
    number: '02',
    title: 'Dispensa de PBD — Anexo B (Art. 6º)',
    ref: 'Art. 6º e seus incisos e parágrafos',
    topics: [
      {
        title: 'Quando o condomínio NÃO precisa de PBD?',
        text: 'O <strong>Art. 6º</strong> lista 6 hipóteses de dispensa do Projeto Baseado em Desempenho. Se o local se enquadrar em qualquer uma delas, basta apresentar o <strong>Anexo B</strong> (Relatório de Dispensa) com a ART/DRT do Responsável Técnico.',
        highlight: 'A dispensa de PBD NÃO dispensa os Requisitos Gerais (Art. 7º ao 18º). O botão de emergência, a sinalização e os afastamentos continuam obrigatórios!',
      },
      {
        title: 'Inciso I — Locais Descobertos ou com Cobertura Leve',
        text: 'Vagas ao ar livre ou cobertas apenas por estrutura leve (telhas de fibrocimento, metálicas ou similares sem fechamento lateral significativo) são <strong>automaticamente dispensadas</strong> de PBD.<br><br><strong>Cobertura leve (Art. 3º):</strong> Cobertura simples, sem função de compartimentação, que permite a dissipação natural do calor e da fumaça.',
        highlight: null,
      },
      {
        title: 'Inciso III — Compartimentação + Detecção (Garagens Fechadas)',
        text: 'Garagens fechadas de edificações preexistentes podem ser dispensadas de PBD se possuírem <strong>cumulativamente</strong>:<br>1. <strong>Compartimentação</strong> do local do SAVE isolando-o das rotas de fuga e poços de elevadores.<br>2. <strong>Detecção automática</strong> de incêndio conforme IN 12 cobrindo a área do SAVE.',
        highlight: 'Se faltar qualquer um dos dois requisitos (compartimentação OU detecção), o condomínio não se enquadra neste inciso e precisará buscar outra dispensa ou fazer PBD completo.',
      },
      {
        title: 'Inciso VI — Ventilação Natural + Área ≤ 1.500 m² + Detecção',
        text: 'Locais com <strong>ventilação natural</strong> comprovada, área total ≤ 1.500 m² e sistema de detecção automática também são dispensados.<br><br><strong>Fórmula da Ventilação Natural (§ 1º):</strong><br>• Aberturas permanentes ≥ <strong>20% da área das fachadas externas</strong><br>• Comprimento total das aberturas ≥ <strong>40% do perímetro do pavimento</strong>',
        highlight: 'Se a área ultrapassar 1.500 m² mas houver compartimentação corta-fogo de 1 hora entre ambientes, cada ambiente conta individualmente (§ 5º).',
      },
      {
        title: 'Sprinklers Simplificados em Preexistentes (§ 2º)',
        text: 'Se o condomínio preexistente optar por instalar chuveiros automáticos (sprinklers) alimentados pela rede de hidrantes existente, a rede deve obrigatoriamente possuir:<br>1. <strong>Chave de fluxo</strong> interligada à central de alarme<br>2. <strong>Ponto de dreno e teste</strong> acessível<br>3. <strong>Manômetro</strong> visível',
        highlight: null,
      },
    ],
  },
  {
    id: 'mod3',
    number: '03',
    title: 'Requisitos Gerais de Segurança',
    ref: 'Art. 7º ao 18º',
    topics: [
      {
        title: 'Instalação Elétrica (Art. 7º)',
        text: 'Toda instalação elétrica do SAVE deve atender integralmente:<br>• <strong>NBR 5410</strong> — Instalações elétricas de baixa tensão<br>• <strong>NBR 17019</strong> — Requisitos específicos para recarga de VEs<br>• <strong>NBR 5419</strong> — Proteção contra descargas atmosféricas (SPDA)<br><br>Os carregadores devem possuir certificado de conformidade conforme <strong>NBR IEC 61851</strong>.',
        highlight: null,
      },
      {
        title: 'Modos de Recarga Permitidos (Art. 8º)',
        text: '<strong>Modo 1 — PROIBIDO.</strong> Conexão direta em tomada doméstica sem proteção dedicada.<br><strong>Modo 2 — Permitido apenas em áreas externas</strong>, com dispositivo de proteção no cabo.<br><strong>Modo 3 — Permitido</strong> sem restrições (estação de recarga fixa com comunicação).<br><strong>Modo 4 — Permitido</strong> sem restrições (recarga rápida em corrente contínua).',
        highlight: 'Se o condomínio usar Modo 1 (tomada comum), a irregularidade é automática e gravíssima. Esse é um dos achados mais frequentes em vistorias.',
      },
      {
        title: 'Botão de Desligamento de Emergência (Art. 9º)',
        text: '<strong>Regra Geral:</strong> Um único botão de desligamento por pavimento para todas as estações, a no máximo <strong>5 metros</strong> da escada ou acesso à garagem.<br><br><strong>Exceção para Preexistentes (§ 1º):</strong> Permite desligamento individual em cada estação (ou a 5m de cada carregador).<br><br><strong>Altura (§ 2º):</strong> Entre <strong>0,90 m e 1,35 m</strong> do piso acabado.',
        highlight: 'Este botão é OBRIGATÓRIO mesmo para locais dispensados de PBD (Art. 6º). Ele faz parte dos Requisitos Gerais.',
      },
      {
        title: 'Sinalização Fotoluminescente (Art. 10º)',
        text: 'Placa obrigatória com as seguintes características:<br>• <strong>Fundo vermelho</strong> com letras brancas maiúsculas<br>• Texto: <em>"VEÍCULOS ELÉTRICOS — EMERGÊNCIA — DESLIGUE OS CARREGADORES"</em><br>• Letras com no mínimo <strong>10 mm</strong> de altura<br>• Fixada a <strong>1,80 m</strong> do piso acabado<br>• Material <strong>fotoluminescente</strong>',
        highlight: null,
      },
      {
        title: 'Independência Elétrica (Art. 11º e 12º)',
        text: 'O circuito do SAVE deve ser <strong>eletricamente independente</strong>: desligar os carregadores NÃO pode afetar a iluminação de emergência, bombas de incêndio, central de alarme ou elevadores de emergência.',
        highlight: null,
      },
      {
        title: 'Regra dos 5 Metros e Barreiras Físicas (Art. 15º e 16º)',
        text: 'Se a edificação possuir <strong>apenas uma rota de saída de emergência</strong>:<br>• As vagas com SAVE devem estar a no mínimo <strong>5 metros</strong> de portas de escadas, elevadores ou saídas de emergência.<br><br><strong>Alternativa (§ 2º):</strong> Se os 5 metros forem impossíveis, o RT pode prever uma <strong>barreira física corta-fogo</strong> que impeça a propagação de calor e fumaça para a rota de fuga.',
        highlight: 'Em prédios com duas ou mais rotas de fuga, essa exigência de afastamento NÃO se aplica.',
      },
      {
        title: 'Resistência Estrutural ao Fogo (Art. 18º)',
        text: 'Os elementos estruturais próximos ao SAVE devem resistir à carga térmica de um incêndio veicular. A IN 23 (Art. 37º) define as Taxas de Liberação de Calor (HRR):<br>• <strong>8 MW</strong> — Veículo elétrico a bateria (BEV)<br>• <strong>6 MW</strong> — Híbrido plug-in (PHEV)<br>• <strong>5 MW</strong> — Veículo a combustão',
        highlight: 'O termo correto é "resistência ao fogo dos elementos estruturais para suportar a carga térmica de 8 MW", e não "resistência térmica de 8 MW".',
      },
    ],
  },
  {
    id: 'mod4',
    number: '04',
    title: 'PBD Completo — Anexo A',
    ref: 'Art. 19º ao 37º',
    topics: [
      {
        title: 'Quando o PBD é necessário?',
        text: 'O Projeto Baseado em Desempenho é exigido quando o local com SAVE <strong>não se enquadra em nenhuma das hipóteses de dispensa do Art. 6º</strong>. Exemplos típicos:<br>• Garagem subterrânea fechada, sem ventilação natural, sem compartimentação e sem sprinklers<br>• Área de estacionamento superior a 1.500 m² sem compartimentação entre ambientes',
        highlight: null,
      },
      {
        title: 'Conteúdo Obrigatório do PBD (Art. 20º)',
        text: 'O estudo de PBD deve conter:<br>1. Caracterização completa do local (geometria, materiais, ocupação)<br>2. Cenários de incêndio considerados<br>3. Simulação computacional (CFD ou modelo de zonas)<br>4. Análise de evacuação de pessoas<br>5. Proposição de medidas de segurança contra incêndio<br>6. Conclusão com parecer técnico',
        highlight: null,
      },
      {
        title: 'Cálculo de Evacuação (Art. 28º a 33º)',
        text: 'A equação fundamental: <strong>Fs × TNES < TDES</strong><br><br>Onde:<br>• <strong>Fs</strong> = Fator de segurança (≥ 1,5)<br>• <strong>TNES</strong> = Tempo Necessário para Evacuação Segura<br>• <strong>TDES</strong> = Tempo Disponível para Evacuação Segura (quando as condições se tornam insustentáveis)',
        highlight: 'Este tipo de estudo exige software especializado de simulação de incêndio (FDS, CFAST, Pathfinder) e profissional com experiência em engenharia de incêndio.',
      },
    ],
  },
  {
    id: 'mod5',
    number: '05',
    title: 'Tramitação no e-SCI e Crescimento Modular',
    ref: 'Art. 38º ao 40º',
    topics: [
      {
        title: 'O Prazo de 2 Anos (Art. 40º)',
        text: 'As edificações preexistentes que já possuam SAVE instalado têm <strong>2 anos</strong> a partir da vigência da IN 23 (25/06/2026) para promover a regularização junto ao CBMSC.',
        highlight: 'Prazo final: 25/06/2028. Após essa data, o condomínio estará irregular e sujeito a sanções.',
      },
      {
        title: 'Protocolo no e-SCI (Art. 38º)',
        text: 'A regularização é feita exclusivamente pelo sistema eletrônico <strong>e-SCI</strong> do CBMSC:<br>1. O RT protocola o Anexo A (PBD) ou Anexo B (Dispensa) com o DRT<br>2. O CBMSC analisa e emite parecer<br>3. Se aprovado, emite o certificado de regularização do SAVE',
        highlight: null,
      },
      {
        title: 'Instalação Faseada (Art. 39º)',
        text: 'Se o condomínio fizer um PBD (Anexo A) prevendo, por exemplo, 20 vagas com carregador, mas instalar apenas 2 no início:<br>• As próximas instalações podem ser regularizadas apenas com o <strong>Anexo B (Dispensa)</strong>, desde que dentro do limite aprovado no PBD original.<br><br>Isso permite crescimento modular sem refazer todo o estudo a cada nova vaga.',
        highlight: 'Excelente argumento comercial: o cliente investe uma vez no PBD completo e depois paga apenas Anexo B para cada expansão.',
      },
    ],
  },
  {
    id: 'mod6',
    number: '06',
    title: 'IN 05 — Edificações Existentes e Medidas Compensatórias',
    ref: 'IN 05/CBMSC',
    topics: [
      {
        title: 'Sem Efeito Dominó (Art. 4º, Parágrafo Único, III)',
        text: 'A IN 05 garante que adequar o SAVE às exigências da nova IN 23 <strong>NÃO obriga o condomínio a reformar o restante da edificação</strong>. A regularização do sistema de recarga é tratada como uma atualização pontual por nova norma técnica.',
        highlight: 'Use esta informação como argumento comercial: "A regularização dos carregadores NÃO vai gerar uma bola de neve de obras no prédio."',
      },
      {
        title: 'Medidas Compensatórias para Compartimentação',
        text: 'Se o prédio existente precisar de compartimentação para se enquadrar na dispensa de PBD, a IN 05 permite alternativas:<br>• <strong>Placas cimentícias</strong> ou divisórias de EPS/cimento<br>• <strong>Pinturas intumescentes</strong> na estrutura existente<br>• Se for fisicamente impossível compartimentar, o RT pode propor sprinklers simplificados ou controle de fumaça focado na garagem.',
        highlight: null,
      },
      {
        title: 'NBR 17019 — Requisitos Elétricos Detalhados',
        text: 'A NBR 17019 exige para a instalação elétrica do SAVE:<br>• <strong>Circuito exclusivo e dedicado</strong> (proibido uso de tomadas comuns ou extensões)<br>• <strong>DR Tipo A</strong> (mínimo) ou <strong>Tipo B/F</strong> para corrente contínua<br>• <strong>DPS</strong> (Proteção contra surtos)<br>• <strong>Disjuntor</strong> adequado à carga<br>• <strong>Aterramento</strong> e equipotencialização verificados<br>• <strong>Proteção mecânica</strong> dos cabos em garagens<br>• <strong>Certificação do carregador</strong> conforme NBR IEC 61851',
        highlight: null,
      },
    ],
  },
];

// ─── Dados do Checklist Inteligente ───────────────────────────────
const CHECKLIST_SECTIONS = [
  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 1 — IDENTIFICAÇÃO E CLASSIFICAÇÃO
  // ════════════════════════════════════════════════════════════════
  {
    id: 'identificacao',
    number: '01',
    title: 'Identificação e Classificação',
    description: 'Dados do imóvel, responsável técnico e classificação da edificação conforme IN 23 e IN 05.',
    questions: [
      { id: 'nome_edificacao', type: 'text', label: 'Nome da edificação', sublabel: null, required: true },
      { id: 'endereco', type: 'text', label: 'Endereço completo', sublabel: null, required: true },
      { id: 'responsavel_tecnico', type: 'text', label: 'Responsável Técnico (nome e CREA/CAU)', sublabel: null, required: true },
      { id: 'data_vistoria', type: 'date', label: 'Data da vistoria', sublabel: null, required: true },
      { id: 'data_conclusao_obra', type: 'date', label: 'Data de conclusão da obra ou aprovação do PPCI original', sublabel: 'IN 05, Art. 3º — Define a classificação como Existente, Recente ou Nova.', required: true },
      {
        id: 'classificacao_edificacao', type: 'select', label: 'Classificação da edificação',
        sublabel: 'IN 05 — Existente: concluída até 11/11/2013 · Recente: após 11/11/2013 · Nova: após IN 23',
        options: [
          { value: 'existente', label: 'Existente (concluída até 11/11/2013)' },
          { value: 'recente', label: 'Recente (concluída após 11/11/2013)' },
          { value: 'nova', label: 'Nova (projeto após vigência da IN 23)' },
        ],
        required: true,
      },
      {
        id: 'save_status', type: 'select', label: 'Status atual do SAVE',
        sublabel: 'IN 23, Art. 3º, III e Art. 40º',
        options: [
          { value: 'instalado', label: 'Já instalado (precisa regularizar)' },
          { value: 'planejamento', label: 'Em planejamento (nova instalação)' },
        ],
        required: true,
      },
      {
        id: 'tipo_local', type: 'select', label: 'Tipo do local onde o SAVE está ou será instalado',
        sublabel: 'IN 23, Art. 6º — Determina o enquadramento de dispensa de PBD.',
        options: [
          { value: 'descoberto', label: 'Descoberto (a céu aberto)' },
          { value: 'cobertura_leve', label: 'Coberto com cobertura leve (telha fibrocimento/metálica, sem fechamento lateral)' },
          { value: 'ventilacao_natural', label: 'Coberto/fechado COM ventilação natural permanente' },
          { value: 'fechado', label: 'Coberto/fechado SEM ventilação natural' },
        ],
        required: true,
      },
      { id: 'area_pavimento', type: 'number', label: 'Área total do pavimento do SAVE (m²)', sublabel: 'IN 23, Art. 6º, § 1º — Limites de 750 m² e 1.500 m².', required: true },
      { id: 'num_vagas_save', type: 'number', label: 'Quantidade de vagas com SAVE (existentes ou previstas)', sublabel: null, required: true },
      {
        id: 'num_rotas_fuga', type: 'select', label: 'Quantas rotas de saída de emergência a garagem possui?',
        sublabel: 'IN 23, Art. 15º — A regra de afastamento de 5 metros depende desta resposta.',
        options: [
          { value: 'uma', label: 'Uma única rota de saída' },
          { value: 'duas_ou_mais', label: 'Duas ou mais rotas de saída' },
        ],
        required: true,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 2 — LEVANTAMENTO DE INSTALAÇÕES EXISTENTES IRREGULARES
  // ════════════════════════════════════════════════════════════════
  {
    id: 'levantamento_irregular',
    number: '02',
    title: 'Levantamento de Instalações Existentes',
    description: 'Diagnóstico de carregadores já instalados por moradores sem acompanhamento técnico. Cenário típico: moradores que instalaram por conta própria, sem aprovação de assembleia ou projeto elétrico.',
    sectionCondition: { field: 'save_status', values: ['instalado'] },
    questions: [
      {
        id: 'irreg_titulo', type: 'heading',
        label: 'Situação Atual das Instalações no Condomínio',
        sublabel: 'Levantamento das instalações realizadas sem supervisão técnica ou aprovação condominial.',
      },
      {
        id: 'irreg_qtd_instalados', type: 'number',
        label: 'Quantos carregadores/pontos de recarga já estão instalados no condomínio?',
        sublabel: 'Incluir todos os pontos, mesmo os que estejam em desuso.',
        required: true,
      },
      {
        id: 'irreg_quem_instalou', type: 'select',
        label: 'Quem realizou a(s) instalação(ões)?',
        sublabel: 'Identificar se houve acompanhamento técnico qualificado.',
        options: [
          { value: 'morador_proprio', label: 'O próprio morador (instalação por conta)' },
          { value: 'eletricista_autonomo', label: 'Eletricista autônomo contratado pelo morador' },
          { value: 'empresa_especializada', label: 'Empresa especializada em recarga de VEs' },
          { value: 'misto', label: 'Misto (diferentes moradores fizeram de diferentes formas)' },
        ],
        required: true,
      },
      {
        id: 'irreg_art_emitida', type: 'yesno',
        label: 'Foi emitida ART (Anotação de Responsabilidade Técnica) para alguma das instalações?',
        sublabel: 'NBR 17019 — Instalação deve ser realizada por profissional habilitado com emissão de ART.',
      },
      {
        id: 'irreg_assembleia', type: 'select',
        label: 'Qual o status de aprovação pelo condomínio (assembleia)?',
        sublabel: 'Código Civil, Art. 1.341 e 1.342 — Alterações em área comum exigem aprovação.',
        options: [
          { value: 'aprovado', label: 'Aprovado em assembleia condominial' },
          { value: 'sem_aprovacao', label: 'Instalado SEM aprovação de assembleia' },
          { value: 'parcial', label: 'Parcialmente aprovado (apenas alguns moradores)' },
          { value: 'desconhecido', label: 'Síndico desconhece se houve deliberação' },
        ],
      },
      {
        id: 'irreg_sindico_ciente', type: 'yesno',
        label: 'O síndico estava ciente das instalações ANTES desta vistoria?',
        sublabel: 'Informação relevante para o relatório de diagnóstico.',
      },
      {
        id: 'irreg_titulo_conexao', type: 'heading',
        label: 'Diagnóstico Elétrico das Instalações Existentes',
        sublabel: 'Verificar como os moradores conectaram seus carregadores à rede elétrica.',
      },
      {
        id: 'irreg_tipo_conexao', type: 'select',
        label: 'Tipo predominante de conexão elétrica observado:',
        sublabel: 'IN 23, Art. 8º — Modo 1 (tomada doméstica) é PROIBIDO.',
        options: [
          { value: 'tomada_comum', label: 'Tomada doméstica comum (127V/220V) — MODO 1 PROIBIDO' },
          { value: 'tomada_industrial', label: 'Tomada industrial com proteção — Verificar modo' },
          { value: 'wallbox', label: 'Wallbox / Estação fixa (Modo 3)' },
          { value: 'misto', label: 'Misto (diferentes tipos entre os moradores)' },
        ],
        required: true,
      },
      {
        id: 'irreg_alerta_modo1', type: 'alert',
        label: '⛔ NÃO CONFORMIDADE CRÍTICA: Carregamento em tomada doméstica comum (Modo 1) é expressamente proibido pela IN 23. Todos os pontos nesta condição devem ser desativados imediatamente e substituídos por Modo 3 ou superior, com circuito dedicado.',
        condition: { field: 'irreg_tipo_conexao', values: ['tomada_comum'] },
      },
      {
        id: 'irreg_extensao', type: 'yesno',
        label: 'Foram observados extensões, adaptadores (benjamins) ou emendas nos cabos?',
        sublabel: 'NBR 17019 — Proibido expressamente. Risco de incêndio por sobrecarga e mau contato.',
      },
      {
        id: 'irreg_alerta_extensao', type: 'alert',
        label: '⛔ RISCO IMEDIATO DE INCÊNDIO: Extensões e adaptadores em circuitos de recarga de veículos elétricos representam risco grave. O cabo pode superaquecer e causar incêndio. Recomendação de desativação imediata.',
        condition: { field: 'irreg_extensao', values: ['sim'] },
      },
      {
        id: 'irreg_rota_cabos', type: 'select',
        label: 'Como os cabos estão passando pela garagem?',
        sublabel: 'NBR 17019 — Cabos devem ter proteção mecânica adequada em garagens.',
        options: [
          { value: 'expostos_chao', label: 'Expostos no chão (risco de dano mecânico)' },
          { value: 'expostos_parede', label: 'Fixados na parede/teto sem proteção' },
          { value: 'eletroduto', label: 'Em eletroduto ou canaleta' },
          { value: 'embutidos', label: 'Embutidos na parede' },
          { value: 'nao_verificado', label: 'Não foi possível verificar' },
        ],
      },
      {
        id: 'irreg_medicao_energia', type: 'select',
        label: 'Como está sendo feita a medição/cobrança de energia dos carregadores?',
        sublabel: 'Questão condominial frequente — impacta rateio e aprovação em assembleia.',
        options: [
          { value: 'medidor_individual', label: 'Medidor individual do morador (apartamento)' },
          { value: 'area_comum', label: 'Consumindo da área comum do condomínio (rateio)' },
          { value: 'submedicao', label: 'Submedição dedicada para recarga' },
          { value: 'desconhecido', label: 'Não foi possível identificar' },
        ],
      },
      {
        id: 'irreg_reclamacoes', type: 'yesno',
        label: 'Existem reclamações formais de outros condôminos sobre as instalações?',
        sublabel: 'Reclamações documentadas fortalecem a necessidade de regularização.',
      },
      {
        id: 'irreg_observacoes', type: 'textarea',
        label: 'Observações sobre as instalações irregulares (descreva cada ponto encontrado):',
        sublabel: 'Detalhe: localização (vaga nº), marca/modelo do carregador, estado dos cabos, riscos visíveis.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 3 — ENQUADRAMENTO DE DISPENSA (Art. 6º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'dispensa',
    number: '03',
    title: 'Enquadramento de Dispensa de PBD',
    description: 'Verificação dos critérios do Art. 6º para dispensa do Projeto Baseado em Desempenho (Anexo B).',
    questions: [
      // -- Subseção: Cobertura Leve (Art. 6º, I)
      {
        id: 'dispensa_cobertura_leve', type: 'yesno', label: 'O local é descoberto ou possui apenas cobertura leve sem fechamento lateral significativo?',
        sublabel: 'IN 23, Art. 6º, Inciso I — Dispensa automática de PBD.',
        condition: { field: 'tipo_local', values: ['descoberto', 'cobertura_leve'] },
        autoValue: { when: { field: 'tipo_local', values: ['descoberto', 'cobertura_leve'] }, set: 'sim' },
      },

      // -- Subseção: Ventilação Natural (Art. 6º, VI e § 1º)
      {
        id: 'vent_titulo', type: 'heading', label: 'Ventilação Natural — Critérios de Comprovação',
        sublabel: 'IN 23, Art. 6º, § 1º — Fórmula de cálculo para ventilação natural.',
        condition: { field: 'tipo_local', values: ['ventilacao_natural'] },
      },
      {
        id: 'vent_aberturas_20pct', type: 'yesno',
        label: 'As aberturas permanentes somam ≥ 20% da área das fachadas externas do pavimento?',
        sublabel: 'IN 23, Art. 6º, § 1º, critério 1.',
        condition: { field: 'tipo_local', values: ['ventilacao_natural'] },
      },
      {
        id: 'vent_comprimento_40pct', type: 'yesno',
        label: 'O comprimento total das aberturas atinge ≥ 40% do perímetro do pavimento?',
        sublabel: 'IN 23, Art. 6º, § 1º, critério 2.',
        condition: { field: 'tipo_local', values: ['ventilacao_natural'] },
      },
      {
        id: 'vent_area_limite', type: 'yesno',
        label: 'A área total do pavimento com SAVE é ≤ 1.500 m²?',
        sublabel: 'IN 23, Art. 6º, Inciso VI — Limite de área para dispensa com ventilação natural.',
        condition: { field: 'tipo_local', values: ['ventilacao_natural'] },
      },
      {
        id: 'vent_deteccao', type: 'yesno',
        label: 'Possui sistema de detecção automática de incêndio (conforme IN 12) cobrindo a área do SAVE?',
        sublabel: 'IN 23, Art. 6º, Inciso VI — Exigência cumulativa.',
        condition: { field: 'tipo_local', values: ['ventilacao_natural'] },
      },

      // -- Subseção: Garagem Fechada (Art. 6º, III)
      {
        id: 'fechado_titulo', type: 'heading', label: 'Garagem Fechada — Critérios de Dispensa',
        sublabel: 'IN 23, Art. 6º, Incisos III a V — Dispensas para ambientes sem ventilação natural.',
        condition: { field: 'tipo_local', values: ['fechado'] },
      },
      {
        id: 'fechado_compartimentacao', type: 'yesno',
        label: 'O local do SAVE é compartimentado (isolado) em relação às rotas de fuga e poços de elevadores?',
        sublabel: 'IN 23, Art. 6º, Inciso III, critério 1 — Exige paredes e portas corta-fogo.',
        condition: { field: 'tipo_local', values: ['fechado'] },
      },
      {
        id: 'fechado_compartimentacao_1h', type: 'yesno',
        label: 'A compartimentação resiste ao fogo por no mínimo 1 hora (TRRF ≥ 60 min)?',
        sublabel: 'IN 23, Art. 6º, § 5º — Requisito de tempo de resistência.',
        condition: { field: 'fechado_compartimentacao', values: ['sim'] },
      },
      {
        id: 'fechado_deteccao', type: 'yesno',
        label: 'Possui sistema de detecção automática de incêndio (conforme IN 12) cobrindo a área do SAVE?',
        sublabel: 'IN 23, Art. 6º, Inciso III, critério 2 — Exigência cumulativa com compartimentação.',
        condition: { field: 'tipo_local', values: ['fechado'] },
      },

      // -- Subseção: Sprinklers (Art. 6º, IV/V e § 2º)
      {
        id: 'sprinkler_titulo', type: 'heading', label: 'Alternativa com Chuveiros Automáticos (Sprinklers)',
        sublabel: 'IN 23, Art. 6º, IV e V — Dispensa alternativa para quem não possui compartimentação.',
        condition: { field: 'tipo_local', values: ['fechado', 'ventilacao_natural'] },
      },
      {
        id: 'sprinkler_possui', type: 'yesno',
        label: 'O local possui ou terá sistema de chuveiros automáticos (sprinklers) cobrindo a área do SAVE?',
        sublabel: 'IN 23, Art. 6º, Incisos IV e V.',
        condition: { field: 'tipo_local', values: ['fechado', 'ventilacao_natural'] },
      },
      {
        id: 'sprinkler_alimentacao', type: 'select',
        label: 'Qual a fonte de alimentação dos sprinklers?',
        sublabel: 'IN 23, Art. 6º, § 2º — Sprinklers alimentados por hidrantes possuem requisitos adicionais.',
        options: [
          { value: 'dedicado', label: 'Sistema dedicado (bomba e reservatório próprios)' },
          { value: 'hidrantes', label: 'Alimentado pela rede de hidrantes existente' },
        ],
        condition: { field: 'sprinkler_possui', values: ['sim'] },
      },
      {
        id: 'sprinkler_chave_fluxo', type: 'yesno',
        label: 'A rede possui chave de fluxo interligada à central de alarme de incêndio?',
        sublabel: 'IN 23, Art. 6º, § 2º, requisito 1.',
        condition: { field: 'sprinkler_alimentacao', values: ['hidrantes'] },
      },
      {
        id: 'sprinkler_dreno_teste', type: 'yesno',
        label: 'Possui ponto de dreno e teste acessível?',
        sublabel: 'IN 23, Art. 6º, § 2º, requisito 2.',
        condition: { field: 'sprinkler_alimentacao', values: ['hidrantes'] },
      },
      {
        id: 'sprinkler_manometro', type: 'yesno',
        label: 'Possui manômetro visível e em funcionamento?',
        sublabel: 'IN 23, Art. 6º, § 2º, requisito 3.',
        condition: { field: 'sprinkler_alimentacao', values: ['hidrantes'] },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 4 — INSTALAÇÃO ELÉTRICA (Art. 7º + NBR 17019)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'eletrica',
    number: '04',
    title: 'Instalação Elétrica',
    description: 'Verificação de conformidade com Art. 7º da IN 23, NBR 17019, NBR 5410 e NBR 5419.',
    questions: [
      {
        id: 'circuito_exclusivo', type: 'yesno',
        label: 'O SAVE possui circuito elétrico exclusivo e dedicado?',
        sublabel: 'NBR 17019 — Proibido uso de tomadas comuns, extensões ou adaptadores.',
      },
      {
        id: 'dr_instalado', type: 'yesno',
        label: 'Possui Dispositivo Diferencial Residual (DR) instalado no circuito do SAVE?',
        sublabel: 'NBR 17019 — Obrigatório para proteção contra choques elétricos.',
      },
      {
        id: 'dr_tipo', type: 'select',
        label: 'Qual o tipo do DR instalado?',
        sublabel: 'NBR 17019 — Tipo A (mínimo para CA); Tipo B ou F para sistemas com componente CC.',
        options: [
          { value: 'tipo_a', label: 'Tipo A' },
          { value: 'tipo_b', label: 'Tipo B' },
          { value: 'tipo_f', label: 'Tipo F' },
          { value: 'desconhecido', label: 'Não identificado / Desconhecido' },
        ],
        condition: { field: 'dr_instalado', values: ['sim'] },
      },
      {
        id: 'disjuntor_dedicado', type: 'yesno',
        label: 'Possui disjuntor de proteção dedicado e adequado à carga do SAVE?',
        sublabel: 'NBR 17019 — Proteção contra sobrecarga e curto-circuito.',
      },
      {
        id: 'dps_instalado', type: 'yesno',
        label: 'Possui Dispositivo de Proteção contra Surtos (DPS) instalado?',
        sublabel: 'NBR 17019 e NBR 5419 — Proteção contra descargas atmosféricas e sobretensões.',
      },
      {
        id: 'aterramento_verificado', type: 'yesno',
        label: 'O aterramento e a equipotencialização (PE) foram verificados e estão em conformidade?',
        sublabel: 'NBR 5410 — A continuidade do condutor de proteção deve ser comprovada.',
      },
      {
        id: 'protecao_mecanica_cabos', type: 'yesno',
        label: 'Os cabos possuem proteção mecânica adequada no percurso pela garagem?',
        sublabel: 'NBR 17019 — Cabos expostos em garagens devem ter proteção contra impactos mecânicos.',
      },
      {
        id: 'spda_existente', type: 'yesno',
        label: 'A edificação possui SPDA (Sistema de Proteção contra Descargas Atmosféricas)?',
        sublabel: 'NBR 5419 — Referência normativa obrigatória na IN 23 (Art. 7º).',
      },
      {
        id: 'estudo_simultaneidade', type: 'yesno',
        label: 'Foi realizado estudo de simultaneidade de carga para dimensionamento da infraestrutura?',
        sublabel: 'NBR 17019 — Avalia a capacidade elétrica disponível para múltiplos carregadores.',
      },
      {
        id: 'certificacao_carregador', type: 'yesno',
        label: 'O(s) carregador(es) possui(em) certificado de conformidade conforme NBR IEC 61851?',
        sublabel: 'IN 23, Art. 7º — Equipamento deve ser certificado pelo INMETRO ou OCP credenciado.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 5 — MODO DE RECARGA (Art. 8º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'modo_recarga',
    number: '05',
    title: 'Modo de Recarga',
    description: 'Verificação do modo de recarga utilizado conforme Art. 8º da IN 23.',
    questions: [
      {
        id: 'modo_utilizado', type: 'select',
        label: 'Qual o modo de recarga utilizado no local?',
        sublabel: 'IN 23, Art. 8º — Modo 1 é PROIBIDO; Modo 2 possui restrições.',
        options: [
          { value: 'modo1', label: 'Modo 1 — Tomada doméstica comum (PROIBIDO)' },
          { value: 'modo2', label: 'Modo 2 — Cabo com dispositivo de proteção portátil' },
          { value: 'modo3', label: 'Modo 3 — Estação de recarga fixa (AC)' },
          { value: 'modo4', label: 'Modo 4 — Recarga rápida (DC)' },
        ],
        required: true,
      },
      {
        id: 'modo1_alerta', type: 'alert',
        label: '⛔ NÃO CONFORMIDADE AUTOMÁTICA: O Modo 1 é expressamente proibido pela IN 23 (Art. 8º). A instalação deve ser substituída por Modo 3 ou superior.',
        condition: { field: 'modo_utilizado', values: ['modo1'] },
      },
      {
        id: 'modo2_local_externo', type: 'yesno',
        label: 'O carregador Modo 2 está instalado em área EXTERNA?',
        sublabel: 'IN 23, Art. 8º — Modo 2 é permitido apenas em áreas externas.',
        condition: { field: 'modo_utilizado', values: ['modo2'] },
      },
      {
        id: 'modo2_alerta', type: 'alert',
        label: '⚠️ ATENÇÃO: Modo 2 em área interna é irregular. Recomende a substituição por Modo 3.',
        condition: { field: 'modo2_local_externo', values: ['nao'] },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 6 — DESLIGAMENTO DE EMERGÊNCIA (Art. 9º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'desligamento',
    number: '06',
    title: 'Desligamento de Emergência',
    description: 'Verificação do dispositivo de desligamento manual conforme Art. 9º da IN 23.',
    questions: [
      {
        id: 'deslig_existe', type: 'yesno',
        label: 'Existe dispositivo de desligamento manual de emergência para o SAVE?',
        sublabel: 'IN 23, Art. 9º — Obrigatório em TODOS os locais, inclusive dispensados de PBD.',
        required: true,
      },
      {
        id: 'deslig_tipo', type: 'select',
        label: 'Tipo de desligamento instalado:',
        sublabel: 'IN 23, Art. 9º, caput e § 1º.',
        options: [
          { value: 'unico_pavimento', label: 'Único por pavimento (todas as estações juntas)' },
          { value: 'individual', label: 'Individual por estação de recarga (apenas preexistentes)' },
        ],
        condition: { field: 'deslig_existe', values: ['sim'] },
      },
      {
        id: 'deslig_distancia_5m', type: 'yesno',
        label: 'O botão de desligamento está a no máximo 5 metros da escada ou do acesso (entrada/saída) da garagem?',
        sublabel: 'IN 23, Art. 9º — Distância máxima regulamentar.',
        condition: { field: 'deslig_tipo', values: ['unico_pavimento'] },
      },
      {
        id: 'deslig_distancia_individual', type: 'yesno',
        label: 'Cada botão individual está a no máximo 5 metros do respectivo carregador?',
        sublabel: 'IN 23, Art. 9º, § 1º — Regra para desligamento individual em preexistentes.',
        condition: { field: 'deslig_tipo', values: ['individual'] },
      },
      {
        id: 'deslig_altura', type: 'yesno',
        label: 'A altura do botão está entre 0,90 m e 1,35 m do piso acabado?',
        sublabel: 'IN 23, Art. 9º, § 2º — Faixa de altura regulamentar.',
        condition: { field: 'deslig_existe', values: ['sim'] },
      },
      {
        id: 'deslig_altura_medida', type: 'number',
        label: 'Altura medida do botão (metros):',
        sublabel: 'Registre a medição exata para o relatório.',
        condition: { field: 'deslig_existe', values: ['sim'] },
      },
      {
        id: 'deslig_sinalizado', type: 'yesno',
        label: 'O botão está devidamente sinalizado e identificado?',
        sublabel: 'IN 23, Art. 9º — Deve ser facilmente localizável.',
        condition: { field: 'deslig_existe', values: ['sim'] },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 7 — SINALIZAÇÃO (Art. 10º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'sinalizacao',
    number: '07',
    title: 'Sinalização de Emergência',
    description: 'Verificação das placas e comunicação visual conforme Art. 10º da IN 23.',
    questions: [
      {
        id: 'placa_existe', type: 'yesno',
        label: 'Existe placa de sinalização de emergência para veículos elétricos no local?',
        sublabel: 'IN 23, Art. 10º — Obrigatória em todos os locais com SAVE.',
        required: true,
      },
      {
        id: 'placa_fotoluminescente', type: 'yesno',
        label: 'A placa é fotoluminescente?',
        sublabel: 'IN 23, Art. 10º — Material obrigatório.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
      {
        id: 'placa_cor', type: 'yesno',
        label: 'A placa possui fundo VERMELHO com letras BRANCAS maiúsculas?',
        sublabel: 'IN 23, Art. 10º — Padrão cromático obrigatório.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
      {
        id: 'placa_texto', type: 'yesno',
        label: 'O texto inclui a mensagem: "VEÍCULOS ELÉTRICOS — EMERGÊNCIA — DESLIGUE OS CARREGADORES"?',
        sublabel: 'IN 23, Art. 10º — Texto padrão obrigatório.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
      {
        id: 'placa_letras_10mm', type: 'yesno',
        label: 'As letras possuem no mínimo 10 mm de altura?',
        sublabel: 'IN 23, Art. 10º — Dimensão mínima regulamentar.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
      {
        id: 'placa_altura_180', type: 'yesno',
        label: 'A placa está fixada a 1,80 m do piso acabado?',
        sublabel: 'IN 23, Art. 10º — Altura de fixação obrigatória.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
      {
        id: 'placa_visivel', type: 'yesno',
        label: 'A placa está visível e sem obstruções visuais?',
        sublabel: 'Verificação prática de campo.',
        condition: { field: 'placa_existe', values: ['sim'] },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 8 — INDEPENDÊNCIA ELÉTRICA (Art. 11º e 12º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'independencia',
    number: '08',
    title: 'Independência Elétrica e dos Sistemas de Segurança',
    description: 'Verificação da separação do circuito do SAVE dos sistemas vitais conforme Art. 11º e 12º.',
    questions: [
      {
        id: 'indep_quadro_separado', type: 'yesno',
        label: 'O SAVE possui quadro de proteção/seccionamento separado do quadro geral da edificação?',
        sublabel: 'IN 23, Art. 11º — Alimentação independente.',
      },
      {
        id: 'indep_ilum_emergencia', type: 'yesno',
        label: 'O desligamento do SAVE mantém a iluminação de emergência em pleno funcionamento?',
        sublabel: 'IN 23, Art. 12º — Sistema de segurança vital.',
      },
      {
        id: 'indep_bomba_incendio', type: 'yesno',
        label: 'O desligamento do SAVE mantém a bomba de incêndio (hidrantes) em funcionamento?',
        sublabel: 'IN 23, Art. 12º — Sistema de segurança vital.',
      },
      {
        id: 'indep_central_alarme', type: 'yesno',
        label: 'O desligamento do SAVE mantém a central de alarme de incêndio em funcionamento?',
        sublabel: 'IN 23, Art. 12º — Sistema de segurança vital.',
      },
      {
        id: 'indep_elevador', type: 'yesno',
        label: 'O desligamento do SAVE mantém os elevadores de emergência em funcionamento?',
        sublabel: 'IN 23, Art. 12º — Verificar se aplicável à edificação.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 9 — AFASTAMENTOS E BARREIRAS (Art. 15º e 16º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'afastamentos',
    number: '09',
    title: 'Afastamentos e Barreiras Físicas',
    description: 'Verificação dos afastamentos de 5 metros das rotas de fuga conforme Art. 15º e 16º.',
    questions: [
      {
        id: 'afast_titulo_rota_unica', type: 'heading',
        label: 'Verificação de Afastamento — Rota de Fuga Única',
        sublabel: 'IN 23, Art. 15º — Aplicável apenas quando há uma única rota de saída.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_escada_5m', type: 'yesno',
        label: 'Todas as vagas com SAVE estão a ≥ 5 metros de portas de escadas de emergência?',
        sublabel: 'IN 23, Art. 15º — Distância mínima obrigatória.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_escada_medida', type: 'number',
        label: 'Menor distância medida até porta de escada (metros):',
        sublabel: 'Registre a menor medição para o relatório.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_elevador_5m', type: 'yesno',
        label: 'Todas as vagas com SAVE estão a ≥ 5 metros de poços de elevadores?',
        sublabel: 'IN 23, Art. 15º.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_saida_5m', type: 'yesno',
        label: 'Todas as vagas com SAVE estão a ≥ 5 metros de saídas de emergência?',
        sublabel: 'IN 23, Art. 15º.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_barreira_necessaria', type: 'yesno',
        label: 'É necessária barreira física corta-fogo por impossibilidade de atender os 5 metros?',
        sublabel: 'IN 23, Art. 15º, § 2º — Alternativa ao afastamento.',
        condition: { field: 'num_rotas_fuga', values: ['uma'] },
      },
      {
        id: 'afast_barreira_existe', type: 'yesno',
        label: 'A barreira física corta-fogo está instalada ou projetada?',
        sublabel: 'IN 23, Art. 15º, § 2º.',
        condition: { field: 'afast_barreira_necessaria', values: ['sim'] },
      },
      {
        id: 'afast_barreira_1h', type: 'yesno',
        label: 'A barreira resiste ao fogo por no mínimo 1 hora?',
        sublabel: 'Requisito mínimo de resistência.',
        condition: { field: 'afast_barreira_existe', values: ['sim'] },
      },
      {
        id: 'afast_duas_rotas', type: 'heading',
        label: '✅ Edificação com duas ou mais rotas de fuga — Afastamento de 5 metros NÃO exigido',
        sublabel: 'IN 23, Art. 15º — Exigência se aplica apenas a edificações com rota única.',
        condition: { field: 'num_rotas_fuga', values: ['duas_ou_mais'] },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 10 — RESISTÊNCIA ESTRUTURAL (Art. 18º)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'estrutural',
    number: '10',
    title: 'Resistência Estrutural ao Fogo',
    description: 'Verificação da capacidade dos elementos estruturais de resistir à carga térmica de incêndio veicular.',
    questions: [
      {
        id: 'laudo_estrutural_existe', type: 'yesno',
        label: 'Existe laudo de estabilidade estrutural atestando resistência à carga térmica de incêndio veicular?',
        sublabel: 'IN 23, Art. 18º — Obrigatório para locais fechados. HRR de referência: 8 MW (BEV).',
      },
      {
        id: 'laudo_estrutural_profissional', type: 'text',
        label: 'Nome e CREA do profissional responsável pelo laudo estrutural:',
        sublabel: 'Identificação do responsável pelo laudo de terceiro.',
        condition: { field: 'laudo_estrutural_existe', values: ['sim'] },
      },
      {
        id: 'estrutura_tipo', type: 'select',
        label: 'Tipo predominante da estrutura na área do SAVE:',
        sublabel: 'Informação complementar para análise técnica.',
        options: [
          { value: 'concreto', label: 'Concreto armado' },
          { value: 'metalica', label: 'Estrutura metálica' },
          { value: 'mista', label: 'Mista (concreto + metálica)' },
          { value: 'outra', label: 'Outra' },
        ],
      },
      {
        id: 'protecao_pilares', type: 'yesno',
        label: 'Os pilares e vigas próximos às vagas SAVE possuem proteção passiva contra incêndio?',
        sublabel: 'Pintura intumescente, revestimento de argamassa projetada, etc.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 11 — ADAPTAÇÕES IN 05 (Edificações Existentes/Recentes)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'in05',
    number: '11',
    title: 'Adaptações para Edificações Existentes (IN 05)',
    description: 'Verificação das medidas compensatórias e adaptações permitidas pela IN 05 para prédios antigos.',
    sectionCondition: { field: 'classificacao_edificacao', values: ['existente', 'recente'] },
    questions: [
      {
        id: 'in05_efeito_domino', type: 'yesno',
        label: 'Confirmado que a adequação do SAVE NÃO obriga adequação dos demais sistemas da edificação?',
        sublabel: 'IN 05, Art. 4º, Parágrafo Único, III — Não se considera aumento de grau de rigor.',
      },
      {
        id: 'in05_compartimentacao_alternativa', type: 'yesno',
        label: 'Caso necessária compartimentação: é possível utilizar materiais leves (placas cimentícias, EPS/cimento, pintura intumescente)?',
        sublabel: 'IN 05, Anexo C — Alternativas para edificações existentes.',
      },
      {
        id: 'in05_deteccao_central', type: 'yesno',
        label: 'A central de alarme de incêndio existente comporta a inclusão de novos pontos de detecção para a área do SAVE?',
        sublabel: 'Verificação de capacidade da central para expansão.',
      },
      {
        id: 'in05_deteccao_expansao', type: 'yesno',
        label: 'É necessária expansão ou reprogramação da central de alarme?',
        sublabel: 'Serviço de execução técnica a cargo da empresa de manutenção do condomínio.',
        condition: { field: 'in05_deteccao_central', values: ['nao'] },
      },
      {
        id: 'in05_ppci_pendencias', type: 'yesno',
        label: 'A edificação possui pendências gerais de segurança contra incêndio no PPCI (além do SAVE)?',
        sublabel: 'IN 05, Art. 21º — Pode ser relevante para o processo de regularização.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SEÇÃO 12 — OBSERVAÇÕES E REGISTROS
  // ════════════════════════════════════════════════════════════════
  {
    id: 'observacoes',
    number: '12',
    title: 'Observações, Registros e Recomendações',
    description: 'Anotações complementares, não conformidades identificadas e recomendações técnicas.',
    questions: [
      {
        id: 'obs_nao_conformidades', type: 'textarea',
        label: 'Não conformidades identificadas durante a vistoria:',
        sublabel: 'Liste todas as irregularidades encontradas com referência aos artigos da IN 23.',
      },
      {
        id: 'obs_recomendacoes', type: 'textarea',
        label: 'Recomendações técnicas ao contratante:',
        sublabel: 'Orientações para adequação e próximos passos.',
      },
      {
        id: 'obs_gerais', type: 'textarea',
        label: 'Observações gerais:',
        sublabel: 'Informações adicionais relevantes para o relatório.',
      },
      {
        id: 'obs_enquadramento_final', type: 'select',
        label: 'Parecer de enquadramento preliminar:',
        sublabel: 'Com base na vistoria, qual o caminho recomendado?',
        options: [
          { value: 'anexo_b', label: 'Anexo B — Dispensa de PBD (atende critérios do Art. 6º)' },
          { value: 'anexo_a', label: 'Anexo A — PBD necessário (não atende dispensas)' },
          { value: 'adequacoes', label: 'Adequações necessárias antes do protocolo' },
          { value: 'inconclusivo', label: 'Inconclusivo — necessita análise complementar' },
        ],
      },
    ],
  },
];


// ─── Motor de Renderização ────────────────────────────────────────

function init() {
  renderLanding();
  bindGlobalEvents();
  // Inicializar status de seções
  CHECKLIST_SECTIONS.forEach(s => {
    APP.sectionStatus[s.id] = 'not-visited';
  });
}

function bindGlobalEvents() {
  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.addEventListener('click', () => navigateTo('landing'));
}

function navigateTo(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.add('view--active');
  APP.currentView = view;

  const backBtn = document.getElementById('back-btn');
  const menuBtn = document.getElementById('menu-btn');
  const headerTitle = document.getElementById('header-title');
  if (view === 'landing') {
    backBtn.classList.add('hidden');
    menuBtn.classList.add('hidden');
    headerTitle.textContent = 'SAVE Regularização';
  } else {
    backBtn.classList.remove('hidden');
    headerTitle.textContent = view === 'study' ? 'Guia de Estudos — IN 23' : 'Checklist de Vistoria';
    if (view === 'checklist') {
      menuBtn.classList.remove('hidden');
    } else {
      menuBtn.classList.add('hidden');
    }
  }

  if (view === 'study') renderStudyGuide();
  if (view === 'checklist') {
    APP.currentSection = 0;
    renderChecklistSidebar();
    renderChecklistSection(0);
  }
}

// ─── Landing Page ────────────────────────────────────────────────

function renderLanding() {
  const container = document.getElementById('landing-cards');
  if (!container) return;
  container.innerHTML = `
    <div class="landing__card" onclick="navigateTo('study')" id="card-study">
      <div class="landing__card-icon">📚</div>
      <h2 class="landing__card-title">Guia de Estudos</h2>
      <p class="landing__card-desc">Interpretação completa e mastigada da IN 23 (Aprovada), IN 05 e NBR 17019. Organizada por módulos temáticos para estudo e consulta rápida.</p>
    </div>
    <div class="landing__card" onclick="navigateTo('checklist')" id="card-checklist">
      <div class="landing__card-icon">📋</div>
      <h2 class="landing__card-title">Checklist de Vistoria</h2>
      <p class="landing__card-desc">Formulário inteligente para inspeção em campo. Adaptável ao tipo de edificação, com rastreamento de progresso e alerta de pendências.</p>
    </div>
  `;
}

// ─── Guia de Estudos ──────────────────────────────────────────────

function renderStudyGuide() {
  const container = document.getElementById('study-content');
  if (!container) return;
  container.innerHTML = STUDY_MODULES.map(mod => `
    <div class="study__module" id="module-${mod.id}">
      <div class="study__module-header" onclick="toggleModule('${mod.id}')">
        <div style="display:flex;align-items:center;gap:12px;flex:1">
          <span class="study__module-number">${mod.number}</span>
          <div>
            <h3 class="study__module-title">${mod.title}</h3>
            <span class="study__article-ref">${mod.ref}</span>
          </div>
        </div>
        <span class="study__module-chevron" id="chevron-${mod.id}">▼</span>
      </div>
      <div class="study__module-content" id="content-${mod.id}">
        ${mod.topics.map(t => `
          <div class="study__topic">
            <h4 class="study__topic-title">${t.title}</h4>
            <div class="study__topic-text">${t.text}</div>
            ${t.highlight ? `<div class="study__highlight">💡 ${t.highlight}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleModule(modId) {
  const mod = document.getElementById(`module-${modId}`);
  const chevron = document.getElementById(`chevron-${modId}`);
  if (mod) mod.classList.toggle('study__module--open');
}

// ─── Checklist — Sidebar ──────────────────────────────────────────

function renderChecklistSidebar() {
  const nav = document.getElementById('checklist-nav');
  if (!nav) return;

  const visibleSections = getVisibleSections();
  const totalQuestions = countTotalQuestions(visibleSections);
  const answeredQuestions = countAnsweredQuestions(visibleSections);
  const pct = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  const progressBar = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  if (progressBar) {
    progressBar.style.width = pct + '%';
  }
  if (progressText) {
    progressText.textContent = `${pct}% concluído (${answeredQuestions}/${totalQuestions})`;
  }

  nav.innerHTML = visibleSections.map((section, idx) => {
    const realIdx = CHECKLIST_SECTIONS.indexOf(section);
    const status = APP.sectionStatus[section.id] || 'not-visited';
    const isActive = realIdx === APP.currentSection;
    const answered = countSectionAnswered(section);
    const total = countSectionTotal(section);

    let statusClass = '';
    let dotColor = '';
    if (status === 'complete') { statusClass = 'checklist__nav-item--complete'; dotColor = 'var(--color-green)'; }
    else if (status === 'incomplete') { statusClass = 'checklist__nav-item--skipped'; dotColor = 'var(--color-amber)'; }
    else { dotColor = 'var(--color-muted)'; }

    return `
      <div class="checklist__nav-item ${isActive ? 'checklist__nav-item--active' : ''} ${statusClass}"
           onclick="goToSection(${realIdx})" id="nav-item-${section.id}">
        <span class="checklist__nav-dot" style="background:${dotColor}"></span>
        <span class="checklist__nav-label">${section.number}. ${section.title}</span>
        <span class="checklist__nav-badge">${answered}/${total}</span>
      </div>
    `;
  }).join('');
}

function getVisibleSections() {
  return CHECKLIST_SECTIONS.filter(section => {
    if (!section.sectionCondition) return true;
    const { field, values } = section.sectionCondition;
    const answer = APP.answers[field];
    return answer && values.includes(answer);
  });
}

// ─── Checklist — Renderizar Seção ──────────────────────────────────

function renderChecklistSection(sectionIdx) {
  APP.currentSection = sectionIdx;
  const section = CHECKLIST_SECTIONS[sectionIdx];
  if (!section) return;

  const main = document.getElementById('checklist-main');
  if (!main) return;

  // Marcar como visitada se não-visitada
  if (APP.sectionStatus[section.id] === 'not-visited') {
    APP.sectionStatus[section.id] = 'incomplete';
  }

  const visibleQuestions = section.questions.filter(q => isQuestionVisible(q));

  main.innerHTML = `
    <div class="checklist__section" id="section-${section.id}">
      <div class="checklist__section-header">
        <span class="checklist__section-number">${section.number}</span>
        <div>
          <h2 class="checklist__section-title">${section.title}</h2>
          <p class="checklist__section-desc">${section.description}</p>
        </div>
      </div>
      <div class="checklist__questions">
        ${visibleQuestions.map(q => renderQuestion(q)).join('')}
      </div>
      <div class="section-nav">
        ${sectionIdx > 0 ? `<button class="section-nav__btn section-nav__btn--prev" onclick="goToSection(${sectionIdx - 1})">← Anterior</button>` : '<div></div>'}
        <button class="section-nav__btn section-nav__btn--skip" onclick="skipSection(${sectionIdx})">Pular Seção ⏭</button>
        ${sectionIdx < CHECKLIST_SECTIONS.length - 1
          ? `<button class="section-nav__btn section-nav__btn--next" onclick="goToSection(${sectionIdx + 1})">Próxima →</button>`
          : `<button class="section-nav__btn section-nav__btn--submit" onclick="submitChecklist()">Finalizar Relatório ✓</button>`
        }
      </div>
    </div>
  `;

  renderChecklistSidebar();
  main.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion(q) {
  if (q.type === 'heading') {
    return `<div class="form-group form-group--heading ${q.condition ? 'form-group--conditional' : ''}">
      <h3 class="form-group__heading-label">${q.label}</h3>
      ${q.sublabel ? `<p class="form-group__sublabel">${q.sublabel}</p>` : ''}
    </div>`;
  }

  if (q.type === 'alert') {
    const isWarning = q.label.includes('⚠️');
    return `<div class="form-group form-group--conditional form-group--alert ${isWarning ? 'form-group--alert-warning' : 'form-group--alert-danger'}">
      <p class="form-group__alert-text">${q.label}</p>
    </div>`;
  }

  const currentValue = APP.answers[q.id] || '';
  const isConditional = !!q.condition;

  let inputHTML = '';

  switch (q.type) {
    case 'text':
      inputHTML = `<input type="text" class="form-input" id="input-${q.id}" value="${escapeHTML(currentValue)}"
                    onchange="setAnswer('${q.id}', this.value)" placeholder="Digite aqui...">`;
      break;
    case 'date':
      inputHTML = `<input type="date" class="form-input" id="input-${q.id}" value="${currentValue}"
                    onchange="setAnswer('${q.id}', this.value)">`;
      break;
    case 'number':
      inputHTML = `<input type="number" class="form-number" id="input-${q.id}" value="${currentValue}"
                    onchange="setAnswer('${q.id}', this.value)" placeholder="0" step="0.01" min="0">`;
      break;
    case 'textarea':
      inputHTML = `<textarea class="form-textarea" id="input-${q.id}"
                    onchange="setAnswer('${q.id}', this.value)" placeholder="Digite suas observações...">${escapeHTML(currentValue)}</textarea>`;
      break;
    case 'select':
      inputHTML = `<select class="form-select" id="input-${q.id}" onchange="setAnswer('${q.id}', this.value)">
        <option value="">— Selecione —</option>
        ${q.options.map(opt => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          const isProibido = lbl.includes('PROIBIDO');
          return `<option value="${val}" ${currentValue === val ? 'selected' : ''} ${isProibido ? 'class="option-proibido"' : ''}>${lbl}</option>`;
        }).join('')}
      </select>`;
      break;
    case 'yesno':
      inputHTML = `<div class="form-group__options">
        <button class="form-btn form-btn--sim ${currentValue === 'sim' ? 'form-btn--selected' : ''}"
                onclick="setAnswer('${q.id}', 'sim')">✓ Sim</button>
        <button class="form-btn form-btn--nao ${currentValue === 'nao' ? 'form-btn--selected' : ''}"
                onclick="setAnswer('${q.id}', 'nao')">✗ Não</button>
        <button class="form-btn form-btn--na ${currentValue === 'na' ? 'form-btn--selected' : ''}"
                onclick="setAnswer('${q.id}', 'na')">N/A</button>
      </div>`;
      break;
  }

  return `
    <div class="form-group ${isConditional ? 'form-group--conditional' : ''}" id="group-${q.id}">
      <label class="form-group__label" for="input-${q.id}">${q.label}</label>
      ${q.sublabel ? `<p class="form-group__sublabel">${q.sublabel}</p>` : ''}
      ${inputHTML}
    </div>
  `;
}

// ─── Motor Condicional ────────────────────────────────────────────

function isQuestionVisible(q) {
  if (!q.condition) return true;
  const { field, values } = q.condition;
  const answer = APP.answers[field];
  return answer && values.includes(answer);
}

function setAnswer(questionId, value) {
  APP.answers[questionId] = value;

  // AutoValue propagation
  CHECKLIST_SECTIONS.forEach(section => {
    section.questions.forEach(q => {
      if (q.autoValue) {
        const { when, set } = q.autoValue;
        const triggerVal = APP.answers[when.field];
        if (triggerVal && when.values.includes(triggerVal)) {
          APP.answers[q.id] = set;
        }
      }
    });
  });

  // Update section status
  updateSectionStatus(APP.currentSection);

  // Re-render current section (conditions may have changed)
  renderChecklistSection(APP.currentSection);
}

function updateSectionStatus(sectionIdx) {
  const section = CHECKLIST_SECTIONS[sectionIdx];
  if (!section) return;

  const visibleQs = section.questions.filter(q => isQuestionVisible(q) && q.type !== 'heading' && q.type !== 'alert');
  const answered = visibleQs.filter(q => APP.answers[q.id] && APP.answers[q.id] !== '').length;

  if (answered === 0 && APP.sectionStatus[section.id] !== 'not-visited') {
    APP.sectionStatus[section.id] = 'incomplete';
  } else if (answered > 0 && answered < visibleQs.length) {
    APP.sectionStatus[section.id] = 'incomplete';
  } else if (answered >= visibleQs.length && visibleQs.length > 0) {
    APP.sectionStatus[section.id] = 'complete';
  }
}

// ─── Navegação de Seções ──────────────────────────────────────────

function goToSection(idx) {
  // Check if section is visible (conditional)
  const section = CHECKLIST_SECTIONS[idx];
  if (section && section.sectionCondition) {
    const { field, values } = section.sectionCondition;
    const answer = APP.answers[field];
    if (!answer || !values.includes(answer)) {
      // Skip to next/prev visible section
      if (idx > APP.currentSection) {
        goToSection(idx + 1);
      } else {
        goToSection(idx - 1);
      }
      return;
    }
  }

  if (idx < 0 || idx >= CHECKLIST_SECTIONS.length) return;

  updateSectionStatus(APP.currentSection);
  renderChecklistSection(idx);
}

function skipSection(idx) {
  const section = CHECKLIST_SECTIONS[idx];
  if (section) {
    APP.sectionStatus[section.id] = 'incomplete';
  }

  const nextIdx = idx + 1;
  if (nextIdx < CHECKLIST_SECTIONS.length) {
    goToSection(nextIdx);
  } else {
    submitChecklist();
  }
}

// ─── Contadores ───────────────────────────────────────────────────

function countSectionAnswered(section) {
  const visibleQs = section.questions.filter(q => isQuestionVisible(q) && q.type !== 'heading' && q.type !== 'alert');
  return visibleQs.filter(q => APP.answers[q.id] && APP.answers[q.id] !== '').length;
}

function countSectionTotal(section) {
  return section.questions.filter(q => isQuestionVisible(q) && q.type !== 'heading' && q.type !== 'alert').length;
}

function countTotalQuestions(sections) {
  return sections.reduce((sum, s) => sum + countSectionTotal(s), 0);
}

function countAnsweredQuestions(sections) {
  return sections.reduce((sum, s) => sum + countSectionAnswered(s), 0);
}

// ─── Submissão e Validação ────────────────────────────────────────

function submitChecklist() {
  updateSectionStatus(APP.currentSection);

  const visibleSections = getVisibleSections();
  const pendingSections = visibleSections.filter(s => APP.sectionStatus[s.id] !== 'complete');

  if (pendingSections.length > 0) {
    showPendingModal(pendingSections);
  } else {
    showSuccessModal();
  }
}

function showPendingModal(pendingSections) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal-content');

  modal.innerHTML = `
    <h3 class="modal__title">⚠️ Seções Pendentes</h3>
    <div class="modal__body">
      <p>Você não respondeu completamente as seguintes subseções:</p>
      <ul class="modal__warning-list">
        ${pendingSections.map(s => `
          <li class="modal__warning-item">
            <span class="modal__warning-icon">⚠</span>
            <span><strong>Seção ${s.number}:</strong> ${s.title} (${countSectionAnswered(s)}/${countSectionTotal(s)} respondidas)</span>
          </li>
        `).join('')}
      </ul>
      <p class="text-muted mt-2">Você pode enviar mesmo assim ou voltar para completar as seções pendentes.</p>
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" onclick="closeModal()">Voltar e Completar</button>
      <button class="modal__btn modal__btn--confirm" onclick="forceSubmit()">Enviar Mesmo Assim</button>
    </div>
  `;

  overlay.classList.add('modal-overlay--active');
}

function showSuccessModal() {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal-content');

  modal.innerHTML = `
    <h3 class="modal__title">✅ Relatório Completo</h3>
    <div class="modal__body">
      <p>Todas as seções foram respondidas com sucesso!</p>
      <p class="text-muted mt-1">Escolha como deseja exportar o relatório:</p>
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" onclick="closeModal()">Continuar Editando</button>
      <button class="modal__btn modal__btn--confirm" onclick="exportReport()">📄 Exportar Relatório</button>
    </div>
  `;

  overlay.classList.add('modal-overlay--active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('modal-overlay--active');
}

function forceSubmit() {
  closeModal();
  exportReport();
}

// ─── Exportador de Relatório ──────────────────────────────────────

function exportReport() {
  const visibleSections = getVisibleSections();
  let report = '═══════════════════════════════════════════════════════\n';
  report += '  RELATÓRIO DE VISTORIA — SAVE (IN 23/2026)\n';
  report += '  Gerado em: ' + new Date().toLocaleString('pt-BR') + '\n';
  report += '═══════════════════════════════════════════════════════\n\n';

  visibleSections.forEach(section => {
    const status = APP.sectionStatus[section.id];
    const statusLabel = status === 'complete' ? '✅ COMPLETA' : status === 'incomplete' ? '⚠️ INCOMPLETA' : '⬜ NÃO VISITADA';

    report += `\n── SEÇÃO ${section.number}: ${section.title.toUpperCase()} [${statusLabel}] ──\n`;

    const visibleQs = section.questions.filter(q => isQuestionVisible(q));
    visibleQs.forEach(q => {
      if (q.type === 'heading') {
        report += `\n  📌 ${q.label}\n`;
        return;
      }
      if (q.type === 'alert') {
        report += `  ⚠ ${q.label}\n`;
        return;
      }

      const answer = APP.answers[q.id] || '(não respondida)';
      let displayAnswer = answer;
      if (q.type === 'yesno') {
        displayAnswer = answer === 'sim' ? '✓ SIM' : answer === 'nao' ? '✗ NÃO' : answer === 'na' ? '— N/A' : '(não respondida)';
      }
      if (q.type === 'select' && q.options && answer) {
        const opt = q.options.find(o => (typeof o === 'object' ? o.value : o) === answer);
        if (opt) displayAnswer = typeof opt === 'object' ? opt.label : opt;
      }

      report += `  • ${q.label}\n    → ${displayAnswer}\n`;
    });
  });

  report += '\n═══════════════════════════════════════════════════════\n';
  report += '  FIM DO RELATÓRIO\n';
  report += '═══════════════════════════════════════════════════════\n';

  // Download as text file
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const nome = APP.answers['nome_edificacao'] || 'vistoria';
  const data = new Date().toISOString().split('T')[0];
  a.download = `relatorio_${nome.replace(/\s+/g, '_')}_${data}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  closeModal();
}

// ─── Utilitários ──────────────────────────────────────────────────

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Toggle Sidebar (tablet portrait / mobile) ───────────────────

function toggleSidebar() {
  const sidebar = document.getElementById('checklist-sidebar');
  if (sidebar) sidebar.classList.toggle('checklist__sidebar--open');
}

// ─── Inicializar ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
