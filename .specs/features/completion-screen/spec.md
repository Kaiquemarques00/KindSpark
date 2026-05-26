# Feature spec — completion-screen (KindSpark)

## Meta

| Campo | Valor |
|-------|--------|
| **Feature** | `completion-screen` |
| **Status** | Specify + Design + Tasks — pronto para Execute |
| **Tipo** | Large — nova rota, hook de dados, celebração visual, analytics, integração no loop Today |
| **Fonte de produto** | `.specs/features/completion-screen/completion-screen.md` |
| **Fontes técnicas** | `kindspark-design-system.md` §7, `features/today/useTodayLoop.ts`, `lib/analytics/` |
| **Tom** | Acolhedor, leve, sem gamificação agressiva |
| **Copy de UI** | **Inglês** (`constants/copy.ts`, alinhado ao design system) |
| **Rastreio MVP** | HU-003, HU-005, HU-006, RF-003, RF-005, RF-006, RNF-004 |

## Problem Statement

Após tocar em **"I did it"**, o fluxo atual permanece na Today com um card inline de confirmação. A recompensa emocional é fraca, a sessão termina em segundos e o usuário raramente explora Progress ou History. O loop comportamental **Trigger → Action → Reward → Repeat** funciona na ação, mas a fase de **Reward** ainda é superficial.

A Completion Screen fecha esse gap com celebração breve, resumo de progresso e CTAs opcionais — sem bloquear o usuário nem adicionar fricção ao hábito principal.

## Goals

- [ ] Exibir tela dedicada de conclusão imediatamente após persistência válida de `done` (online ou enfileirada offline)
- [ ] Reforço emocional: mensagem positiva, resumo de streak e total de ações concluídas
- [ ] CTAs opcionais: **See my progress**, **See history**, **Close** — dismiss imediato permitido (BR-003)
- [ ] Micro-animação de celebração respeitando `reduce motion`
- [ ] Instrumentação: eventos de exibição, dismiss, CTAs e duração na tela
- [ ] Preservar regras de negócio existentes (RF-003, skip, offline, um done/dia)

## Out of Scope

| Item | Motivo |
|------|--------|
| Journaling, check-in emocional | Produto futuro; não faz parte do reward loop v0.1.1 |
| Achievements completos / streak freeze | Fora do escopo desta entrega |
| Rewarded ads | Monetização futura; apenas shell de banner existente permanece na Today |
| Compartilhamento social | Fora de escopo v0.1 |
| **Explorar mais ideias** (CTA futuro) | Backlog; não bloqueia MVP |
| Progresso semanal detalhado | P3 opcional; stats mensais já existem em Progress |
| Novas tabelas ou migrations SQL | Reutiliza `user_action_logs` + queries existentes |
| Interstitial antes de "I did it" | Proibido (BR-004) |

---

## User Stories

### P1: Tela de conclusão após "I did it" ⭐ MVP

**User Story**: Como usuário que completou a ação do dia, quero uma tela de celebração imediata para sentir recompensa emocional antes de fechar o app.

**Why P1**: Core da feature; completa o loop de hábito na fase Reward.

**Acceptance Criteria**:

1. WHEN o usuário toca "I did it" AND a conclusão é persistida com sucesso (insert online OU mutation enfileirada offline conforme RNF-004) THEN o app SHALL navegar para a Completion Screen.
2. WHEN a persistência falha (erro não recuperável, sem enqueue) THEN o app SHALL permanecer na Today com mensagem de erro AND SHALL NOT exibir a Completion Screen (BR-001, BR-002).
3. WHEN o usuário toca "Skip" OR refresh sem done THEN o app SHALL NOT exibir a Completion Screen (BR-001).
4. WHEN a Completion Screen é exibida THEN a conclusão SHALL já estar persistida ou enfileirada para sync — nunca simular sucesso sem persistência (BR-002).
5. WHEN o usuário toca "Close" OR usa gesto de voltar THEN o app SHALL retornar à Today sem bloqueio obrigatório (BR-003).

**Independent Test**: Today → "I did it" (online) → Completion Screen aparece → Close → Today mostra estado concluído.

**Requisitos**: `COMP-01` … `COMP-05`

---

### P1: Mensagem de celebração e resumo de progresso ⭐ MVP

