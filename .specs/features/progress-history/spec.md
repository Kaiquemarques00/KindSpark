# Feature spec — progress-history (KindSpark)

## Meta

| Campo | Valor |
|-------|--------|
| **Feature** | `progress-history` |
| **Status** | Draft — Specify + Design + Tasks (2026-05-27) |
| **Tipo** | Large — evolução de duas tabs, novas queries read-only, heatmap, filtros, achievements leves, analytics |
| **Fonte de produto** | `.specs/features/progress-history/progress-history.md` |
| **Fontes técnicas** | `features/progress/*`, `features/history/*`, `lib/supabase/*`, `lib/streak/*`, `kindspark-design-system.md` |
| **Tom** | Acolhedor, explorável, sem gamificação pesada |
| **Copy de UI** | **Inglês** (`constants/copy.ts`, alinhado ao redesign) |
| **Rastreio MVP** | RF-005, RF-006, HU-005, HU-006 (extensão pós-MVP) |

## Problem Statement

As telas **Progress** e **History** já exibem streak atual, métricas do mês e lista recente (50 itens), mas o feedback ainda é superficial: falta contexto temporal (semana, calendário), recorde pessoal, conquistas leves além de milestones de streak, e o histórico não permite filtrar nem escalar além do limite fixo.

O usuário conclui ações na Today (e na Completion Screen), mas não percebe evolução clara nem é incentivado a explorar Progress/History — impactando tempo de sessão e retenção.

## Goals

- [ ] Progress mais rico: streak atual + **maior streak histórico**, stats reais, resumo semanal, heatmap/calendário, achievements leves
- [ ] History explorável: lista cronológica com **filtros** (status + janela temporal) e **paginação** para escalar (BR-004)
- [ ] Dados **somente** de `user_action_logs` persistidos — sem stats artificiais (BR-001, BR-002)
- [ ] Skips visualmente distintos de concluídos (BR-003 — preservar/reforçar `HistoryRow`)
- [ ] Empty states acolhedores para usuário novo e histórico vazio
- [ ] Instrumentação: `progress_screen_viewed`, `history_screen_viewed`, `achievement_viewed`, `history_filter_changed`, `calendar_day_tapped`
- [ ] Zero regressão em RF-005/RF-006 e gates do repo

## Out of Scope

| Item | Motivo |
|------|--------|
| Analytics emocionais, notas pessoais | Produto futuro (`progress-history.md`) |
| Ranking, comparações sociais, desafios semanais | Fora de escopo |
| Gamificação pesada (XP, níveis, loot) | Achievements **leves** apenas |
| Categoria como filtro dedicado | "Categoria (futuro)" na spec de produto |
| Novas tabelas / migrations | Read-only sobre schema v0.1 |
| Alterar loop Today / Completion | Features irmãs já entregues |
| Stats `all-time` na UI principal | Stats mensais + semana; all-time só onde necessário (ex.: total para achievement 30) |

---

## User Stories

### P1: Streak atual e recorde na Progress ⭐ MVP

**User Story**: Como usuário, quero ver meu streak atual e meu maior streak já alcançado para entender consistência e meu melhor momento.

**Why P1**: Reforço emocional imediato; RF-005 estendido.

**Acceptance Criteria**:

1. WHEN a Progress Screen carrega com dados válidos THEN SHALL exibir **current streak** (dias) derivado de `fetchCurrentStreak` / `computeStreak` (dados reais).
2. WHEN existem `done` históricos THEN SHALL exibir **best streak** (maior sequência consecutiva de dias com `done` no lookback configurado).
3. WHEN não há nenhum `done` THEN current streak SHALL ser `0` AND best streak SHALL ser `0` ou oculto com copy de empty state (PH-08).
4. WHEN fetch de streak falha THEN SHALL exibir erro recuperável com retry — sem inventar números (BR-002).

**Independent Test**: Usuário com logs em dias não consecutivos → current reflete grace de hoje/ontem; best ≥ current.

**Requisitos**: `PH-01`, `PH-02`, `PH-14`, `PH-15`

---

### P1: Estatísticas gerais na Progress ⭐ MVP

**User Story**: Como usuário, quero ver totais de concluídos, skips e taxa de conclusão para entender meu padrão no período.

