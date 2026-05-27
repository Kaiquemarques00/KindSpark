# Tasks — progress-history (atomic + verificação)

**Spec**: `.specs/features/progress-history/spec.md`  
**Design**: `.specs/features/progress-history/design.md`  
**Status**: Draft — pronto para Execute

Legenda: **[P]** paralelizável na mesma fase (sem deps cruzadas); deps por ID.

**Gate padrão:** `npm run gate` (Full — lint + typecheck). Quick: `npm run gate:quick` em copy/types puros.

**Testes:** `.specs/TESTING.md` — telas/features = manual + gate estático (`Tests: none`).

---

## Execution Plan

### Phase 1 — Copy + analytics foundation (sequential)

```
PH-T-001 → PH-T-002
```

### Phase 2 — Data layer (parallel após Phase 1)

```
PH-T-002 ──┬→ PH-T-003 [P]
           ├→ PH-T-004 [P]
           ├→ PH-T-005 [P]
           ├→ PH-T-006 [P]
           └→ PH-T-007 [P]
```

### Phase 3 — UI primitives (parallel após Phase 2)

```
PH-T-003 + PH-T-004 ──→ PH-T-008 [P]
PH-T-005 ─────────────→ PH-T-009 [P]
PH-T-006 ─────────────→ PH-T-010 [P]
PH-T-007 ─────────────→ PH-T-011 [P]
```

### Phase 4 — Hooks + screens (sequential)

```
PH-T-008…011 → PH-T-012 → PH-T-013 → PH-T-014 → PH-T-015
```

### Phase 5 — Verify (sequential)

```
PH-T-015 → PH-T-016
```

### Parallel Execution Map

```
Phase 1:
  PH-T-001 ──→ PH-T-002

Phase 2:
  PH-T-002 complete, then:
    ├── PH-T-003 [P]
    ├── PH-T-004 [P]
    ├── PH-T-005 [P]
    ├── PH-T-006 [P]
    └── PH-T-007 [P]

Phase 3:
  PH-T-003 + PH-T-004 ──→ PH-T-008 [P]
  PH-T-005 ────────────→ PH-T-009 [P]
  PH-T-006 ────────────→ PH-T-010 [P]
  PH-T-007 ────────────→ PH-T-011 [P]

Phase 4:
  PH-T-008…011 ──→ PH-T-012 ──→ PH-T-013 ──→ PH-T-014 ──→ PH-T-015

Phase 5:
  PH-T-015 ──→ PH-T-016
```

---

## Task Breakdown

### PH-T-001: Adicionar copy EN (Progress + History)

**What**: Strings para best streak, weekly summary, empty journey, heatmap legend, light achievements, filtros e empty de filtro.  
**Where**: `constants/copy.ts`  
**Depends on**: None  
**Reuses**: Seções `copy.progress`, `copy.history` existentes  
**Requirements**: `PH-04`, `PH-08`, `PH-10`, `PH-16`, `PH-23`

**Done when**:

- [x] `bestStreak`, `weeklySummary`, `weeklySummaryZero`, `emptyJourney`
- [x] `lightAchievements.*` (3 títulos + locked/unlocked labels)
- [x] `history.filters.*` (all, done, skipped, last7, last30)
- [x] `history.emptyFilter`
- [x] `npm run gate:quick` passa

**Tests**: none  
**Gate**: quick  
**Commit**: `feat(progress-history): add progress and history copy`

---

### PH-T-002: Estender eventos de analytics

**What**: Adicionar 5 literals ao union `AnalyticsEvent`.  
**Where**: `lib/analytics/events.ts`  
**Depends on**: PH-T-001  
**Reuses**: Padrão `completion_screen_*`  
**Requirements**: `PH-17`, `PH-18`, `PH-19`, `PH-20`, `PH-21`

**Done when**:

- [x] `progress_screen_viewed`, `history_screen_viewed`, `achievement_viewed`, `history_filter_changed`, `calendar_day_tapped`
- [x] TypeScript compila em call sites
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add progress history analytics events`

---

### PH-T-003: `computeBestStreak` + `fetchBestStreak` [P]

**What**: Helper de maior sequência + export em `streak.ts` com lookback 365d.  
**Where**: `lib/streak/compute-best-streak.ts`, `lib/supabase/streak.ts`, `lib/supabase/index.ts`  
**Depends on**: PH-T-002  
**Reuses**: `fetchDoneDates`, `addDaysToDateString`  
**Requirements**: `PH-02`, `PH-14`

**Done when**:

- [ ] `computeBestStreak` cobre runs não consecutivos e array vazio → 0
- [ ] `fetchBestStreak` retorna `{ best, error }`
- [ ] Export público em `lib/supabase/index.ts`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add best streak computation`