**User Story**: Como usuário, quero ver uma mensagem positiva e meu progresso (streak e total concluído) para me sentir motivado a continuar.

**Why P1**: Conteúdo central da recompensa emocional.

**Acceptance Criteria**:

1. WHEN a Completion Screen abre THEN SHALL exibir headline de afirmação (ex.: "Amazing ✨" do design system) e subtítulo rotativo curto e positivo.
2. WHEN streak atual está disponível THEN SHALL exibir "Current streak" com valor em dias (reutilizar copy/padrão visual de Progress).
3. WHEN estatísticas agregadas estão disponíveis THEN SHALL exibir total de ações concluídas (período `month`, alinhado a Progress).
4. WHEN streak ou stats falham ao carregar THEN SHALL exibir apenas mensagem genérica de sucesso — sem estado de erro intrusivo (edge case dados incompletos).
5. WHEN ilustração celebratória não carregar THEN SHALL usar fallback peach (`#FFE8D8`) sem quebrar layout.

**Independent Test**: Usuário com streak 6 e logs no mês → tela mostra headline, streak "6 days", completed count coerente com Progress.

**Requisitos**: `COMP-06` … `COMP-10`

---

### P1: CTAs de engajamento opcional ⭐ MVP

**User Story**: Como usuário recompensado, quero ir rapidamente para Progress ou History se quiser ver mais detalhes.

**Why P1**: Aumenta navegação intra-sessão sem fricção.

**Acceptance Criteria**:

1. WHEN a tela renderiza THEN CTA primário SHALL ser "See my progress" (gradiente pill, design system).
2. WHEN usuário toca "See my progress" THEN app SHALL navegar para `/(tabs)/progress` AND registrar evento `completion_cta_progress`.
3. WHEN usuário toca "See history" THEN app SHALL navegar para `/(tabs)/history` AND registrar evento `completion_cta_history`.
4. WHEN usuário toca "Close" THEN app SHALL voltar à Today AND registrar `completion_screen_dismissed`.
5. WHEN nenhum CTA secundário é usado THEN usuário SHALL poder fechar em um toque (BR-003).

**Independent Test**: Completion → See my progress → tab Progress ativa; voltar manualmente; repetir com History e Close.

**Requisitos**: `COMP-11` … `COMP-15`

---

### P2: Feedback visual leve ⭐ Should have

**User Story**: Como usuário, quero um feedback visual suave (não gamificado) que reforce a celebração.

**Why P2**: Diferencia reward de um card estático; design system prevê celebração até 500ms.

**Acceptance Criteria**:

1. WHEN a tela monta AND `reduce motion` está desativado THEN SHALL executar micro-animação de entrada (fade/scale ~350–500ms) AND confetti/partículas sutis (≤ 12 partículas, opacidade baixa).
2. WHEN `reduce motion` está ativo THEN animações SHALL ser reduzidas a fade simples (~150ms) sem confetti (RUI-DS-04 / `useReducedMotion`).
3. WHEN animação termina THEN layout SHALL permanecer estável para leitura e toque nos CTAs.

**Independent Test**: Completar ação com motion on → partículas breves; ativar reduce motion no SO → apenas fade.

**Requisitos**: `COMP-16` … `COMP-18`

---

### P2: Analytics da Completion Screen

**User Story**: Como equipe de produto, quero medir exibição, dismiss, CTAs e tempo na tela para validar impacto em retenção e navegação.

**Why P2**: Métricas de sucesso dependem de instrumentação.

**Acceptance Criteria**:

1. WHEN Completion Screen é exibida THEN SHALL emitir `completion_screen_shown` com `action_date` e `offline: boolean`.
2. WHEN usuário sai da tela THEN SHALL emitir `completion_screen_dismissed` com `duration_ms`.
3. WHEN CTA Progress ou History é usado THEN SHALL emitir evento correspondente antes da navegação.
4. WHEN eventos são registrados THEN propriedades SHALL ser tipadas em `AnalyticsEvent` / `AnalyticsProperties`.

**Independent Test**: Dev console (`trackEvent`) mostra sequência shown → (cta_* | dismissed) com duration_ms plausível.

**Requisitos**: `COMP-19` … `COMP-22`

---

