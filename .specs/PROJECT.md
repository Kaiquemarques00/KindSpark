# KindSpark — PROJECT (TLC Specify)

Documento mestre de visão e limites. O detalhe de produto permanece em `kindspark.md` na raiz; aqui consolidamos o que guia implementação e validação.

## Problema

Pessoas querem incorporar mais ações positivas no dia a dia, mas não possuem um sistema simples de ativação e repetição. A intenção existe; a execução não — por falta de ideias práticas, esquecimento, rotina corrida e baixa motivação.

## Visão

Aplicativo mobile extremamente simples que transforma boas intenções em hábito diário através do loop: **receber ideia → agir → registrar → repetir**.

## Proposta de valor (north star)

> Uma pequena boa ação por dia pode mudar seu dia — e talvez o de outra pessoa.

## Hipótese principal

Sugestões simples e acessíveis, combinadas com lembretes e feedback visual de progresso, aumentam consistência e criam hábito positivo.

## Objetivos da v0.1 (mensuráveis)

| Objetivo | Critério |
|----------|----------|
| Proposta | Usuários completam o loop pelo menos uma vez |
| Retenção | D1, D7, D30 retention |
| Hábito | Streak médio, taxa de completion, skip rate |
| Notificações | Retorno após push configurável |
| Ativação | Instalação → primeira ação marcada (done ou skip) |

## Público

Adultos 18–45 interessados em bem-estar, hábitos positivos e mindfulness. Secundários: estudantes, profissionais estressados, usuários de apps de hábitos.

## Princípios de produto (v0.1)

1. Simplicidade extrema — uma ação por dia, poucos toques.
2. Baixa fricção — ações rápidas, sem custo obrigatório, universais.
3. Loop comportamental completo — trigger → action → reward → repeat.
4. Mobile only — sem web app, sem social, sem IA na v0.1.
5. Validação antes de monetização — medir hábito e retenção, não receita.

## Fora de escopo (v0.1)

IA generativa, feed social, ranking, comunidade, marketplace de ideias, perfis públicos, conteúdo premium, web app.

## Stack alvo (decisão inicial)

Ver `.specs/STACK.md`. Ajustes documentados em `STATE.md`.

## Rastreabilidade

- Requisitos funcionais: `RF-xxx` em `kindspark.md` e na spec da feature.
- Histórias: `HU-xxx` na spec da feature.
- Riscos: repetitividade, sugestões genéricas, retenção pós-curiosidade, valor percebido insuficiente.

## Fase TLC atual

**Specify** concluído para v0.1. **Design** e **Tasks** em `.specs/features/v0.1-mvp/`. **Execute** inicia após bootstrap do app Expo + Supabase.
