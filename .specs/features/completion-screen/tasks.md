# Tasks — completion-screen (atomic + verificação)

**Spec**: `.specs/features/completion-screen/spec.md`  
**Design**: `.specs/features/completion-screen/design.md`  
**Status**: Draft — pronto para Execute

Legenda: **[P]** paralelizável na mesma fase (sem deps cruzadas); deps por ID.

**Gate padrão:** `npm run gate` (Full — lint + typecheck, igual CI). Quick: `npm run gate:quick` em tarefas de deps/copy puras.

**Testes:** Matriz em `.specs/TESTING.md` — telas/features = manual + gate estático (`Tests: none`).

---

## Execution Plan

### Phase 1 — Copy + analytics foundation (sequential)

```
COMP-T-001 → COMP-T-002
```

### Phase 2 — Data + UI primitives (parallel após Phase 1)

```
COMP-T-002 ──┬→ COMP-T-003 [P]
             └→ COMP-T-004 [P]
```

### Phase 3 — Route + screen (sequential)

```
COMP-T-003 + COMP-T-004 → COMP-T-005 → COMP-T-006 → COMP-T-007
```

### Phase 4 — Integration (sequential)

```
COMP-T-007 → COMP-T-008 → COMP-T-009
```

### Phase 5 — Verify (sequential)

```
COMP-T-009 → COMP-T-010 → COMP-T-011
```

### Parallel Execution Map

```
Phase 1:
  COMP-T-001 ──→ COMP-T-002

Phase 2:
  COMP-T-002 complete, then:
    ├── COMP-T-003 [P]
    └── COMP-T-004 [P]

Phase 3:
  COMP-T-003 + COMP-T-004 ──→ COMP-T-005 ──→ COMP-T-006 ──→ COMP-T-007

Phase 4:
  COMP-T-007 ──→ COMP-T-008 ──→ COMP-T-009

Phase 5:
  COMP-T-009 ──→ COMP-T-010 ──→ COMP-T-011
```

---

## Task Breakdown

### COMP-T-001: Adicionar copy EN da Completion Screen

**What**: Criar seção `copy.completion` com headline, subtítulos rotativos, labels de stats e CTAs.  
**Where**: `constants/copy.ts`  
**Depends on**: None  
**Reuses**: `copy.today.amazing`, padrões `copy.progress`  
**Requirements**: `COMP-06`, `COMP-11`, `COMP-12`, `COMP-13`, `CA-COMP-07`

**Done when**:

- [x] `headline: 'Amazing ✨'` (ou reexport de `today.amazing`)
- [x] Array `messages[]` com ≥ 3 subtítulos positivos EN
- [x] CTAs: `seeProgress`, `seeHistory`, `close`
- [x] Labels: `currentStreak`, `completedActions`
- [x] `npm run gate:quick` passa

**Tests**: none  
**Gate**: quick  
**Commit**: `feat(completion-screen): add completion copy constants`

---

### COMP-T-002: Estender eventos de analytics

**What**: Adicionar tipos `completion_screen_*` e `completion_cta_*` em `AnalyticsEvent`.  
**Where**: `lib/analytics/events.ts`  
**Depends on**: COMP-T-001  
**Reuses**: Padrão existente de eventos v0.1  
**Requirements**: `COMP-19`, `COMP-20`, `COMP-21`, `COMP-22`

**Done when**:

- [x] Quatro novos literals no union type
- [x] TypeScript compila sem erros em `track.ts` call sites
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): add completion analytics events`

---

### COMP-T-003: Criar `useCompletionSummary` hook [P]

**What**: Hook que busca streak + `fetchActionStats('month')` com degradação parcial.  
**Where**: `features/completion/useCompletionSummary.ts`, `features/completion/index.ts`  
**Depends on**: COMP-T-002  
**Reuses**: `lib/supabase/streak.ts`, `lib/supabase/action-stats.ts`, padrão `useProgress.ts`  
**Requirements**: `COMP-07`, `COMP-08`, `COMP-10`

**Done when**:

- [x] Retorna `{ streak, completedCount, loading, error }`
- [x] Falha parcial mantém campos disponíveis
- [x] Export via `features/completion/index.ts`
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): add useCompletionSummary hook`

---

### COMP-T-004: Criar `CelebrationBurst` + helper de mensagem [P]

**What**: Componente de partículas Reanimated + `pickCelebrationMessage(actionDate)`.  
**Where**: `components/ui/CelebrationBurst.tsx`, `features/completion/pick-celebration-message.ts`, exports em `components/ui/index.ts`  
**Depends on**: COMP-T-002  
**Reuses**: `useReducedMotion`, `theme/motion.ts`, `copy.completion.messages`  
**Requirements**: `COMP-16`, `COMP-17`, `COMP-18`

**Done when**:

- [x] ≤ 12 partículas, duração ≤ 500ms, `pointerEvents="none"`
- [x] Reduce motion → fade only, sem partículas
- [x] `pickCelebrationMessage` determinístico por date string
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): add celebration burst animation`

---

### COMP-T-005: Registrar rota modal + thin route

**What**: `Stack.Screen` completion modal + `app/completion.tsx`.  
**Where**: `app/_layout.tsx`, `app/completion.tsx`  
**Depends on**: COMP-T-003, COMP-T-004  
**Reuses**: Padrão thin routes `(onboarding)/welcome.tsx`  
**Requirements**: `COMP-01` (infra navegação)

**Done when**:

- [x] Modal `presentation: 'modal'`, `headerShown: false`, `animation: 'fade'`
- [x] `completion.tsx` renderiza placeholder ou `CompletionScreen` stub compilável
- [x] Deep link `/completion` resolve sem crash
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): add completion modal route`

---

### COMP-T-006: Implementar `CompletionScreen`

**What**: Tela completa — illustration, headline, summary card, CTAs, loading degradável.  
**Where**: `features/completion/CompletionScreen.tsx`  
**Depends on**: COMP-T-005  
**Reuses**: `ScreenShell`, `Button`, `AppText`, `Card`, `Illustration`, `useCompletionSummary`, `CelebrationBurst`, `pickCelebrationMessage`  
**Requirements**: `COMP-06` … `COMP-15`, `COMP-09`, `COMP-24`

**Done when**:

- [x] Layout conforme design.md (affirmation, streak, completed, 3 CTAs)
- [x] Guard: sem `actionDate` param → redirect `/(tabs)`
- [x] Touch targets ≥ 44×44 nos botões
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): implement CompletionScreen UI`

---

### COMP-T-007: Instrumentar analytics na Completion Screen

**What**: `completion_screen_shown`, dismiss/CTA events com `duration_ms`.  
**Where**: `features/completion/CompletionScreen.tsx`  
**Depends on**: COMP-T-006  
**Reuses**: `lib/analytics/track.ts`  
**Requirements**: `COMP-19` … `COMP-22`

**Done when**:

- [x] `shown` no mount com `action_date`, `offline`
- [x] `dismissed` no Close/back com `duration_ms`
- [x] `completion_cta_progress` / `completion_cta_history` antes de navegar
- [x] Dev console exibe sequência correta em smoke manual
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): track completion screen analytics`

---

### COMP-T-008: Integrar navegação pós-done em `useTodayLoop`

**What**: Após persistência/enqueue bem-sucedida, `router.push` com params; nunca em skip/falha.  
**Where**: `features/today/useTodayLoop.ts`  
**Depends on**: COMP-T-007  
**Reuses**: `expo-router` router, paths offline existentes (~155–198)  
**Requirements**: `COMP-01`, `COMP-02`, `COMP-03`, `COMP-04`, `CA-COMP-01`, `CA-COMP-03`, `CA-COMP-04`

**Done when**:

- [ ] Online success → push `/completion?actionDate=…&offline=false`
- [ ] Offline enqueue → push com `offline=true`
- [ ] Erro sem enqueue → sem push
- [ ] Skip → sem push
- [ ] `npm run gate` passa

**Verify**:

- Tap "I did it" online → Completion abre
- Airplane mode → done enfileirado → Completion abre
- Simular erro API → permanece Today

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): navigate to completion after done`

---

### COMP-T-009: Ajustar Today pós-completion + CTAs navigation

**What**: Remover card celebratório inline redundante; wire `router.replace` nos CTAs da Completion.  
**Where**: `features/today/TodayScreen.tsx`, `features/completion/CompletionScreen.tsx`  
**Depends on**: COMP-T-008  
**Reuses**: `copy.today.loggedFor`, estado `isCompleted`  
**Requirements**: `COMP-14`, `COMP-25`, `CA-COMP-08`, `CA-COMP-09`

**Done when**:

- [ ] Today done state: caption logged only (sem card completedTitle/subtitle)
- [ ] CTA Progress → `router.replace('/(tabs)/progress')`
- [ ] CTA History → `router.replace('/(tabs)/history')`
- [ ] Close → `router.back()` retorna Today done
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(completion-screen): simplify today done state and wire CTAs`

---

### COMP-T-010: Checklist UAT manual

**What**: Executar critérios CA-COMP-* da spec em dispositivo/simulador.  
**Where**: — (verificação manual)  
**Depends on**: COMP-T-009  
**Reuses**: Checklist em `spec.md` § Critérios de aceite  
**Requirements**: Todos COMP-* P0/P1 exceto COMP-23

**Done when**:

- [ ] CA-COMP-01 … CA-COMP-11 verificados manualmente
- [ ] Regressão RF-003/004 e offline OK
- [ ] Reduce motion testado
- [ ] Screenshots opcionais anexados ao PR

**Tests**: manual  
**Gate**: full (`npm run gate` antes do PR)

**Verify**:

```bash
npm run gate
npx expo start
# Fluxos: done online, done offline, skip, fail, CTAs, close, reduce motion
```

**Commit**: N/A (verificação only) ou doc update em spec status

---

