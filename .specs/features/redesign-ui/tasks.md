# Tasks — redesign-ui (atomic + verificação)

**Spec**: `.specs/features/redesign-ui/spec.md`  
**Design**: `.specs/features/redesign-ui/design.md`  
**Status**: Draft

Legenda: **[P]** paralelizável na mesma fase (sem deps cruzadas); deps por ID.

**Gate padrão:** `npm run gate` (Full — lint + typecheck, igual CI). Quick: `npm run gate:quick` só em tarefas de deps puras.

**Testes:** Matriz em `.specs/TESTING.md` — telas/features = manual + gate estático (`Tests: none`).

---

## Execution Plan

### Phase 1 — Foundation (sequential)

```
RUI-T-001 → RUI-T-002 → RUI-T-003 → RUI-T-004 → RUI-T-005 → RUI-T-006 → RUI-T-007 → RUI-T-008
```

### Phase 2 — UI primitives (sequential)

```
RUI-T-008 → RUI-T-010 → RUI-T-011 → RUI-T-012 → RUI-T-013 → RUI-T-014 → RUI-T-015 → RUI-T-016 → RUI-T-017 → RUI-T-019
                                                              ↘ RUI-T-018 [P] (opcional P2, após T-012)
```

### Phase 3 — Data helpers (sequential; antes de Progress)

```
RUI-T-020 → RUI-T-021 → RUI-T-022 → RUI-T-023
```

### Phase 4 — Onboarding routes (sequential)

```
RUI-T-030 → RUI-T-031 → RUI-T-032 → RUI-T-033 → RUI-T-034 → RUI-T-035 → RUI-T-036
```

### Phase 5 — Tab bar (sequential)

```
RUI-T-040 (após RUI-T-008)
```

### Phase 6 — Feature screens (parallel após Phase 2 + 3 + 5)

```
                    ┌→ RUI-T-051 (Today) ─────────┐
RUI-T-040 + RUI-T-023 ─┼→ RUI-T-052 (Progress) ──┼→ RUI-T-070
                    ├→ RUI-T-053 (History) [P] ───┤
                    └→ RUI-T-054 (Settings) [P] ──┘
RUI-T-050 → RUI-T-051 (streak header antes/along Today)
```

### Phase 7 — Polish + verify (sequential)

```
RUI-T-060 → RUI-T-061 → RUI-T-062 → RUI-T-070 → RUI-T-071
```

---

## Fase R0 — Dependências e theme

### RUI-T-001: Instalar pacotes UI (gradient + Inter)

**What**: Adicionar `expo-linear-gradient` e `@expo-google-fonts/inter` ao projeto.  
**Where**: `package.json`, `package-lock.json`  
**Depends on**: None  
**Reuses**: Expo SDK 54 baseline  
**Requirements**: `RUI-DS-02`

**Done when**:

- [ ] `npx expo install expo-linear-gradient` concluído
- [ ] `@expo-google-fonts/inter` instalado
- [ ] `npm run gate:quick` passa

**Tests**: none  
**Gate**: quick  
**Commit**: `chore(redesign-ui): add inter font and linear gradient deps`

---

### RUI-T-002: Criar `theme/tokens.ts`

**What**: Tokens de cor, spacing, radius e shadows conforme design system.  
**Where**: `theme/tokens.ts`, `theme/index.ts`  
**Depends on**: RUI-T-001  
**Reuses**: `kindspark-design-system.md`  
**Requirements**: `RUI-DS-01`, `RUI-DS-03`, `RUI-DS-05`

**Done when**:

- [ ] Hex/radius/shadows batem com design system
- [ ] `theme/index.ts` exporta tokens
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add theme tokens`

---

### RUI-T-003: Criar `theme/typography.ts` + `AppText`

**What**: Variantes tipográficas (hero, title, cardTitle, body, caption, etc.).  
**Where**: `theme/typography.ts`, `components/ui/AppText.tsx`  
**Depends on**: RUI-T-002  
**Requirements**: `RUI-DS-02`

**Done when**:

- [ ] `AppText` aceita `variant` e aplica Inter + escala
- [ ] Sem erros TypeScript
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add AppText typography variants`

---

### RUI-T-004: Criar `theme/motion.ts` + `useReducedMotion`