**Why P1**: Stats já parcialmente existem (`StatsRow` + `fetchActionStats('month')`); consolidar e alinhar à spec.

**Acceptance Criteria**:

1. WHEN stats do mês carregam THEN SHALL exibir `completed`, `skipped`, `completionRate` via `fetchActionStats('month')` — valores agregados reais (BR-001).
2. WHEN período sem logs THEN completed/skipped SHALL ser `0` AND rate `0%` — não valores placeholder fictícios.
3. WHEN stats falham parcialmente THEN Progress SHALL degradar (omitir bloco ou mostrar retry) sem quebrar streak (PH-15).

**Independent Test**: Mesmos números que query Supabase manual para o mês corrente.

**Requisitos**: `PH-03`, `PH-13`, `PH-14`

---

### P1: Resumo semanal na Progress ⭐ MVP

**User Story**: Como usuário, quero um resumo da semana corrente (ex.: "You completed 5 of 7 days this week") para contexto de curto prazo.

**Why P1**: Spec de produto destaca resumo semanal como pilar de exploração.

**Acceptance Criteria**:

1. WHEN semana corrente (locale, segunda–domingo ou domingo–sábado — ver `design.md`) é calculada THEN SHALL contar dias distintos com ≥1 `done` dentro da semana até hoje inclusive.
2. WHEN resumo renderiza THEN SHALL exibir copy EN no formato configurado em `copy.progress.weeklySummary` com `{done}` e `{total}` (total = 7).
3. WHEN `done` na semana é 0 THEN SHALL exibir mensagem neutra encorajadora (sem shame).

**Independent Test**: 3 `done` em dias distintos na semana → "3 of 7 days".

**Requisitos**: `PH-04`, `PH-05`

---

### P1: Histórico cronológico com filtros ⭐ MVP

**User Story**: Como usuário, quero filtrar meu histórico por status e período para revisar momentos relevantes.

**Why P1**: History hoje é lista fixa sem filtros.

**Acceptance Criteria**:

1. WHEN History Screen abre THEN lista SHALL estar ordenada por `action_date` desc, depois `created_at` desc (RF-006).
2. WHEN cada item renderiza THEN SHALL mostrar título, data relativa/absoluta, status — skip visualmente distinto de done (BR-003).
3. WHEN usuário seleciona filtro **All** THEN SHALL listar todos os status na janela padrão.
4. WHEN filtro **Completed** THEN SHALL mostrar apenas `status === 'done'`.
5. WHEN filtro **Skipped** THEN SHALL mostrar apenas `status === 'skipped'`.
6. WHEN filtro **Last 7 days** / **Last 30 days** THEN SHALL restringir por `action_date` local.
7. WHEN filtro muda THEN SHALL registrar `history_filter_changed` com `filter` (PH-20).
8. WHEN combinação filtro + página não tem itens THEN SHALL empty state amigável (PH-16).

**Independent Test**: Alternar filtros altera contagem visível; skips com estilo diferente.

**Requisitos**: `PH-09`, `PH-10`, `PH-11`, `PH-16`, `PH-20`

---

### P1: Escalar histórico (paginação / virtualização) ⭐ MVP

**User Story**: Como usuário com muitas ações, quero rolar o histórico sem travar o app.

**Why P1**: BR-004 explícito na spec de produto.

**Acceptance Criteria**:

1. WHEN lista excede página inicial THEN SHALL carregar mais via `onEndReached` (cursor/offset) OU virtualização eficiente com `FlatList` + fetch paginado.
2. WHEN carregando próxima página THEN SHALL indicador discreto no footer — sem bloquear scroll.
3. WHEN não há mais páginas THEN SHALL parar requests adicionais.
4. Nunca SHALL fabricar entradas para preencher lista (BR-002).

**Independent Test**: Conta com >50 logs → scroll carrega mais itens reais.

**Requisitos**: `PH-12`, `PH-04` (history scale)

---

### P2: Heatmap / calendário de atividade

**User Story**: Como usuário, quero ver um calendário dos últimos dias com concluído, pulado ou sem atividade para visualizar padrões.

**Why P2**: Alto valor exploratório; depende de query diária agregada.

**Acceptance Criteria**:

