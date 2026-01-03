
import React from 'react';
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  Info, 
  Lightbulb, 
  ShieldCheck, 
  Wrench 
} from 'lucide-react';

export const DASHBOARD_LIGHTS = [
  { id: '1', name: 'Injeção Eletrônica', color: 'orange', description: 'Problema no sistema de emissões ou combustão.', icon: <AlertTriangle className="text-orange-500" /> },
  { id: '2', name: 'Pressão do Óleo', color: 'red', description: 'Baixa pressão ou nível de óleo. Pare o carro imediatamente!', icon: <AlertTriangle className="text-red-500" /> },
  { id: '3', name: 'Bateria/Alternador', color: 'red', description: 'Problema no sistema elétrico ou carga da bateria.', icon: <AlertTriangle className="text-red-500" /> },
  { id: '4', name: 'Temperatura', color: 'red', description: 'Motor superaquecido. Risco de danos graves.', icon: <AlertTriangle className="text-red-500" /> },
  { id: '5', name: 'ABS', color: 'orange', description: 'Problema no sistema de freios antitravamento.', icon: <AlertTriangle className="text-orange-500" /> },
  { id: '6', name: 'Airbag', color: 'orange', description: 'Falha no sistema de segurança suplementar.', icon: <AlertTriangle className="text-orange-500" /> },
];

export const GUIDES = [
  {
    id: 'manutencao-pratica',
    title: 'Guia Prático de Manutenção',
    icon: <Wrench />,
    description: 'Aprenda o básico para manter seu veículo sempre em dia.',
    content: `
      ### Itens de verificação quinzenal:
      - Nível do óleo do motor.
      - Calibragem dos pneus (incluindo o estepe).
      - Nível do fluido de arrefecimento (com motor frio).
      - Nível do fluido de freio.
      - Funcionamento de todas as lâmpadas.
    `
  },
  {
    id: 'problemas-comuns',
    title: 'Problemas Comuns',
    icon: <HelpCircle />,
    description: 'Identifique ruídos e comportamentos estranhos.',
    content: `
      ### Ruídos Estranhos:
      - **Assobio ao frear:** Pastilhas de freio gastas.
      - **Estalos ao esterçar:** Problemas na homocinética.
      - **Batidas secas em buracos:** Suspensão ou amortecedores.
      - **Motor morrendo em marcha lenta:** Possível sujeira no TBI ou bicos.
    `
  },
  {
    id: 'oficina-segura',
    title: 'Não seja enganado na oficina',
    icon: <ShieldCheck />,
    description: 'Dicas para não pagar por serviços desnecessários.',
    content: `
      ### Dicas de Ouro:
      1. Peça sempre o orçamento por escrito.
      2. Solicite as peças velhas de volta.
      3. Desconfie de "limpezas milagrosas" de bicos ou motor (descarbonização) sem diagnóstico prévio.
      4. Verifique o manual do proprietário antes de aceitar trocas de fluidos.
    `
  },
  {
    id: 'emergencia',
    title: 'Emergência Automotiva',
    icon: <AlertTriangle />,
    description: 'O que fazer em casos de pane ou acidente.',
    content: `
      ### Procedimentos:
      - Sinalize o local com o triângulo (pelo menos 30 metros de distância).
      - Ligue o pisca-alerta.
      - Saia do veículo e fique em local seguro (fora da pista).
      - Tenha em mãos o número da sua seguradora ou guincho de confiança.
    `
  }
];

export const CHECKLIST_ITEMS = [
  'Nível de óleo verificado',
  'Pneus calibrados (incluindo estepe)',
  'Luzes (Faróis, Setas, Freio) funcionando',
  'Limpadores de para-brisa (palhetas) em bom estado',
  'Líquido de arrefecimento no nível',
  'Fluido de freio no nível e cor correta',
  'Estado das correias (sem rachaduras)',
  'Pastilhas de freio (espessura)',
  'Vazamentos visíveis sob o veículo',
  'Extintor no prazo de validade',
  'Bateria (terminais limpos e sem zinabre)',
  'Nível de fluido da direção hidráulica',
  'Estado da suspensão (sem barulhos metálicos)',
  'Funcionamento do ar-condicionado',
  'Integridade dos cintos de segurança',
  'Triângulo, macaco e chave de roda no lugar',
  'Documentação (CRLV) em dia'
];

export const VIDEO_LESSONS = [
  { id: '1', title: 'Dicas para dirigir bem na cidade', url: 'https://www.youtube.com/embed/oH48FnyYNZ0' },
  { id: '2', title: 'Aprenda a sair com o carro rapidamente!', url: 'https://www.youtube.com/embed/fhVDFfDrC0g' },
  { id: '3', title: 'Aprenda a passar e reduzir marcha corretamente!', url: 'https://www.youtube.com/embed/zM0vauwPIbg' },
  { id: '4', title: 'Baliza perfeita em apenas 3 minutos!', url: 'https://www.youtube.com/embed/e5GklE4hJx8' },
];
