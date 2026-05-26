# Feature spec — redesign-ui (KindSpark)

## Meta

| Campo | Valor |
|-------|--------|
| **Feature** | `redesign-ui` |
| **Status** | Done — gate + UAT manual (2026-05-25) |
| **Tipo** | Large — redesign visual multi-tela |
| **Fontes de verdade** | `kindspark-design-system.md`, mockup anexado (onboarding, Today, Progress, History, Settings) |
| **Tom** | Acolhedor, minimalista, positivo (“gentle habit app”) |
| **Rastreio MVP** | HU-001…HU-007, RF-001…RF-008 (comportamento preservado; apenas camada visual/UX) |

## Problem Statement

O KindSpark hoje usa uma paleta fria (azul-acinzentada) e layout funcional sem a identidade calorosa do novo design. Isso enfraquece a promessa emocional do produto — pequenas ações positivas com recompensa suave — e desalinha a UI do mockup e do design system aprovados.

É necessário refazer o visual das telas principais para que cores, tipografia, espaçamento, componentes, ilustrações e motion transmitam leveza e acolhimento, **sem alterar regras de negócio** já validadas no MVP v0.1.

## Goals

- [x] Tokens visuais centralizados (cores, tipografia, radius, sombras, spacing) conforme `kindspark-design-system.md`
- [x] Seis superfícies redesenhadas: Onboarding 1, Onboarding 2, Today, Progress, History, Settings
- [x] Bottom navigation e componentes compartilhados (botões, cards, badges, list rows) reutilizáveis
- [x] Paridade visual ≥ 90% com mockup nas telas em escopo (layout/ilustração; **copy sempre em inglês**)
- [x] Toda copy voltada ao usuário em **inglês**, conforme `kindspark-design-system.md` (não usar textos PT do mock)
- [x] Acessibilidade mantida: alvo de toque ≥ 44×44, contraste de texto, suporte a `reduce motion`
- [x] Zero regressão funcional nos fluxos RF-001…RF-007

## Out of Scope

| Item | Motivo |
|------|--------|
| Telas de onboarding 3–5 (permissão push, seletor de horário, “primeira ação”) | Fora do pedido; apenas OB-1 e OB-2 nesta feature |
| Completion screen, New Idea modal, Rewarded Ad modal | Telas/modais do design system v0.1 — feature futura `redesign-ui-phase-2` |
| Auth (login / register) | Fluxo técnico; identidade visual pode seguir em outra spec |
| Dark mode / tema escuro | Proibido pelo design system (“Never dark enterprise”) |
| Mudança de copy de negócio, catálogo, streak, offline, analytics | Escopo é UI/UX apenas |
| Novas dependências de monetização (banners/rewarded) | Layout reservado no mock; implementação de ads não faz parte desta entrega |
| Localização PT-BR / i18n | App permanece **100% inglês**; tradução é feature futura |

---

## User Stories

### P1: Fundação do design system na app ⭐ MVP

**User Story**: Como desenvolvedor, quero tokens e componentes base alinhados ao design system para que todas as telas redesenhadas sejam consistentes e fáceis de manter.

**Why P1**: Sem tokens, cada tela diverge e o redesign não escala.

**Acceptance Criteria**:

1. WHEN o app renderiza qualquer tela em escopo THEN o fundo SHALL usar `#F8F5F0` (App Background) e cards SHALL usar `#FFFFFF` com radius 20px e sombra `0 8px 30px rgba(0,0,0,0.06)`.
2. WHEN um CTA primário é exibido THEN o botão SHALL usar gradiente `linear-gradient(135deg, #FF8A3D 0%, #FF6A21 100%)`, radius pill (`999px`), sombra `0 10px 20px rgba(255,106,33,0.22)` e texto branco SemiBold.
3. WHEN texto é exibido THEN tipografia SHALL usar família Inter (fallback system sans), escala do design system (Body 16, Title 24, etc.) e cores `#1F1F1F` / `#6D6D6D` / `#9A9A9A` para primary/secondary/muted.
4. WHEN animações padrão ocorrem THEN duração SHALL ser 150ms (fast), 250ms (default) ou 350ms (soft); celebrações até 500ms; motion SHALL respeitar `prefers-reduced-motion` desativando bounce/confetti.
5. WHEN padding de tela é aplicado THEN layout SHALL usar 20px horizontal e 16px vertical + safe area do dispositivo.