**What**: Durações padrão e hook que respeita `AccessibilityInfo.isReduceMotionEnabled`.  
**Where**: `theme/motion.ts`, `hooks/useReducedMotion.ts`  
**Depends on**: RUI-T-002  
**Requirements**: `RUI-DS-04`, `RUI-AST-02`

**Done when**:

- [ ] Durações 150/250/350/500 exportadas
- [ ] Hook retorna boolean estável
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add motion tokens and reduced motion hook`

---

### RUI-T-005: Centralizar copy EN em `constants/copy.ts`

**What**: Todas as strings de UI em escopo (onboarding, today, progress, history, settings).  
**Where**: `constants/copy.ts`  
**Depends on**: None  
**Reuses**: `kindspark-design-system.md`, spec `RUI-COPY-01`  
**Requirements**: `RUI-COPY-01`

**Done when**:

- [ ] Nenhuma string PT no arquivo
- [ ] Onboarding, Today CTAs, Progress/History/Settings titles presentes
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add english ui copy constants`

---

### RUI-T-006: Carregar fonte Inter no root layout

**What**: Registrar Inter via `expo-font` em `app/_layout.tsx`.  
**Where**: `app/_layout.tsx`  
**Depends on**: RUI-T-001, RUI-T-003  
**Requirements**: `RUI-DS-02`

**Done when**:

- [ ] App só renderiza após fonts loaded (padrão atual preservado)
- [ ] Inter aplicada em `AppText`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): load Inter font in root layout`

---

### RUI-T-007: Forçar tema claro warm

**What**: Telas redesign não usam paleta dark legada; `useColorScheme` ou wrapper retorna `'light'`.  
**Where**: `components/useColorScheme.ts` e/ou `app/_layout.tsx`  
**Depends on**: RUI-T-002  
**Requirements**: Edge case spec (dark OS), `CA-DS-02`

**Done when**:

- [ ] Com SO em dark mode, fundo permanece `#F8F5F0` nas rotas em escopo
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): force warm light color scheme`

---

### RUI-T-008: Migrar `constants/Colors.ts` para re-export do theme

**What**: `Colors.light` aponta para tokens; evitar tint azul `#5B7C99` em código novo.  
**Where**: `constants/Colors.ts`  
**Depends on**: RUI-T-002, RUI-T-007  
**Requirements**: `CA-DS-02`

**Done when**:

- [ ] `tint` / `background` / `text` alinhados ao theme
- [ ] Tabs e telas legadas não quebram compile
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `refactor(redesign-ui): align Colors constants with theme tokens`

---

## Fase R1 — Component library

### RUI-T-010: `ScreenShell`

**What**: Safe area + background cream + padding 20/16.  
**Where**: `components/ui/ScreenShell.tsx`  
**Depends on**: RUI-T-002, RUI-T-003  
**Requirements**: `RUI-DS-05`

**Done when**:

- [ ] Suporta `scrollable` opcional
- [ ] Usado em pelo menos uma tela de prova ou Welcome stub
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add ScreenShell layout wrapper`

---

### RUI-T-011: `Button` (4 variantes + gradient)

**What**: Primary (LinearGradient), Secondary, Ghost, Text; press scale com reduced motion.  
**Where**: `components/ui/Button.tsx`  
**Depends on**: RUI-T-002, RUI-T-004, RUI-T-001  
**Requirements**: `RUI-CMP-01`, `RUI-DS-01`, `RUI-A11Y-01`

**Done when**:

- [ ] Altura mínima 44–48px conforme variante
- [ ] Primary usa gradiente 135deg #FF8A3D → #FF6A21
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add Button component with variants`

---

### RUI-T-012: `Card` base

**What**: Card branco, radius 20, sombra soft.  
**Where**: `components/ui/Card.tsx`  
**Depends on**: RUI-T-002  
**Requirements**: `RUI-CMP-02`

**Done when**:

- [ ] Props `children`, `style?`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add Card component`

---

### RUI-T-013: `PaginationDots`

**What**: Indicador 2 steps para onboarding.  
**Where**: `components/ui/PaginationDots.tsx`  
**Depends on**: RUI-T-002  
**Requirements**: `RUI-OB-07`

**Done when**:

- [ ] `count` + `activeIndex` funcionam
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add PaginationDots`

---

### RUI-T-014: `ListRow`

**What**: Row settings com ícone, label, value, chevron, slot direito (Switch).  
**Where**: `components/ui/ListRow.tsx`  
**Depends on**: RUI-T-003, RUI-T-011  
**Requirements**: `RUI-CMP-04`, `RUI-A11Y-01`

