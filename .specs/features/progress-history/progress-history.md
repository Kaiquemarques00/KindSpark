# Feature: Melhorias em Progress e History

> **SDD (Specify → Design → Tasks):** documentação formal em  
> `.specs/features/progress-history/spec.md` · `design.md` · `tasks.md`  
> Fonte de produto (este arquivo) → requisitos rastreáveis `PH-*` → tarefas `PH-T-*`.

## Visão Geral

Essa feature expande as telas de progresso e histórico para torná-las mais úteis, exploráveis e emocionalmente motivadoras.

O objetivo é transformar dados simples em feedback significativo para fortalecer retenção e engajamento.

---

## Problema

Estado atual potencial:

- estatísticas superficiais
- pouco incentivo para navegação
- baixa profundidade emocional
- histórico pouco interessante

Usuário conclui ações, mas não sente evolução clara.

---

## Objetivo

Criar áreas de progresso que incentivem retorno e exploração.

Resultados esperados:

- aumento do tempo de sessão
- maior navegação entre telas
- reforço de hábito
- aumento de retenção

---

## Escopo

Melhorar:

- Progress Screen
- History Screen

---

## Progress Screen

### Streak

Exibir:

- streak atual
- maior streak histórico

---

### Estatísticas Gerais

Exemplos:

- total de ações concluídas
- total de skips
- completion rate
- porcentagem semanal

---

### Resumo Semanal

Exemplo:

"Você completou 5 de 7 dias nesta semana."

---

### Heatmap / Calendário

Visualização diária.

Estados:

- concluído
- pulado
- sem atividade

---

### Achievements Leves

Exemplos:

- primeira ação concluída
- 7 dias seguidos
- 30 ações concluídas

Sem gamificação pesada.

---

## History Screen

Lista cronológica de ações.

Cada item pode conter:

- título
- data
- status
- categoria (futuro)

---

## Filtros

Permitir:

- todos
- concluídos
- pulados
- últimos 7 dias
- últimos 30 dias

---

## Regras de Negócio

### BR-001

Mostrar apenas dados persistidos reais.

---

### BR-002

Nunca gerar estatísticas artificiais.

---

### BR-003

Skips devem ser visualmente diferenciados.

---

### BR-004

Histórico deve escalar bem.

Usar paginação ou virtualização.

---

## Eventos de Tracking

Eventos:

- progress_screen_viewed
- history_screen_viewed
- achievement_viewed
- history_filter_changed
- calendar_day_tapped

---

## Edge Cases

### Novo usuário

Estado vazio:

"Sua jornada de gentileza começa hoje."

---

### Histórico vazio

Exibir empty state amigável.

---

### Dados inconsistentes

Fallback seguro sem quebrar interface.

---

## Fora de Escopo

Não inclui:

- analytics emocionais
- notas pessoais
- ranking
- comparações sociais
- desafios semanais

---

## Métricas de Sucesso

Medir:

- tempo médio em Progress
- tempo médio em History
- navegação pós-conclusão
- impacto em retenção