**Independent Test**: Abrir Storybook ou tela de prova com Primary Button, Card, Badge e verificar tokens contra `kindspark-design-system.md`.

**Requisitos**: `RUI-DS-01` … `RUI-DS-05`

---

### P1: Onboarding — introdução da marca ⭐ MVP

**User Story**: Como usuário novo, quero uma primeira tela acolhedora com logo e ilustração para entender o que é o KindSpark antes de continuar.

**Why P1**: Primeira impressão emocional; gate de entrada do funil.

**Acceptance Criteria**:

1. WHEN o usuário abre Onboarding 1 THEN a tela SHALL exibir logo “KindSpark” centralizado no topo, subtítulo “Small actions can create big change.”, ilustração editorial central (personagem + coração, estilo soft/warm) e CTA primário “Get Started”.
2. WHEN o usuário toca “Get Started” THEN o app SHALL navegar para Onboarding 2 sem bloqueio.
3. WHEN a tela é exibida THEN não SHALL haver header nativo pesado; hierarquia top → illustration → bottom CTA conforme design system § Onboarding 1.
4. WHEN ilustração não carregar THEN SHALL exibir placeholder suave (fundo `#FFE8D8`) sem quebrar layout.

**Independent Test**: Fluxo cold start → Onboarding 1 → tap Get Started → Onboarding 2.

**Requisitos**: `RUI-OB-01` … `RUI-OB-04`  
**Rastreio**: HU-007 (contexto onboarding), RNF-003

---

### P1: Onboarding — proposta de valor ⭐ MVP

**User Story**: Como usuário novo, quero entender o benefício emocional do hábito positivo antes de configurar o app.

**Why P1**: Reforça tom “calm + rewarding + uplifting”.

**Acceptance Criteria**:

1. WHEN o usuário está em Onboarding 2 THEN a tela SHALL exibir mensagem principal “A positive habit can transform your day.”, ilustração (regador/sol/plantas ou equivalente do mock), indicador de paginação (2 pontos, segundo ativo) e CTA “Continue”.
2. WHEN o usuário toca “Continue” THEN o app SHALL seguir para o fluxo funcional existente (ex.: horário de notificação) **sem alterar** persistência de preferências.
3. WHEN o usuário volta de Onboarding 2 THEN indicador SHALL mostrar primeiro ponto ativo em Onboarding 1.
4. WHEN transição entre OB-1 e OB-2 ocorre THEN SHALL usar fade/soft slide (~250ms), sem efeitos agressivos.

**Independent Test**: Onboarding 2 → Continue → chega em `notification-time` (ou rota equivalente atual).

**Requisitos**: `RUI-OB-05` … `RUI-OB-08`

---

### P1: Today — loop diário visual ⭐ MVP

**User Story**: Como usuário ativo, quero ver minha ação do dia em um card emocional com CTAs claros, no tom acolhedor do mock.

**Why P1**: Tela central do produto (RF-001…RF-004).

**Acceptance Criteria**:

1. WHEN Today carrega com sessão válida THEN o header SHALL exibir saudação personalizada (“Good morning, {name}” ou variação por horário em inglês), badge de streak com ícone chama + número (cor accent laranja), alinhamento mock (saudação à esquerda, streak à direita).
2. WHEN há sugestão ativa THEN o Action Card SHALL ter metade superior fundo `#FFE8D8` com ilustração central, metade inferior branca com título Card Title (18, Bold) e descrição Body secondary.
3. WHEN ações estão disponíveis THEN SHALL exibir botão primário “I did it ✨”, secundário outlined “Skip” e terciário texto “New idea” (com ícone opcional) abaixo dos principais.
4. WHEN o usuário completa a ação (`done`) THEN UI SHALL refletir estado concluído (sem duplicar botões primários de ação) mantendo feedback positivo alinhado ao design system § Today States.
5. WHEN offline ou loading THEN banners/estados SHALL usar cores muted e não competir visualmente com o card principal.
6. WHEN tab Today está ativa THEN ícone da bottom nav SHALL usar cor primária laranja (`#FF6A21`); demais tabs muted.

**Independent Test**: Com sugestão mockada, validar layout, tap “I did it”, “Skip”, “New idea” com mesmos efeitos de `useTodayLoop` que antes.

**Requisitos**: `RUI-TD-01` … `RUI-TD-08`  
**Rastreio**: HU-001, HU-002, HU-003, HU-004, RF-001…RF-004, RNF-004

---

### P1: Progress — motivação e conquistas ⭐ MVP