**Done when**:

- [ ] `minHeight` ≥ 52
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add ListRow component`

---

### RUI-T-015: `StreakBadge` + `AchievementBadge`

**What**: Badge header (flame + count) e círculos 3/7/14/30 com estados locked/active/completed.  
**Where**: `components/ui/StreakBadge.tsx`, `components/ui/AchievementBadge.tsx`  
**Depends on**: RUI-T-002, RUI-T-003  
**Requirements**: `RUI-CMP-03`, `RUI-PR-05`

**Done when**:

- [ ] Estados visuais distintos para locked vs completed
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add streak and achievement badges`

---

### RUI-T-016: `ActionCard`

**What**: Split peach top + white bottom; placeholder ilustração.  
**Where**: `components/ui/ActionCard.tsx`  
**Depends on**: RUI-T-012, RUI-T-003  
**Requirements**: `RUI-TD-02`, `RUI-CMP-02`

**Done when**:

- [ ] Aceita `title`, `description`, `illustrationSource?`
- [ ] Fallback peach se imagem falhar
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add ActionCard component`

---

### RUI-T-017: `HistoryRow` + `StatsRow`

**What**: Linha de histórico (ícone, título, data, status) e tríade de métricas Progress.  
**Where**: `components/ui/HistoryRow.tsx`, `components/ui/StatsRow.tsx`  
**Depends on**: RUI-T-003, RUI-T-012  
**Requirements**: `RUI-HI-02`, `RUI-HI-03`, `RUI-PR-03`, `RUI-CMP-02`

**Done when**:

- [ ] `done` mostra check verde; `skipped` sem verde sucesso
- [ ] StatsRow três colunas alinhadas
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add HistoryRow and StatsRow`

---

### RUI-T-018: `AdBannerShell` [P]

**What**: Placeholder sutil acima da tab bar (sem SDK ads).  
**Where**: `components/ui/AdBannerShell.tsx`  
**Depends on**: RUI-T-012  
**Requirements**: `RUI-TD-08`

**Done when**:

- [ ] Altura fixa ~50, fundo muted
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add ad banner layout shell`

---

### RUI-T-019: Barrel `components/ui/index.ts`

**What**: Export público de todos os componentes UI.  
**Where**: `components/ui/index.ts`  
**Depends on**: RUI-T-010…RUI-T-018 (exceto T-018 se adiado)  
**Requirements**: `RUI-CMP-01`…`RUI-CMP-04`

**Done when**:

- [ ] Imports `@/components/ui` resolvem
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `chore(redesign-ui): export ui component barrel`

---

## Fase R2 — Data helpers (Progress)

### RUI-T-020: `getTimeGreeting` helper

**What**: Good morning / afternoon / evening por hora local.  
**Where**: `lib/format/greeting.ts`  
**Depends on**: None  
**Requirements**: `RUI-TD-01`

**Done when**:

- [ ] Função pura testável manualmente
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add time-based greeting helper`

---

### RUI-T-021: `formatRelativeDate` helper

**What**: Today / Yesterday / N days ago em inglês.  
**Where**: `lib/format/relative-date.ts`  
**Depends on**: None  
**Requirements**: `RUI-HI-02`

**Done when**:

- [ ] Usa `action_date` YYYY-MM-DD local
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add relative date formatter`

---

### RUI-T-022: `fetchActionStats` Supabase

**What**: Agregar completed, skipped, completionRate (mês calendário local).  
**Where**: `lib/supabase/action-stats.ts`, export em `lib/supabase/index.ts`  
**Depends on**: None  
**Reuses**: `user_action_logs` RLS existente  
**Requirements**: `RUI-PR-03`, `RUI-PR-07`

**Done when**:

- [ ] Retorno tipado `ActionStats`
- [ ] Taxa 0 quando sem logs no período
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add action stats query for progress screen`

---

### RUI-T-023: Estender `useProgress` com `stats`

**What**: `load()` busca streak + stats em paralelo; API existente preservada.  
**Where**: `features/progress/useProgress.ts`  
**Depends on**: RUI-T-022  
**Requirements**: `RUI-PR-07`

**Done when**:

- [ ] `stats` exposto no return type
- [ ] Erro em stats não bloqueia streak
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): extend useProgress with monthly stats`

---

### RUI-T-050: `useStreakBadge` (streak no header Today)

**What**: Hook fino que busca streak para header sem alterar `useTodayLoop`.  
**Where**: `features/today/useStreakBadge.ts`  
**Depends on**: RUI-T-022 (opcional: só `fetchCurrentStreak`)  
**Reuses**: `lib/supabase/streak.ts`  
**Requirements**: `RUI-TD-01`

**Done when**:

- [ ] Retorna `{ streak, busy, load }`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add useStreakBadge for today header`

---

## Fase R3 — Onboarding

### RUI-T-030: `WelcomeScreen` (OB-1)

**What**: Tela marca: logo, subtitle, ilustração, Get Started.  
**Where**: `features/onboarding/WelcomeScreen.tsx`  
**Depends on**: RUI-T-010, RUI-T-011, RUI-T-005, RUI-T-013  
**Requirements**: `RUI-OB-01`…`RUI-OB-04`

**Done when**:

- [ ] Copy de `constants/copy.ts` apenas EN
- [ ] CTA navega para value route
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add welcome onboarding screen`

---

### RUI-T-031: Rota `app/(onboarding)/welcome.tsx`

**What**: Thin route exportando `WelcomeScreen`.  
**Where**: `app/(onboarding)/welcome.tsx`  
**Depends on**: RUI-T-030  
**Requirements**: `RUI-OB-02`

**Done when**:

- [ ] Rota abre no Expo Router
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add welcome route`

---

### RUI-T-032: `ValueScreen` (OB-2)

**What**: Headline valor, ilustração, dots index 1, Continue.  
**Where**: `features/onboarding/ValueScreen.tsx`  
**Depends on**: RUI-T-030, RUI-T-013  
**Requirements**: `RUI-OB-05`…`RUI-OB-08`

**Done when**:

- [ ] Continue → `notification-time`
- [ ] Transição ~250ms (fade ou slide)
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add value proposition onboarding screen`

---

### RUI-T-033: Rota `app/(onboarding)/value.tsx`

**What**: Thin route para ValueScreen.  
**Where**: `app/(onboarding)/value.tsx`  
**Depends on**: RUI-T-032  
**Requirements**: `RUI-OB-06`

**Done when**:

- [ ] Stack back retorna welcome
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add value onboarding route`

---

### RUI-T-034: Atualizar `(onboarding)/_layout.tsx`

**What**: Registrar welcome/value; `headerShown: false` nas novas telas.  
**Where**: `app/(onboarding)/_layout.tsx`  
**Depends on**: RUI-T-031, RUI-T-033  
**Requirements**: `RUI-OB-03`

**Done when**:

- [ ] Três screens no stack
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): update onboarding stack layout`

---

### RUI-T-035: Atualizar `getAppEntryHref` + export onboarding screens

**What**: Entry onboarding → `/welcome`; export screens em `features/onboarding/index.ts`.  
**Where**: `features/auth/routing.ts`, `features/onboarding/index.ts`  
**Depends on**: RUI-T-031  
**Requirements**: `RUI-OB-02`, `RUI-OB-06`, `CA-OB-03`

**Done when**:

- [ ] Usuário novo: auth → welcome → value → notification-time
- [ ] `hasCompletedOnboarding` inalterado
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): route new users to welcome onboarding`

---

### RUI-T-036: Skin mínima `notification-time` com tokens

**What**: Aplicar ScreenShell/AppText/Button sem mudar lógica de save.  
**Where**: `app/(onboarding)/notification-time.tsx`  
**Depends on**: RUI-T-008, RUI-T-010, RUI-T-011  
**Requirements**: `RUI-DS-01` (parcial)

**Done when**:

- [ ] Visual consistente com onboarding 1/2
- [ ] RF-007 fluxo intacto
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `style(redesign-ui): align notification-time with new theme`

---

## Fase R4 — Tab navigation

### RUI-T-040: Redesign `(tabs)/_layout.tsx`

**What**: Active tint laranja, inactive muted, tab bar rounded top, Ionicons.  
**Where**: `app/(tabs)/_layout.tsx`  
**Depends on**: RUI-T-008  
**Requirements**: `RUI-NAV-01`…`RUI-NAV-04`, `RUI-TD-05`

**Done when**:

- [ ] Quatro tabs com labels EN
- [ ] Sem header duplicado onde `headerShown: false`
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `style(redesign-ui): redesign bottom tab bar`

---

## Fase R5 — Feature screens