### P3: Progresso semanal (opcional)

**User Story**: Como usuário, quero ver quantos dias da semana concluí com ações para contexto adicional.

**Why P3**: Mencionado na spec de produto como opcional; não bloqueia MVP.

**Acceptance Criteria**:

1. WHEN query semanal estiver implementada AND dados existem THEN MAY exibir "X of 7 days this week" abaixo do streak.
2. WHEN query não existir THEN tela SHALL omitir seção sem placeholder de erro.

**Requisitos**: `COMP-23` (deferred)

---

## Regras de negócio (rastreio)

| ID | Regra | Requisitos |
|----|-------|------------|
| BR-001 | Completion Screen só após conclusão válida; nunca após Skip ou falha | `COMP-01`, `COMP-03`, `COMP-04` |
| BR-002 | Persistir (ou enfileirar offline) antes de exibir | `COMP-02`, `COMP-04` |
| BR-003 | Dismiss imediato; sem bloqueio | `COMP-05`, `COMP-15` |
| BR-004 | Sem anúncio interstitial antes de "I did it"; banner pós-conclusão permitido na Today | Fora desta feature (preservar `AdBannerShell`) |

---

## Edge Cases

- WHEN app está offline AND done é enfileirado THEN Completion Screen SHALL exibir com indicador opcional discreto (`offline: true` no analytics) — recompensa otimista alinhada a RNF-004.
- WHEN persistência falha após retry de rede THEN SHALL permanecer na Today com erro; sem Completion Screen.
- WHEN streak/stats indisponíveis THEN SHALL mostrar headline + CTAs apenas (`COMP-10`).
- WHEN usuário já tinha `done` no dia (`alreadyDone`) AND UI marca concluído THEN MAY exibir Completion Screen uma vez por sessão de done (sem segundo insert).
- WHEN largura < 360px THEN CTAs SHALL empilhar sem truncar headline.
- WHEN font scale > 100% THEN scroll SHALL permitir acesso a todos os CTAs.
- WHEN usuário abre Completion via deep link direto sem done no dia THEN SHALL redirecionar para Today (guard na rota).

---

## Requisitos consolidados (IDs rastreáveis)

| ID | Descrição | Prioridade | Story | Status |
|----|-----------|------------|-------|--------|
| COMP-01 | Navegar para Completion após done persistido/enfileirado | P0 | P1 Fluxo | Pending |
| COMP-02 | Não navegar se persistência falhar | P0 | P1 Fluxo | Pending |
| COMP-03 | Não exibir após Skip | P0 | P1 Fluxo | Pending |
| COMP-04 | Nunca simular sucesso sem persistência | P0 | P1 Fluxo | Pending |
| COMP-05 | Dismiss imediato (Close / back) | P0 | P1 Fluxo | Pending |
| COMP-06 | Headline de afirmação + subtítulo rotativo | P0 | P1 Conteúdo | Pending |
| COMP-07 | Exibir streak atual | P0 | P1 Conteúdo | Pending |
| COMP-08 | Exibir total completed (month) | P0 | P1 Conteúdo | Pending |
| COMP-09 | Fallback ilustração peach | P1 | P1 Conteúdo | Pending |
| COMP-10 | Degradar graciosamente se stats falharem | P0 | P1 Conteúdo | Pending |
| COMP-11 | CTA primário "See my progress" | P0 | P1 CTAs | Pending |
| COMP-12 | CTA secundário "See history" | P0 | P1 CTAs | Pending |
| COMP-13 | CTA "Close" | P0 | P1 CTAs | Pending |
| COMP-14 | Navegação correta para tabs | P0 | P1 CTAs | Pending |
| COMP-15 | CTAs não bloqueiam dismiss | P0 | P1 CTAs | Pending |
| COMP-16 | Micro-animação entrada | P1 | P2 Visual | Pending |
| COMP-17 | Confetti sutil com Reanimated | P1 | P2 Visual | Pending |
| COMP-18 | Respeitar reduce motion | P0 | P2 Visual | Pending |
| COMP-19 | Evento `completion_screen_shown` | P1 | P2 Analytics | Pending |
| COMP-20 | Evento `completion_screen_dismissed` + duration | P1 | P2 Analytics | Pending |
| COMP-21 | Eventos `completion_cta_progress` / `completion_cta_history` | P1 | P2 Analytics | Pending |
| COMP-22 | Tipagem em `AnalyticsEvent` | P1 | P2 Analytics | Pending |
| COMP-23 | Progresso semanal (opcional) | P3 | P3 | Deferred |
| COMP-24 | Guard: rota sem done do dia → Today | P1 | Edge | Pending |
| COMP-25 | Today pós-dismiss: estado concluído sem card redundante de celebração | P1 | Integração | Pending |