---

### PH-T-004: `fetchWeeklyDoneCount` [P]

**What**: Query semana local (segunda início) + tipo `WeeklyProgress`.  
**Where**: `lib/supabase/weekly-progress.ts`, exports  
**Depends on**: PH-T-002  
**Reuses**: `toLocalDateString`, padrão `getLocalMonthBounds`  
**Requirements**: `PH-04`, `PH-05`

**Done when**:

- [ ] Conta dias distintos com `done` na semana até `today`
- [ ] Retorna `{ doneDays, totalDays: 7, weekStart, weekEnd }`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add weekly progress query`

---

### PH-T-005: `fetchDailyActivity` [P]

**What**: Mapa de status por dia para últimos 35 dias.  
**Where**: `lib/supabase/daily-activity.ts`, exports  
**Depends on**: PH-T-002  
**Reuses**: `toLocalDateString`, `addDaysToDateString`  
**Requirements**: `PH-06`, `PH-14`

**Done when**:

- [ ] `done` prevalece sobre `skipped` no mesmo dia
- [ ] Array ordenado ascendente com exatamente N células (preencher `none` sem log)
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add daily activity query`

---

### PH-T-006: `fetchTotalDoneCount` [P]

**What**: Contagem all-time de `done` para achievement 30.  
**Where**: `lib/supabase/action-stats.ts`  
**Depends on**: PH-T-002  
**Reuses**: `supabase` client patterns  
**Requirements**: `PH-07`, `PH-14`

**Done when**:

- [ ] Retorna `{ count, error }` sem mock
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add total done count query`

---

### PH-T-007: History filtros + paginação cursor [P]

**What**: Estender `fetchActionHistory` com `HistoryFilter`, cursor, `nextCursor`.  
**Where**: `lib/supabase/action-history.ts`  
**Depends on**: PH-T-002  
**Reuses**: Join `actions`, skip órfãos  
**Requirements**: `PH-09`, `PH-10`, `PH-12`, `PH-15`

**Done when**:

- [ ] `HISTORY_PAGE_SIZE = 25`
- [ ] Filtros status + 7d/30d aplicados na query
- [ ] `loadMore` via cursor estável (`id` + `created_at`)
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): paginate and filter action history`

---

### PH-T-008: `ActivityCalendar` component [P]

**What**: Grid 7×5 pressable com cores por status + a11y labels.  
**Where**: `components/ui/ActivityCalendar.tsx`, `components/ui/index.ts`  
**Depends on**: PH-T-003, PH-T-004  
**Reuses**: `theme/tokens`, `copy.progress` legend opcional  
**Requirements**: `PH-06`, `PH-21`

**Done when**:

- [ ] Renderiza `cells` length 35
- [ ] `onDayPress(date, status)` só em células não-`none` (ou todas com label)
- [ ] Export em `components/ui/index.ts`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add ActivityCalendar component`

---

### PH-T-009: `HistoryFilterBar` component [P]

**What**: Chips dos 5 filtros com estado selecionado.  
**Where**: `components/ui/HistoryFilterBar.tsx`, `components/ui/index.ts`  
**Depends on**: PH-T-005  
**Reuses**: `copy.history.filters`  
**Requirements**: `PH-10`, `PH-20`

**Done when**:

- [ ] Tipagem `HistoryFilter` compartilhada (re-export de action-history ou types file)
- [ ] Touch target adequado
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add HistoryFilterBar component`

---

### PH-T-010: `computeLightAchievements` + row UI [P]

**What**: Helper PH-07 + componente horizontal de 3 badges leves.  
**Where**: `lib/streak/light-achievements.ts`, `components/ui/LightAchievementRow.tsx`  
**Depends on**: PH-T-006  
**Reuses**: Visual language de `AchievementBadge`  
**Requirements**: `PH-07`, `PH-19`, `PH-22`

**Done when**:

- [ ] Três ids: `first_done`, `streak_7`, `completed_30`
- [ ] `onPress` em unlocked dispara callback para analytics
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): add light achievements UI`

---

### PH-T-011: Tipos compartilhados / barrel exports [P]

**What**: Garantir exports limpos em `lib/supabase/index.ts` e `features/*/index.ts` se necessário.  
**Where**: `lib/supabase/index.ts`, `features/progress/index.ts`  
**Depends on**: PH-T-007  
**Reuses**: Padrão barrel do repo  
**Requirements**: Transversal

**Done when**:

- [ ] Novos módulos exportados sem import circular
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `chore(progress-history): export new supabase helpers`

---

### PH-T-012: Estender `useProgress`

**What**: Paralelizar loads: streak, best, stats, weekly, activity, totalDone, light achievements, `isEmptyJourney`.  
**Where**: `features/progress/useProgress.ts`  
**Depends on**: PH-T-008, PH-T-009, PH-T-010, PH-T-011  
**Reuses**: Degradação parcial (padrão completion)  
**Requirements**: `PH-01`…`PH-08`, `PH-13`, `PH-15`, `PH-22`

**Done when**:

- [ ] API de retorno documentada no design
- [ ] Falha parcial não zera streak já carregado
- [ ] `isEmptyJourney` quando totalDone === 0
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): extend useProgress data loading`

---

### PH-T-013: Atualizar `ProgressScreen` UI + analytics

**What**: Best streak no card, weekly line, ActivityCalendar, LightAchievementRow, empty journey, `progress_screen_viewed`, `calendar_day_tapped`, `achievement_viewed`.  
**Where**: `features/progress/ProgressScreen.tsx`  
**Depends on**: PH-T-012  
**Reuses**: `ScreenShell`, `Card`, `StatsRow`, milestones existentes  
**Requirements**: `PH-01`…`PH-08`, `PH-17`, `PH-19`, `PH-21`, `PH-22`

**Done when**:

- [ ] Layout scrollável com novas seções ordenadas (design.md)
- [ ] Analytics no `useFocusEffect`
- [ ] Empty journey copy quando `isEmptyJourney`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): enhance ProgressScreen UI`

---

### PH-T-014: Estender `useHistory` (filtros + loadMore)

**What**: Estado de filtro, reset, paginação, `history_filter_changed`.  
**Where**: `features/history/useHistory.ts`  
**Depends on**: PH-T-007, PH-T-009  
**Reuses**: `fetchActionHistory` novo contrato  
**Requirements**: `PH-09`, `PH-10`, `PH-12`, `PH-20`

**Done when**:

- [ ] `setFilter` reseta entries e refetch
- [ ] `loadMore` append sem duplicar ids
- [ ] `hasMore` derivado de `nextCursor`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): extend useHistory with filters and pagination`

---

### PH-T-015: Atualizar `HistoryScreen` UI + analytics

**What**: `HistoryFilterBar`, `onEndReached`, empty filter, `history_screen_viewed`.  
**Where**: `features/history/HistoryScreen.tsx`  
**Depends on**: PH-T-014  
**Reuses**: `HistoryRow`, `FlatList`  
**Requirements**: `PH-09`…`PH-12`, `PH-16`, `PH-18`, `PH-11`

**Done when**:

- [ ] Filtros visíveis abaixo do título
- [ ] Footer loader em `loadMore`
- [ ] Empty states distintos (zero total vs filtro)
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(progress-history): enhance HistoryScreen UI`

---

### PH-T-016: UAT manual + atualizar status SDD

**What**: Executar CA-PH-*; marcar spec/design/tasks Approved/Done; ROADMAP entrada.  
**Where**: `.specs/features/progress-history/*.md`, `.specs/ROADMAP.md`  
**Depends on**: PH-T-015  
**Requirements**: Todos PH-* P0/P1

**Done when**:

- [ ] CA-PH-01 … CA-PH-12 verificados (device smoke)
- [ ] `npm run gate` passa
- [ ] Tabelas traceability Status → Done
- [ ] ROADMAP lista feature `progress-history`

**Tests**: manual  
**Gate**: full  

**Verify**:

```bash
npm run gate
npx expo start
# Progress: streak/best/weekly/calendar/achievements/empty
# History: filtros, paginação, skip visual, analytics console
# Completion CTAs → tabs regressão
```

**Commit**: `docs(progress-history): mark feature SDD complete`

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| PH-T-001: copy | 1 file | ✅ Granular |
| PH-T-002: analytics types | 1 file | ✅ Granular |
| PH-T-003: best streak | 2 arquivos coesos | ✅ Granular |
| PH-T-004: weekly query | 1 módulo | ✅ Granular |
| PH-T-005: daily activity | 1 módulo | ✅ Granular |
| PH-T-006: total done | 1 função | ✅ Granular |
| PH-T-007: history API | 1 módulo | ✅ Granular |
| PH-T-008: ActivityCalendar | 1 componente | ✅ Granular |
| PH-T-009: HistoryFilterBar | 1 componente | ✅ Granular |
| PH-T-010: light achievements | helper + UI | ✅ Granular |
| PH-T-011: exports | barrels | ✅ Granular |
| PH-T-012: useProgress | 1 hook | ✅ Granular |
| PH-T-013: ProgressScreen | 1 screen | ✅ Granular |
| PH-T-014: useHistory | 1 hook | ✅ Granular |
| PH-T-015: HistoryScreen | 1 screen | ✅ Granular |
| PH-T-016: UAT + docs | verificação | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
|------|------------------------|---------------|--------|
| PH-T-001 | None | Phase 1 start | ✅ Match |
| PH-T-002 | PH-T-001 | T-001 → T-002 | ✅ Match |
| PH-T-003 | PH-T-002 | T-002 → T-003 [P] | ✅ Match |
| PH-T-004 | PH-T-002 | T-002 → T-004 [P] | ✅ Match |
| PH-T-005 | PH-T-002 | T-002 → T-005 [P] | ✅ Match |
| PH-T-006 | PH-T-002 | T-002 → T-006 [P] | ✅ Match |
| PH-T-007 | PH-T-002 | T-002 → T-007 [P] | ✅ Match |
| PH-T-008 | PH-T-003, PH-T-004 | Phase 3 branch | ✅ Match |
| PH-T-009 | PH-T-005 | Phase 3 branch | ✅ Match |
| PH-T-010 | PH-T-006 | Phase 3 branch | ✅ Match |
| PH-T-011 | PH-T-007 | Phase 3 branch | ✅ Match |
| PH-T-012 | PH-T-008…011 | Phase 4 merge | ✅ Match |
| PH-T-013 | PH-T-012 | T-012 → T-013 | ✅ Match |
| PH-T-014 | PH-T-007, PH-T-009 | T-007+T-009 → T-014 | ✅ Match |
| PH-T-015 | PH-T-014 | T-014 → T-015 | ✅ Match |
| PH-T-016 | PH-T-015 | T-015 → T-016 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
|------|------------|-----------------|-----------|--------|
| PH-T-001 | constants | gate estático | none + gate:quick | ✅ OK |
| PH-T-002 | lib/analytics | gate estático | none + gate:full | ✅ OK |
| PH-T-003…007 | lib/supabase | gate estático | none + gate:full | ✅ OK |
| PH-T-008…010 | components/ui | manual + gate | none + gate:full | ✅ OK |
| PH-T-011 | exports | gate estático | none + gate:full | ✅ OK |
| PH-T-012…015 | features | manual + gate | none + gate:full | ✅ OK |
| PH-T-016 | UAT | manual | manual | ✅ OK |

---

## Requirement → Task Traceability

| Requirement | Task(s) |
|-------------|---------|
| PH-01, PH-02, PH-14 | PH-T-003, PH-T-012, PH-T-013 |
| PH-03, PH-13 | PH-T-012, PH-T-013 |
| PH-04, PH-05 | PH-T-001, PH-T-004, PH-T-012, PH-T-013 |
| PH-06, PH-21 | PH-T-005, PH-T-008, PH-T-013 |
| PH-07, PH-19 | PH-T-006, PH-T-010, PH-T-012, PH-T-013 |
| PH-08 | PH-T-001, PH-T-012, PH-T-013 |
| PH-09, PH-10, PH-12 | PH-T-007, PH-T-014, PH-T-015 |
| PH-11 | PH-T-015 (regressão HistoryRow) |
| PH-15 | PH-T-007, PH-T-012, PH-T-014 |
| PH-16 | PH-T-001, PH-T-015 |
| PH-17 | PH-T-002, PH-T-013 |
| PH-18 | PH-T-002, PH-T-015 |
| PH-19 | PH-T-002, PH-T-010, PH-T-013 |
| PH-20 | PH-T-002, PH-T-009, PH-T-014 |
| PH-22 | PH-T-010, PH-T-013 |
| PH-23 | PH-T-001 |
| CA-PH-* | PH-T-016 |

**Cobertura:** 23/23 requisitos mapeados | 0 unmapped ⚠️

---

## MCPs e Skills (Execute)

| Task | MCP sugerido | Skill |
|------|--------------|-------|
| PH-T-001 … PH-T-015 | filesystem (editor) | tlc-spec-driven (implement) |
| Queries Supabase | plugin-supabase-supabase | supabase |
| Expo focus/list | — | Docs Expo v54 |

**Padrão deste repo:** gate local + UAT manual; sem suíte automatizada ainda.