### COMP-T-011: Atualizar status da feature nos docs SDD

**What**: Marcar spec/design/tasks Status → Approved/Done e ROADMAP v0.1.1.  
**Where**: `.specs/features/completion-screen/spec.md`, `design.md`, `tasks.md`, `.specs/ROADMAP.md`  
**Depends on**: COMP-T-010  
**Requirements**: Encerramento TLC

**Done when**:

- [ ] Meta Status atualizado após gate + UAT
- [ ] ROADMAP referencia spec path `completion-screen/`
- [ ] Requisitos COMP-* marcados Done na tabela traceability

**Tests**: none  
**Gate**: quick  
**Commit**: `docs(completion-screen): mark feature spec complete`

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| COMP-T-001: copy constants | 1 file, 1 concern | ✅ Granular |
| COMP-T-002: analytics types | 1 file | ✅ Granular |
| COMP-T-003: useCompletionSummary | 1 hook | ✅ Granular |
| COMP-T-004: CelebrationBurst + picker | 2 arquivos coesos (motion) | ✅ Granular |
| COMP-T-005: route registration | 2 arquivos rota | ✅ Granular |
| COMP-T-006: CompletionScreen UI | 1 screen component | ✅ Granular |
| COMP-T-007: analytics wiring | 1 file modify | ✅ Granular |
| COMP-T-008: useTodayLoop nav | 1 hook modify | ✅ Granular |
| COMP-T-009: Today + CTA nav | 2 files integração | ✅ Granular |
| COMP-T-010: UAT manual | verificação | ✅ Granular |
| COMP-T-011: doc status | docs only | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|------|------------------------|---------------|--------|
| COMP-T-001 | None | Phase 1 start | ✅ Match |
| COMP-T-002 | COMP-T-001 | T-001 → T-002 | ✅ Match |
| COMP-T-003 | COMP-T-002 | T-002 → T-003 [P] | ✅ Match |
| COMP-T-004 | COMP-T-002 | T-002 → T-004 [P] | ✅ Match |
| COMP-T-005 | COMP-T-003, COMP-T-004 | T-003+T-004 → T-005 | ✅ Match |
| COMP-T-006 | COMP-T-005 | T-005 → T-006 | ✅ Match |
| COMP-T-007 | COMP-T-006 | T-006 → T-007 | ✅ Match |
| COMP-T-008 | COMP-T-007 | T-007 → T-008 | ✅ Match |
| COMP-T-009 | COMP-T-008 | T-008 → T-009 | ✅ Match |
| COMP-T-010 | COMP-T-009 | T-009 → T-010 | ✅ Match |
| COMP-T-011 | COMP-T-010 | T-010 → T-011 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
|------|------------|-----------------|-----------|--------|
| COMP-T-001 | constants | gate estático | none + gate:quick | ✅ OK |
| COMP-T-002 | lib/analytics | gate estático | none + gate:full | ✅ OK |
| COMP-T-003 | features hook | manual + gate | none + gate:full | ✅ OK |
| COMP-T-004 | components/ui | manual + gate | none + gate:full | ✅ OK |
| COMP-T-005 | app routes | manual + gate | none + gate:full | ✅ OK |
| COMP-T-006 | features screen | manual + gate | none + gate:full | ✅ OK |
| COMP-T-007 | features screen | manual + gate | none + gate:full | ✅ OK |
| COMP-T-008 | features hook | manual + gate | none + gate:full | ✅ OK |
| COMP-T-009 | features screens | manual + gate | none + gate:full | ✅ OK |
| COMP-T-010 | UAT | manual | manual | ✅ OK |
| COMP-T-011 | docs | none | none | ✅ OK |

---

## Requirement → Task Traceability

| Requirement | Task(s) |
|-------------|---------|
| COMP-01 … COMP-05 | COMP-T-005, COMP-T-008 |
| COMP-06 … COMP-10 | COMP-T-001, COMP-T-003, COMP-T-006 |
| COMP-11 … COMP-15 | COMP-T-001, COMP-T-006, COMP-T-009 |
| COMP-16 … COMP-18 | COMP-T-004, COMP-T-006 |
| COMP-19 … COMP-22 | COMP-T-002, COMP-T-007 |
| COMP-23 | Deferred (sem task) |
| COMP-24 | COMP-T-006 |
| COMP-25 | COMP-T-009 |
| CA-COMP-* | COMP-T-010 |

**Cobertura:** 24/24 requisitos implementáveis mapeados | COMP-23 deferred

---

## MCPs e Skills (Execute)

Antes de executar, confirmar ferramentas por tarefa:

| Task | MCP sugerido | Skill |
|------|--------------|-------|
| COMP-T-001 … COMP-T-009 | filesystem (editor) | tlc-spec-driven (implement) |
| Research Expo Router modal | — | Consultar docs Expo v54 |
| Supabase (read-only) | plugin-supabase-supabase | supabase (se validar queries) |

**Padrão deste repo:** gate local + UAT manual; sem suíte automatizada ainda.