**User Story**: Como usuário, quero ver meu streak e estatísticas em cards suaves e badges de conquista para me sentir recompensado.

**Why P1**: RF-005, RF-008, HU-005.

**Acceptance Criteria**:

1. WHEN Progress abre THEN título de seção SHALL ser “Your progress” (Title 24, Bold) com fundo app cream.
2. WHEN streak está disponível THEN card principal SHALL exibir “Current streak”, valor “{n} days” em destaque, ícone fogo, fundo `#FFE8D8`, radius 20px.
3. WHEN métricas agregadas existem THEN SHALL exibir linha com três colunas: “Completed”, “Skipped”, “Completion rate” (%) — labels Caption/Secondary, valores SemiBold.
4. WHEN conquistas são listadas THEN seção “Achievements” SHALL ter link “See all >” e fila horizontal de badges circulares para marcos 3, 7, 14, 30 days com estados locked (grayscale), active e completed (cor/laranja) conforme streak real.
5. WHEN milestone message existe (RF-008) THEN SHALL exibir em card/alert suave sem quebrar hierarquia do streak card.
6. WHEN tab Progress está ativa THEN indicador bottom nav laranja.

**Independent Test**: Usuário com streak 7 e logs mistos → números batem com `useProgress`; badges 3 e 7 completed, 14 e 30 locked.

**Requisitos**: `RUI-PR-01` … `RUI-PR-07`  
**Rastreio**: HU-005, RF-005, RF-008

---

### P1: History — revisão do comportamento ⭐ MVP

**User Story**: Como usuário, quero rever o que já fiz em uma lista limpa e cronológica com status visual claro.

**Why P1**: RF-006, HU-006.

**Acceptance Criteria**:

1. WHEN History abre THEN título SHALL ser “History” (Title 24) e lista SHALL ser scroll vertical com itens estilo History row do design system.
2. WHEN cada log é renderizado THEN a linha SHALL ter ícone circular à esquerda, bloco título + data relativa (“Today”, “Yesterday”, “{n} days ago”), indicador à direita: círculo verde + check para `done`, estilo distinto para `skipped` (sem verde de sucesso).
3. WHEN lista está vazia THEN SHALL exibir empty state acolhedor (ilustração leve ou copy positiva), não tela em branco.
4. WHEN há muitos itens THEN scroll SHALL permanecer fluido; padding horizontal 20px; separação entre rows ≥ 12px.
5. WHEN tab History está ativa THEN bottom nav highlight laranja.

**Independent Test**: Logs seed com done/skipped → ordem cronológica e ícones corretos.

**Requisitos**: `RUI-HI-01` … `RUI-HI-05`  
**Rastreio**: HU-006, RF-006

---

### P1: Settings — configurações em list rows ⭐ MVP

**User Story**: Como usuário, quero ajustar lembretes e preferências em uma lista clara com ícones e chevrons, como no mock.

**Why P1**: RF-007, HU-007.

**Acceptance Criteria**:

1. WHEN Settings abre THEN título SHALL ser “Settings” e lista SHALL usar rows com ícone line 2px rounded, label Body, valor/status à direita quando aplicável e chevron `>`.
2. WHEN itens de notificação existem THEN rows SHALL incluir no mínimo: Notifications (toggle/status “On”), Reminder Time (valor “HH:mm”), Sound, Vibration — mantendo bindings atuais de `useSettings`.
3. WHEN itens secundários existem THEN SHALL incluir Privacy, Terms, About, Rate App (navegação ou placeholder consistente se URL ainda não existir).
4. WHEN usuário altera toggle/horário THEN feedback visual de saving/error SHALL seguir paleta (success `#2E9E5B`, warning `#E89C2D`) sem modal intrusivo.
5. WHEN tab Settings está ativa THEN bottom nav laranja; sign out permanece acessível com estilo Ghost/Text, não CTA primário competindo com onboarding.

**Independent Test**: Toggle lembrete, mudar horário, reload — preferências persistem como antes.

**Requisitos**: `RUI-ST-01` … `RUI-ST-06`  
**Rastreio**: HU-007, RF-007

---

### P2: Navegação inferior unificada

**User Story**: Como usuário, quero navegar entre as quatro abas com barra inferior persistente, suave e alinhada ao mock.

**Why P2**: Amarra as cinco telas pós-onboarding; depende de tokens P1.

**Acceptance Criteria**:

1. WHEN usuário está em `(tabs)` THEN bottom navigation SHALL exibir Today, Progress, History, Settings com ícones rounded minimal (line+filled hybrid), labels Caption.
2. WHEN uma tab está ativa THEN ícone e label SHALL usar laranja primário; inativas `#9A9A9A`.
3. WHEN container da tab bar renderiza THEN SHALL preferir topo arredondado do container (rounded top) e fundo `#FFFFFF` com sombra soft, sem competir com conteúdo.
4. WHEN usuário troca de tab THEN indicador SHALL animar em ~250ms (tab indicator movement).

**Independent Test**: Percorrer as quatro abas e verificar estado ativo e ausência de header nativo duplicado onde `headerShown: false`.

**Requisitos**: `RUI-NAV-01` … `RUI-NAV-04`

---

### P2: Biblioteca de componentes compartilhados

**User Story**: Como equipe, quero componentes reutilizáveis (Button, Card, Badge, ListRow, StreakBadge) para evitar duplicação entre telas.

**Why P2**: Reduz drift visual entre features.

**Acceptance Criteria**:

1. WHEN Primary/Secondary/Ghost/Text buttons são usados THEN variantes SHALL mapear 1:1 ao design system § Component Library.
2. WHEN Action card, Stats card, Achievement badge, History item são compostos THEN SHALL aceitar props de conteúdo sem estilos inline divergentes.
3. WHEN Ad card placeholder existir na Today THEN SHALL ser sutil (banner inferior acima da tab bar) sem interromper ação principal — apenas layout shell se ads não integrados.

**Independent Test**: Todas as telas P1 importam de `@/components/ui/*` (ou path convencionado) sem StyleSheet duplicando cores hex.

**Requisitos**: `RUI-CMP-01` … `RUI-CMP-04`

---

### P3: Ilustrações e assets otimizados

**User Story**: Como usuário, quero ilustrações leves e bonitas que carreguem rápido.

**Why P3**: Qualidade emocional depende de art; não bloqueia MVP se placeholders temporários.

**Acceptance Criteria**:

1. WHEN assets de ilustração são empacotados THEN SHALL usar formato adequado (SVG/PNG @2x) com lazy load na tela.
2. WHEN `reduce motion` está ativo THEN ilustrações animadas (se houver Lottie) SHALL pausar.

**Requisitos**: `RUI-AST-01`, `RUI-AST-02`

---

## Edge Cases

- WHEN largura de tela é pequena (< 360px) THEN cards e CTAs SHALL empilhar sem truncar título da ação (máx. 2 linhas + ellipsis).
- WHEN nome do usuário é muito longo THEN saudação Today SHALL truncar com ellipsis preservando streak badge.
- WHEN `colorScheme` do sistema é `dark` THEN app SHALL permanecer em tema claro warm (não alternar para paleta dark atual em `Colors.ts`).
- WHEN font scale do SO > 100% THEN layout SHALL reflow sem sobrepor bottom nav (scroll onde necessário).
- WHEN streak = 0 THEN Progress SHALL mostrar copy encorajadora, não tom de falha/punição.
- WHEN erro de rede em Progress/History THEN mensagem SHALL usar secondary text + opção de retry discreta.

---

## Requisitos consolidados (IDs rastreáveis)

