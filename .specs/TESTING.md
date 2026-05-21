# Infraestrutura de testes — KindSpark

**Analisado em:** 2026-05-21

## Frameworks de teste

| Camada | Ferramenta | Observações |
|--------|------------|-------------|
| Análise estática | ESLint (`eslint-config-expo`) | `eslint.config.js` |
| Tipagem | TypeScript 5.9 (`tsc --noEmit`) | Modo strict |
| Unitário / Integração / E2E | — | Fora do escopo v0.1; testes manuais em dispositivo (ROADMAP M4) |
| CI | GitHub Actions `.github/workflows/ci.yml` | Executa o gate **Full** em PRs para `main` |

## Organização dos testes

Ainda não há suíte `__tests__`. A verificação de features é manual (Expo Go / build preview) mais os gates estáticos abaixo.

## Matriz de cobertura

| Camada de código | Tipo de teste exigido | Padrão de localização | Comando |
|------------------|----------------------|------------------------|---------|
| Rotas / telas do app | Manual + gate estático | `app/**`, `features/**` | `npm run gate` antes do PR |
| Client Supabase / offline | Gate estático | `lib/**` | `npm run gate` |
| Migrations SQL | Manual (`supabase db reset`) | `supabase/migrations/**` | Ver `supabase/README.md` |
| RPC / RLS | Manual (isolamento com dois usuários) | `supabase/migrations/**` | Verificação T-013 em `tasks.md` |

## Comandos de gate

Extraídos de `package.json` e da CI (T-003). Saída diferente de zero = parada obrigatória.

| Nível do gate | Quando usar | Comando |
|---------------|-------------|---------|
| Quick | Edições pequenas; feedback mais rápido | `npm run gate:quick` |
| Full | Padrão antes de commit/PR; **igual à CI** | `npm run gate` |
| Build | Fim de fase / release (igual ao Full até export entrar na CI) | `npm run gate:build` |

### O que cada gate executa

| Script | Etapas |
|--------|--------|
| `gate:quick` | `typecheck` |
| `gate` | `lint` → `typecheck` |
| `gate:build` | igual ao `gate` |

## Verificação manual (v0.1)

- **Loop / auth / offline:** Expo Go ou preview EAS em dispositivo
- **Push:** dispositivo físico no horário configurado (T-022)
- **Cold start:** checklist em `docs/PERFORMANCE.md` (T-052)

## Avaliação de paralelismo

| Tipo de teste | Paralelo seguro? | Evidência |
|---------------|------------------|-----------|
| lint | Sim | Varredura de arquivos sem estado |
| typecheck | Sim | Compilação do projeto sem estado |
| job da CI | Sim | Job único, etapas sequenciais |