### RUI-T-051: Redesign `TodayScreen`

**What**: Header greeting + StreakBadge, ActionCard, CTAs, offline banner, AdBannerShell opcional.  
**Where**: `features/today/TodayScreen.tsx`  
**Depends on**: RUI-T-016, RUI-T-011, RUI-T-005, RUI-T-020, RUI-T-050, RUI-T-040  
**Reuses**: `useTodayLoop` (sem mudança de API)  
**Requirements**: `RUI-TD-01`…`RUI-TD-07`, `CA-TD-01`, `CA-TD-02`

**Done when**:

- [ ] I did it / Skip / New idea funcionam como antes
- [ ] Nenhum hex legado inline na tela
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): redesign today screen`

---

### RUI-T-052: Redesign `ProgressScreen` [P]

**What**: Your progress, streak card peach, StatsRow, Achievements horizontal, milestone card.  
**Where**: `features/progress/ProgressScreen.tsx`  
**Depends on**: RUI-T-015, RUI-T-017, RUI-T-023, RUI-T-005, RUI-T-010, RUI-T-040  
**Reuses**: `useProgress`, `lib/streak/milestones.ts`  
**Requirements**: `RUI-PR-01`…`RUI-PR-06`, `CA-PR-01`, `CA-PR-02`

**Done when**:

- [ ] Números vêm de `stats` + `streak` reais
- [ ] Badges 3/7/14/30 refletem streak
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): redesign progress screen`

---

### RUI-T-053: Redesign `HistoryScreen` [P]

**What**: FlatList HistoryRow, empty state EN, relative dates.  
**Where**: `features/history/HistoryScreen.tsx`  
**Depends on**: RUI-T-017, RUI-T-021, RUI-T-005, RUI-T-010, RUI-T-040  
**Reuses**: `useHistory`  
**Requirements**: `RUI-HI-01`…`RUI-HI-05`, `CA-HI-01`, `CA-HI-02`

**Done when**:

- [ ] RF-006 ordenação/status corretos
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): redesign history screen`

---

### RUI-T-054: Redesign `SettingsScreen` [P]

**What**: ListRows, toggles, time picker, rows placeholder, ghost sign out.  
**Where**: `features/settings/SettingsScreen.tsx`  
**Depends on**: RUI-T-014, RUI-T-011, RUI-T-005, RUI-T-010, RUI-T-040  
**Reuses**: `useSettings`  
**Requirements**: `RUI-ST-01`…`RUI-ST-06`, `CA-ST-01`, `CA-ST-02`

**Done when**:

- [ ] Toggle/horário persistem (RF-007)
- [ ] Sign out não é primary CTA
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): redesign settings screen`

---

## Fase R6 — Polish

### RUI-T-060: Assets ilustração (ou placeholders)

**What**: PNGs em `assets/illustrations/` wired nas telas OB + ActionCard + empty history.  
**Where**: `assets/illustrations/*`, telas consumidoras  
**Depends on**: RUI-T-051, RUI-T-030  
**Requirements**: `RUI-AST-01`, `RUI-OB-04`

**Done when**:

- [ ] Sem crash se asset ausente (placeholder peach)
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(redesign-ui): add illustration assets and placeholders`

---

### RUI-T-061: Passagem a11y em componentes UI

**What**: accessibilityLabel/Role em ícones; hitSlop onde necessário.  
**Where**: `components/ui/*`  
**Depends on**: RUI-T-019  
**Requirements**: `RUI-A11Y-01`…`RUI-A11Y-03`, `CA-A11Y-01`

**Done when**:

- [ ] Botões e ListRow ≥ 44pt efetivos
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `a11y(redesign-ui): improve touch targets and labels`

---

### RUI-T-062: Reduced motion em animações UI

**What**: Desligar press scale / tab animation quando reduce motion ativo.  
**Where**: `components/ui/Button.tsx`, `app/(tabs)/_layout.tsx`, onboarding transitions  
**Depends on**: RUI-T-004, RUI-T-011, RUI-T-040  
**Requirements**: `RUI-DS-04`, `RUI-AST-02`

**Done when**:

- [ ] Com reduce motion ON, sem scale/bounce
- [ ] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `a11y(redesign-ui): respect reduced motion preferences`

---

## Fase R7 — Verificação release

### RUI-T-070: Gate CI local

**What**: Validar lint + typecheck antes de PR.  
**Where**: —  
**Depends on**: RUI-T-051, RUI-T-052, RUI-T-053, RUI-T-054, RUI-T-035  
**Requirements**: `CA-REG-02`

**Done when**:

- [ ] `npm run gate` exit 0
- [ ] Nenhum erro novo

**Tests**: none  
**Gate**: full  

---

### RUI-T-071: Regressão manual MVP + CA redesign

**What**: Percorrer checklist `spec.md` CA-* e critérios v0.1 MVP.  
**Where**: —  
**Depends on**: RUI-T-070  
**Requirements**: `CA-REG-01`, `CA-COPY-01`, todos CA-*

**Done when**:

- [ ] OB-1 → OB-2 → notification-time < 2 min
- [ ] Today done/skip/refresh OK
- [ ] Progress/Histor/Settings dados corretos
- [ ] Zero strings PT na UI em escopo
- [ ] Marcar tasks concluídas neste arquivo

**Tests**: manual  
**Gate**: manual device  

---

## Parallel Execution Map

```
R0: T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008
R1: T-010 → T-011 → T-012 → T-013 → T-014 → T-015 → T-016 → T-017 → T-019
         └ T-018 [P] após T-012
R2: T-020, T-021 [P entre si] → T-022 → T-023 | T-050 após streak lib
R3: T-030 → T-031 → T-032 → T-033 → T-034 → T-035 → T-036
R4: T-040 (após T-008)
R5: T-050 → T-051 | T-052 [P] | T-053 [P] | T-054 [P]  (após R1+R2+R4)
R6: T-060 → T-061 → T-062
R7: T-070 → T-071
```

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| RUI-T-002 | 1 arquivo tokens | ✅ |
| RUI-T-011 | 1 componente Button | ✅ |
| RUI-T-051 | 1 tela Today | ✅ |
| RUI-T-051+052+053+054 em 1 task | 4 telas | ❌ Split (feito) |

---

## Diagram-Definition Cross-Check

| Task | Depends on (body) | Diagram shows | Status |
|------|-------------------|---------------|--------|
| RUI-T-008 | T-002, T-007 | Após R0 chain | ✅ |
| RUI-T-023 | T-022 | R2 antes R5 Progress | ✅ |
| RUI-T-052 | T-015,017,023,005,010,040 | Phase 6 branch | ✅ |
| RUI-T-053 [P] | T-017,021,005,010,040 | Parallel branch | ✅ |
| RUI-T-054 [P] | T-014,011,005,010,040 | Parallel branch | ✅ |
| RUI-T-052 vs T-053 | Sem deps cruzadas | [P] válido | ✅ |

---

## Test Co-location Validation

| Task | Camada | Matrix requires | Task says | Status |
|------|--------|-----------------|-----------|--------|
| Todas RUI-T-* | Telas/features | Manual + gate | none + gate full/quick | ✅ OK |

---

## Requirement traceability (tasks → RUI)

| Task IDs | Requirements covered |
|----------|---------------------|
| RUI-T-001…008 | RUI-DS-*, RUI-COPY-01 (T-005), CA-DS-02 |
| RUI-T-010…019 | RUI-CMP-*, RUI-DS-05 |
| RUI-T-020…023, T-050 | RUI-TD-01, RUI-HI-02, RUI-PR-03, RUI-PR-07 |
| RUI-T-030…036 | RUI-OB-* |
| RUI-T-040 | RUI-NAV-* |
| RUI-T-051 | RUI-TD-* |
| RUI-T-052 | RUI-PR-* |
| RUI-T-053 | RUI-HI-* |
| RUI-T-054 | RUI-ST-* |
| RUI-T-060…062 | RUI-AST-*, RUI-A11Y-* |
| RUI-T-071 | CA-* (todos) |

**Cobertura:** 48 requisitos mapeados → 35 tasks executáveis

---

## Definition of Done (redesign-ui)

- [ ] Todas as tasks RUI-T-001…071 concluídas
- [ ] Critérios CA-* em `spec.md` verificados manualmente
- [ ] `npm run gate` verde
- [ ] MVP RF-001…RF-007 sem regressão (`CA-REG-01`)
- [ ] Nenhuma copy PT nas telas em escopo (`CA-COPY-01`)

---

## Ordem sugerida (Execute)

`R0 → R1 → R2 → R3 → R4 → R5 → R6 → R7`

Commits atômicos: um por task, mensagem conforme campo **Commit** acima.