| ID | Descrição | Prioridade | Story | Status |
|----|-----------|------------|-------|--------|
| RUI-DS-01 | Tokens de cor alinhados ao design system | P0 | Fundação | Done |
| RUI-DS-02 | Tipografia Inter + escala | P0 | Fundação | Done |
| RUI-DS-03 | Radius, sombras e spacing scale | P0 | Fundação | Done |
| RUI-DS-04 | Motion durations + reduced motion | P0 | Fundação | Done |
| RUI-DS-05 | Screen padding + safe area | P0 | Fundação | Done |
| RUI-OB-01 | Layout Onboarding 1 (logo, subtítulo, ilustração, CTA) | P0 | Onboarding 1 | Done |
| RUI-OB-02 | CTA “Get Started” → Onboarding 2 | P0 | Onboarding 1 | Done |
| RUI-OB-03 | Sem header nativo pesado em OB-1 | P1 | Onboarding 1 | Done |
| RUI-OB-04 | Fallback ilustração OB-1 | P1 | Onboarding 1 | Done |
| RUI-OB-05 | Layout Onboarding 2 (copy, ilustração, paginação) | P0 | Onboarding 2 | Done |
| RUI-OB-06 | CTA “Continue” → fluxo funcional existente | P0 | Onboarding 2 | Done |
| RUI-OB-07 | Indicador de paginação 2 steps | P1 | Onboarding 2 | Done |
| RUI-OB-08 | Transição suave OB-1 ↔ OB-2 | P1 | Onboarding 2 | Done |
| RUI-TD-01 | Header saudação + streak badge | P0 | Today | Done |
| RUI-TD-02 | Action card split peach/white + ilustração | P0 | Today | Done |
| RUI-TD-03 | CTAs primário/secundário/terciário | P0 | Today | Done |
| RUI-TD-04 | Estados done/skipped/loading/offline | P0 | Today | Done |
| RUI-TD-05 | Tab Today ativa laranja | P1 | Today | Done |
| RUI-TD-06 | Hierarquia visual sem poluição | P1 | Today | Done |
| RUI-TD-07 | Preservar `useTodayLoop` sem mudança de API | P0 | Today | Done |
| RUI-TD-08 | Shell banner ad sutil (layout only) | P2 | Today | Done |
| RUI-PR-01 | Título “Your progress” | P0 | Progress | Done |
| RUI-PR-02 | Streak card peach (“Current streak”, “{n} days”) | P0 | Progress | Done |
| RUI-PR-03 | Tríade métricas (Completed / Skipped / Completion rate) | P0 | Progress | Done |
| RUI-PR-04 | Seção conquistas + badges 3/7/14/30 | P0 | Progress | Done |
| RUI-PR-05 | Estados locked/active/completed badges | P0 | Progress | Done |
| RUI-PR-06 | Milestone message UI | P1 | Progress | Done |
| RUI-PR-07 | Preservar `useProgress` | P0 | Progress | Done |
| RUI-HI-01 | Título “History” + lista cronológica | P0 | History | Done |
| RUI-HI-02 | Row: ícone, título, data relativa, status | P0 | History | Done |
| RUI-HI-03 | Distinção visual done vs skipped | P0 | History | Done |
| RUI-HI-04 | Empty state acolhedor | P1 | History | Done |
| RUI-HI-05 | Preservar `useHistory` | P0 | History | Done |
| RUI-ST-01 | Título “Settings” + list rows | P0 | Settings | Done |
| RUI-ST-02 | Rows Notifications / Reminder Time / Sound / Vibration | P0 | Settings | Done |
| RUI-ST-03 | Rows Privacy / Terms / About / Rate App | P1 | Settings | Done |
| RUI-COPY-01 | Toda copy de UI em inglês (`kindspark-design-system.md`) | P0 | Transversal | Done |
| RUI-ST-04 | Feedback save/error com cores semânticas | P1 | Settings | Done |
| RUI-ST-05 | Preservar `useSettings` | P0 | Settings | Done |
| RUI-ST-06 | Sign out discreto (ghost) | P1 | Settings | Done |
| RUI-NAV-01 | 4 tabs com labels e ícones corretos | P1 | Nav | Done |
| RUI-NAV-02 | Active/inactive tint laranja/muted | P1 | Nav | Done |
| RUI-NAV-03 | Tab bar rounded top + sombra soft | P2 | Nav | Done |
| RUI-NAV-04 | Animação troca de tab ~250ms | P2 | Nav | Done |
| RUI-CMP-01 | Button variants (4) | P1 | Components | Done |
| RUI-CMP-02 | Card variants (action, stats, achievement, history) | P1 | Components | Done |
| RUI-CMP-03 | Badge streak/achievement | P1 | Components | Done |
| RUI-CMP-04 | ListRow settings | P1 | Components | Done |
| RUI-AST-01 | Assets ilustração otimizados | P2 | Assets | Done |
| RUI-AST-02 | Reduced motion em assets animados | P2 | Assets | Done |
| RUI-A11Y-01 | Touch target ≥ 44×44 em CTAs e rows | P0 | Transversal | Done |
| RUI-A11Y-02 | Contraste texto primary/background ≥ WCAG AA | P0 | Transversal | Done |
| RUI-A11Y-03 | Labels accessibility para ícones-only | P1 | Transversal | Done |

**Cobertura:** 48 requisitos | 48 mapeados em `tasks.md` (RUI-T-001…071) | 48 Done

---

## Critérios de aceite (feature “feito”)

### Design system e transversal