**Cobertura:** 25 requisitos | 24 mapeados em `tasks.md` (COMP-23 deferred) | 0 unmapped ⚠️

---

## Critérios de aceite (feature "feito")

### Fluxo e regras

- [ ] **CA-COMP-01**: "I did it" online → Completion Screen → Close → Today em estado done.
- [ ] **CA-COMP-02**: "Skip" → nunca abre Completion Screen.
- [ ] **CA-COMP-03**: Falha de save (sem enqueue) → permanece na Today com erro.
- [ ] **CA-COMP-04**: Offline com enqueue → Completion Screen + sync posterior intacto.

### Conteúdo e UI

- [ ] **CA-COMP-05**: Layout alinhado a `kindspark-design-system.md` §7 (illustration, affirmation, streak summary, CTA).
- [ ] **CA-COMP-06**: Streak e completed count batem com Progress para o mesmo usuário.
- [ ] **CA-COMP-07**: Copy 100% inglês em `constants/copy.ts`.

### CTAs e navegação

- [ ] **CA-COMP-08**: "See my progress" abre tab Progress; "See history" abre History.
- [ ] **CA-COMP-09**: Nenhum passo obrigatório além de dismiss.

### Motion e a11y

- [ ] **CA-COMP-10**: Reduce motion desativa confetti; alvos de toque ≥ 44×44.

### Analytics

- [ ] **CA-COMP-11**: Eventos completion_* visíveis no dev logger com propriedades corretas.

### Regressão

- [ ] **CA-COMP-12**: RF-003, RF-004, RNF-004 e checklist MVP v0.1 passam sem regressão.
- [ ] **CA-COMP-13**: `npm run gate` passa.

---

## Requirement Traceability (MVP ↔ completion-screen)

| Requisito completion | Requisito MVP | Verificação |
|----------------------|---------------|-------------|
| COMP-01, COMP-04 | RF-003, RNF-004 | Done online/offline |
| COMP-03 | RF-004 | Skip não abre tela |
| COMP-07, COMP-08 | RF-005, RF-006 | Streak/stats vs Progress |
| COMP-11…14 | HU-005, HU-006 | CTAs para tabs |
| COMP-18 | RNF-002, RUI-DS-04 | Simplicidade + motion |

---

## Eventos de tracking

| Evento | Quando | Propriedades sugeridas |
|--------|--------|------------------------|
| `completion_screen_shown` | mount da tela | `action_date`, `offline`, `streak` (se carregado) |
| `completion_screen_dismissed` | Close / back | `duration_ms`, `dismiss_method` |
| `completion_cta_progress` | tap CTA primário | `duration_ms` |
| `completion_cta_history` | tap CTA secundário | `duration_ms` |

*( `completion_screen_duration_ms` consolidado em `completion_screen_dismissed.duration_ms` )*

---

## Métricas de sucesso (produto)

Medir pós-release:

- Tempo médio na Completion Screen
- Taxa de clique em CTAs (progress vs history vs dismiss-only)
- Screens per session (antes/depois)
- Impacto em retenção D7 (cohort)

---

## Success Criteria

- [ ] Usuário completa loop Today → Completion → dismiss em < 15s mediana (sem fricção).
- [ ] Taxa de navegação para Progress ou History após completion > baseline atual (medir).
- [ ] Zero regressões em CA-COMP-12 e CA-COMP-13.
- [ ] Paridade visual com design system §7 (affirmation "Amazing ✨", streak summary, CTA primário).

---

## Referência visual

| Spec | Design system | Notas |
|------|---------------|-------|
| Completion Screen | § 7. Completion Screen | Illustration + "Amazing ✨" + streak + CTA |
| Tokens / motion | § Motion, Color Palette | celebration 500ms max; warm light only |
