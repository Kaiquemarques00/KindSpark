# Feature: Tela de Conclusão (Completion Screen)

> **Documentação SDD (implementação):** [`spec.md`](./spec.md) · [`design.md`](./design.md) · [`tasks.md`](./tasks.md)  
> Este arquivo é a **fonte de produto** (visão, problema, fluxo). Requisitos rastreáveis e tarefas de Execute ficam nos artefatos SDD.

## Visão Geral

A Tela de Conclusão será exibida imediatamente após o usuário marcar a ação diária como concluída (`I did it`).

Seu objetivo é reforçar emocionalmente o comportamento positivo, completar corretamente o loop de hábito e incentivar engajamento adicional de forma opcional, sem adicionar fricção à experiência principal.

Essa feature busca aumentar tempo de uso saudável e retenção, preservando a filosofia de simplicidade do KindSpark.

---

## Problema

Fluxo atual:

Today Screen → I did it → confirmação inline → usuário fecha o app

Consequências:

- sessões extremamente curtas
- recompensa emocional fraca
- baixa exploração de outras áreas do app
- pouca oportunidade de monetização com anúncios
- loop comportamental incompleto no estágio de reward

O hábito funciona, mas a etapa de recompensa ainda é superficial.

---

## Objetivo

Fortalecer a fase de recompensa do loop de hábito:

Trigger → Action → Reward → Repeat

Resultados esperados:

- aumento do tempo médio por sessão
- aumento de navegação para Progress e History
- maior motivação por streak
- melhor percepção emocional de progresso
- criação de ponto natural para monetização futura

---

## Fluxo do Usuário

Fluxo esperado:

Usuário abre o app
→ visualiza ação do dia
→ toca em "I did it"
→ ação é persistida
→ Tela de Conclusão é exibida

Ações possíveis:

- Ver progresso
- Ver histórico
- Fechar e voltar
- (futuro) Explorar mais ideias

---

## Componentes da Interface

### Mensagem de Celebração

Mensagens curtas e positivas.

Exemplos:

- Você tornou o dia de alguém melhor ✨
- Uma boa ação concluída 🌱
- Pequenas ações criam grandes mudanças 💛

---

### Resumo de Progresso

Exibir:

- streak atual
- total de ações concluídas
- progresso semanal (opcional)

Exemplo:

Streak atual: 6 dias

---

### Feedback Visual

Adicionar recompensa visual leve:

- micro animação
- confetti sutil
- transições suaves
- ícones com movimento discreto

Evitar gamificação agressiva.

---

### CTAs

Primário:

- Ver meu progresso

Secundários:

- Ver histórico
- Fechar

Futuro:

- Explorar mais ideias

---

## Regras de Negócio

### BR-001

A Tela de Conclusão só deve aparecer após conclusão válida da ação.

Não exibir após:

- Skip
- falha ao salvar
- recuperação de estado inconsistente

---

### BR-002

A conclusão deve ser persistida antes da exibição da tela.

A interface nunca pode simular sucesso sem persistência.

---

### BR-003

O usuário pode fechar imediatamente.

Não deve existir bloqueio obrigatório.

---

### BR-004

Nenhum anúncio pode interromper a ação antes da conclusão.

Permitido:

- banner após conclusão

Proibido:

- interstitial antes do "I did it"

---

## Eventos de Tracking

Eventos sugeridos:

- completion_screen_shown
- completion_screen_dismissed
- completion_cta_progress
- completion_cta_history
- completion_screen_duration_ms

---

## Edge Cases

### Offline

Se a conclusão usar persistência otimista:

- exibir sucesso
- sincronizar posteriormente

Se falhar:

tratar separadamente.

---

### Dados incompletos

Se streak ou estatísticas falharem:

mostrar apenas mensagem genérica de sucesso.

---

## Fora de Escopo

Não inclui:

- journaling
- check-in emocional
- achievements completos
- streak freeze
- rewarded ads
- compartilhamento social

---

## Métricas de Sucesso

Medir:

- tempo médio na tela
- taxa de clique em CTAs
- screens per session
- impacto em retenção D7