- [x] **CA-DS-01**: Inspeção visual confirma cores primárias, background, peach, textos e gradiente CTA iguais à seção *Color Palette* de `kindspark-design-system.md`.
- [x] **CA-DS-02**: Nenhuma tela em escopo usa a paleta azul legada de `constants/Colors.ts` como tint principal.
- [x] **CA-A11Y-01**: Todos os botões e list rows passam alvo mínimo 44×44 em iOS e Android.

### Onboarding (2 telas)

- [x] **CA-OB-01**: Onboarding 1 corresponde ao mock em layout (logo, ilustração, CTA pill laranja) com copy EN: “Small actions can create big change.” / “Get Started”.
- [x] **CA-OB-02**: Onboarding 2 corresponde ao mock em layout (headline, ilustração, dots, “Continue”) com copy EN do design system.
- [x] **CA-OB-03**: Fluxo OB-1 → OB-2 → horário de notificação completa em < 2 min (RNF-003 preservado).

### Today

- [x] **CA-TD-01**: Card de ação com faixa peach + ilustração + texto; header com nome e streak.
- [x] **CA-TD-02**: “I did it”, “Skip” e “New idea” funcionam como antes (RF-003, RF-004, RF-002).
- [x] **CA-TD-03**: Comparação lado a lado com mock Screen 6 ≥ 90% paridade visual (copy EN, não PT do mock).

### Progress

- [x] **CA-PR-01**: Streak card, métricas e conquistas visíveis conforme mock Screen 9.
- [x] **CA-PR-02**: Números exibidos batem com dados reais do backend/local (sem mock estático em produção).

### History

- [x] **CA-HI-01**: Lista com ícone, título, data relativa e check verde para done conforme mock Screen 10.
- [x] **CA-HI-02**: RF-006 intacto — ordenação e status corretos após done/skip.

### Settings

- [x] **CA-ST-01**: Lista com ícones, chevrons e status (“On”, “09:00”) conforme mock Screen 11 (labels EN).
- [x] **CA-ST-02**: RF-007 intacto — toggle e horário persistem e disparam notificação como antes.

### Regressão

- [x] **CA-REG-01**: Suite manual MVP v0.1 (checklist em `.specs/features/v0.1-mvp/spec.md`) passa sem alteração de comportamento.
- [x] **CA-COPY-01**: Nenhuma string voltada ao usuário em português nas telas em escopo.
- [x] **CA-REG-02**: `npm run lint` e typecheck passam após redesign.

---

## Requirement Traceability (MVP ↔ redesign)

| Requisito redesign | Requisito MVP | Verificação |
|--------------------|---------------|-------------|
| RUI-TD-03, RUI-TD-07 | RF-002, RF-003, RF-004 | Tap CTAs Today |
| RUI-PR-02, RUI-PR-07 | RF-005, RF-008 | Streak e milestones |
| RUI-HI-02, RUI-HI-05 | RF-006 | Histórico após ações |
| RUI-ST-02, RUI-ST-05 | RF-007 | Settings notificação |
| RUI-OB-06 | RNF-003 | Tempo onboarding |
| RUI-A11Y-* | RNF-002 | Simplicidade + a11y |

---

## Success Criteria

- [ ] Usuário descreve a app como “acolhedora/leve” em teste informal (≥ 3/5 participantes) — deferred pós-release.
- [x] Paridade visual com mock ≥ 90% nas 6 superfícies (checklist de design review; UAT manual 2026-05-25).
- [x] Zero regressões nos critérios de aceite do MVP v0.1 relacionados a RF-001…RF-007 (CA-REG-01).
- [x] Tokens documentados em código espelham `kindspark-design-system.md` (única fonte de hex para UI nova).

---

## Referência visual (mockup)

| Tela spec | Seção design system | Referência mock |
|-----------|---------------------|-----------------|
| Onboarding 1 | § 1. Onboarding 1 | Screen 1 — layout/ilustração; copy EN do design system |
| Onboarding 2 | § 2. Onboarding 2 | Screen 2 — layout/dots; copy EN (“Continue”) |
| Today | § 6. Today Screen | Screen 6 — card coração, streak 7, CTAs |
| Progress | § 9. Progress Screen | Screen 9 — streak, stats, achievements (EN labels) |
| History | § 10. History Screen | Screen 10 — lista com check verde |
| Settings | § 11. Settings Screen | Screen 11 — rows com chevron |

---

## Encerramento

Feature concluída: Specify → Design → Tasks → Execute (R7) + UAT manual. Backlog visual futuro: `redesign-ui-phase-2` (completion screen, modais, auth skin).