1. WHEN Progress carrega mapa de atividade THEN cada dia no grid SHALL ter estado: `done` | `skipped` | `none` (sem log ou só outros status ignorados).
2. WHEN dia tem `done` e `skipped` no mesmo dia THEN estado SHALL ser `done` (done prevalece).
3. WHEN usuário toca um dia com atividade THEN SHALL emitir `calendar_day_tapped` com `action_date` e `status` (PH-21).
4. WHEN reduce motion / a11y THEN células SHALL ter `accessibilityLabel` descritivo.

**Independent Test**: Grid últimos 35 dias reflete logs reais; tap dispara evento.

**Requisitos**: `PH-06`, `PH-21`

---

### P2: Achievements leves

**User Story**: Como usuário, quero ver conquistas simples (primeira ação, 7 dias de streak, 30 ações) sem gamificação pesada.

**Why P2**: Diferente dos streak milestones 3/7/14/30 já exibidos — achievements por **ações totais** e marcos de entrada.

**Acceptance Criteria**:

1. WHEN usuário tem ≥1 `done` all-time THEN achievement **First kindness** SHALL estar unlocked.
2. WHEN current ou best streak ≥ 7 THEN achievement **7-day streak** SHALL estar unlocked.
3. WHEN total `done` all-time ≥ 30 THEN achievement **30 completed** SHALL estar unlocked.
4. WHEN usuário toca badge desbloqueado THEN SHALL emitir `achievement_viewed` com `achievement_id` (PH-19).
5. Achievements SHALL coexistir com badges de milestone de streak existentes sem duplicar copy confusa (ver design).

**Independent Test**: Seed com 30 dones → terceiro badge unlocked.

**Requisitos**: `PH-07`, `PH-19`

---

### P2: Analytics das telas

**User Story**: Como equipe de produto, quero medir visualizações e interações em Progress e History.

**Acceptance Criteria**:

1. WHEN Progress ganha foco (`useFocusEffect`) THEN SHALL emitir `progress_screen_viewed` (uma vez por focus).
2. WHEN History ganha foco THEN SHALL emitir `history_screen_viewed`.
3. WHEN eventos são emitidos THEN tipos SHALL constar em `AnalyticsEvent`.

**Requisitos**: `PH-17`, `PH-18`

---

## Regras de negócio (rastreio)

| ID | Regra | Requisitos |
|----|-------|------------|
| BR-001 | Mostrar apenas dados persistidos reais | `PH-14`, todas stories de dados |
| BR-002 | Nunca gerar estatísticas artificiais | `PH-13`, `PH-03`, `PH-12` |
| BR-003 | Skips visualmente diferenciados | `PH-11` |
| BR-004 | Histórico escala com paginação/virtualização | `PH-12` |

---

## Edge Cases

- WHEN usuário novo sem logs THEN Progress SHALL exibir empty state: **"Your kindness journey starts today."** (PH-08) + CTA implícito via copy existente para Today.
- WHEN histórico vazio THEN History SHALL manter empty state EN (`copy.history.empty`) — PH-16.
- WHEN filtro não retorna itens THEN empty state específico de filtro (PH-16).
- WHEN `action_id` órfão (log sem action) THEN entrada SHALL ser omitida na lista — sem crash (PH-15).
- WHEN streak/stats/heatmap falham parcialmente THEN UI SHALL degradar seção a seção (PH-15).
- WHEN offline THEN SHALL exibir último fetch em cache se existir OU loading/error — sem inventar dados frescos.

---

## Requisitos consolidados (IDs rastreáveis)

