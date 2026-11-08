# Contribuindo

## Ambiente

Tudo roda em container, então só são necessários Podman (ou Docker) e `make`. Não precisa ter Node instalado.

| Comando        | O que faz                                                  |
| -------------- | ---------------------------------------------------------- |
| `make install` | Instala as dependências (`npm ci`)                         |
| `make dev`     | Vite e servidor de logs em http://localhost:5173           |
| `make check`   | Formatação, lint, tipos e testes, igual ao CI              |
| `make test`    | Só os testes                                               |
| `make lint`    | ESLint                                                     |
| `make format`  | Prettier                                                   |
| `make build`   | Extensão em `dist/` e servidor em `dist-server/server.mjs` |
| `make shell`   | Shell dentro do container de desenvolvimento               |

O `make dev` lê os logs de `~/system_logs`. Sem logs, a página mostra o aviso de que nada foi encontrado.

## Fluxo

1. Crie uma branch a partir de `main`, como `feat/nome` ou `fix/nome`.
2. Escreva mensagens de commit no formato `feat:`, `fix:`, `docs:`, `test:` ou `chore:`.
3. Rode `make check` antes de subir. O CI roda os mesmos passos, mais o build da extensão e da imagem.
4. Abra o PR com `gh pr create --fill` e descreva como testar.

## Testes

Os testes usam Vitest e ficam ao lado do código (`*.test.ts` e `*.test.tsx`). Testes de componente começam com `// @vitest-environment jsdom`. Mudança de comportamento entra com teste.

## Casos comuns

**Uma chave nova nos logs.** Atualize `src/shared/types.ts`, a tabela `PT_EN` em `src/shared/normalize.ts` (se a chave existir em português) e os testes de `src/shared/normalize.test.ts`.

**Um componente novo do shadcn.** O `components.json` já está configurado. Dentro de `make shell`, rode `npx shadcn@latest add <componente>`.

**Uma porta diferente.** Veja a seção Configuração do [README](README.md).

## Estrutura

O mapa de pastas e arquivos está em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).