| ID | Descrição | Prioridade | Story | Status |
|----|-----------|------------|-------|--------|
| PH-01 | Exibir current streak (dados reais) | P0 | P1 Streak | Pending |
| PH-02 | Exibir best (max) streak histórico | P0 | P1 Streak | Pending |
| PH-03 | Stats: completed, skipped, completion rate (mês) | P0 | P1 Stats | Pending |
| PH-04 | Resumo semanal "X of 7 days" | P0 | P1 Weekly | Pending |
| PH-05 | Porcentagem semanal opcional na UI | P1 | P1 Weekly | Pending |
| PH-06 | Heatmap/calendário done/skipped/none | P1 | P2 Calendar | Pending |
| PH-07 | Achievements leves (first, 7d streak, 30 done) | P1 | P2 Achievements | Pending |
| PH-08 | Empty state Progress usuário novo | P0 | Edge | Pending |
| PH-09 | Lista History cronológica com metadados | P0 | P1 History | Pending |
| PH-10 | Filtros: all, done, skipped, 7d, 30d | P0 | P1 History | Pending |
| PH-11 | Skip visualmente distinto (HistoryRow) | P0 | P1 History | Pending |
| PH-12 | Paginação / virtualização History | P0 | P1 History | Pending |
| PH-13 | Sem stats artificiais | P0 | BR-002 | Pending |
| PH-14 | Somente dados persistidos | P0 | BR-001 | Pending |
| PH-15 | Fallback seguro dados inconsistentes | P0 | Edge | Pending |
| PH-16 | Empty states History (vazio + filtro) | P0 | Edge | Pending |
| PH-17 | Evento `progress_screen_viewed` | P1 | P2 Analytics | Pending |
| PH-18 | Evento `history_screen_viewed` | P1 | P2 Analytics | Pending |
| PH-19 | Evento `achievement_viewed` | P1 | P2 Analytics | Pending |
| PH-20 | Evento `history_filter_changed` | P1 | P1 History | Pending |
| PH-21 | Evento `calendar_day_tapped` | P1 | P2 Calendar | Pending |
| PH-22 | Preservar milestones streak 3/7/14/30 existentes | P1 | Integração | Pending |
| PH-23 | Copy 100% inglês novas strings | P0 | Transversal | Pending |

**Cobertura:** 23 requisitos | 23 mapeados em `tasks.md` | 0 unmapped ⚠️

---

## Critérios de aceite (feature "feito")

### Progress

- [ ] **CA-PH-01**: Current + best streak coerentes com logs Supabase.
- [ ] **CA-PH-02**: StatsRow bate com `fetchActionStats('month')`.
- [ ] **CA-PH-03**: Resumo semanal correto para semana local.
- [ ] **CA-PH-04**: Heatmap reflete últimos N dias de logs.
- [ ] **CA-PH-05**: Achievements leves unlock conforme regras PH-07.
- [ ] **CA-PH-06**: Empty state novo usuário exibido sem logs.

### History

- [ ] **CA-PH-07**: Cinco filtros funcionam e disparam analytics.
- [ ] **CA-PH-08**: Paginação carrega >50 itens reais.
- [ ] **CA-PH-09**: Skip vs done visualmente distintos.

### Regressão e qualidade

- [ ] **CA-PH-10**: Completion → Progress/History CTAs ainda funcionam.
- [ ] **CA-PH-11**: `npm run gate` passa.
- [ ] **CA-PH-12**: RF-005 e RF-006 comportamento base preservado.

---

## Requirement Traceability (MVP ↔ progress-history)

| Requisito PH | Requisito MVP | Verificação |
|--------------|---------------|-------------|
| PH-01, PH-02 | RF-005 | Streak vs logs |
| PH-09, PH-12 | RF-006 | Histórico ordenado e escalável |
| PH-11 | RF-004 | Skip distinto |
| PH-14, PH-13 | RNF dados | Sem mock |

---

## Eventos de tracking

| Evento | Quando | Propriedades sugeridas |
|--------|--------|------------------------|
| `progress_screen_viewed` | focus Progress tab | `has_streak`, `has_stats` |
| `history_screen_viewed` | focus History tab | `entry_count` (primeira página) |
| `achievement_viewed` | tap achievement unlocked | `achievement_id` |
| `history_filter_changed` | mudança de filtro | `filter` |
| `calendar_day_tapped` | tap célula heatmap | `action_date`, `status` |

---

## Métricas de sucesso (produto)

Medir pós-release (conforme `progress-history.md`):

- Tempo médio na Progress Screen
- Tempo médio na History Screen
- Taxa de navegação pós-conclusão (Completion → tabs)
- Impacto em retenção D7 (cohort)

---

## Success Criteria

- [ ] Usuário identifica evolução (streak + semana + calendário) em < 10s na Progress.
- [ ] ≥1 filtro de History usado em sessões com histórico (medir via `history_filter_changed`).
- [ ] Zero regressões CA-PH-10…12.
- [ ] Paridade visual warm light / tokens existentes (`theme/tokens.ts`).
