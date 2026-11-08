# Arquitetura do sysmetrics-dashboard

Mapa das pastas e arquivos do projeto.

## Pastas e arquivos

```text
sysmetrics-dashboard/
├── .github/                             # automação do GitHub
│   ├── workflows/                       # workflows do GitHub Actions
│   │   └── ci.yml                       # CI: formatação, lint, tipos, testes, build e imagem
│   └── pull_request_template.md         # modelo de descrição de PR
├── deploy/                              # arquivos de instalação no host
│   └── sysmetrics-dashboard.service.in  # modelo da unit systemd de usuário
├── docs/                                # documentação
├── public/                              # copiado como está para dist/
│   ├── background.js                    # abre a página quando clica no ícone da extensão
│   └── manifest.json                    # manifesto da extensão (Manifest V3)
├── server/                              # servidor local de logs (Node e TypeScript)
│   ├── app.test.ts                      # testes das rotas e da segurança
│   ├── app.ts                           # servidor HTTP somente leitura: /days, /day/AAAAMMDD, checagem de Host
│   ├── logs.test.ts                     # testes da leitura dos logs
│   ├── logs.ts                          # lista os dias e lê os .jsonl em inglês e português
│   └── main.ts                          # ponto de entrada, lê PORT, HOST e LOG_DIR
├── src/                                 # interface (React, Vite, Tailwind, shadcn)
│   ├── components/                      # componentes da página
│   │   ├── ui/                          # componentes do shadcn
│   │   │   ├── button.tsx               # botão
│   │   │   ├── card.tsx                 # cartão
│   │   │   └── table.tsx                # tabela
│   │   ├── ProcessTable.test.tsx        # teste da tabela
│   │   ├── ProcessTable.tsx             # tabela dos processos mais ativos
│   │   ├── SeriesChart.tsx              # gráfico de linhas (Recharts)
│   │   └── StatStrip.tsx                # faixa com a última leitura
│   ├── lib/                             # lógica sem interface
│   │   ├── api.ts                       # chamadas ao servidor local
│   │   ├── metrics.test.ts              # testes da lógica de métricas
│   │   ├── metrics.ts                   # séries dos gráficos, resumo e formatação
│   │   └── utils.ts                     # cn(), união de classes do Tailwind
│   ├── shared/                          # usado pelo servidor e pela interface
│   │   ├── normalize.test.ts            # testes da tradução
│   │   ├── normalize.ts                 # traduz as chaves em português para inglês
│   │   └── types.ts                     # tipos de uma leitura do log
│   ├── test/                            # apoio dos testes
│   │   ├── fixture.ts                   # leitura de exemplo
│   │   └── setup.ts                     # configuração do Vitest e do Testing Library
│   ├── App.test.tsx                     # teste da página com fetch simulado
│   ├── App.tsx                          # página: busca dados, seletor de dia, atualização a cada 5 min
│   ├── index.css                        # Tailwind e tema claro/escuro
│   └── main.tsx                         # monta o React na página
├── .editorconfig                        # indentação e fim de linha padronizados
├── .gitignore                           # o que o git ignora
├── .prettierignore                      # o que o Prettier ignora
├── .prettierrc                          # regras de formatação
├── components.json                      # configuração do CLI do shadcn
├── Containerfile                        # imagem do servidor (build em dois estágios)
├── CONTRIBUTING.md                      # ambiente, fluxo de PR e testes
├── eslint.config.js                     # regras do ESLint
├── index.html                           # entrada do Vite, vira a página da extensão
├── LICENSE                              # licença MIT
├── Makefile                             # comandos do dia a dia, em container (podman antes de docker)
├── package-lock.json                    # versões travadas das dependências
├── package.json                         # dependências e scripts npm
├── README.md                            # instalação, uso e solução de problemas
├── tsconfig.json                        # configuração do TypeScript
├── vite.config.ts                       # Vite, Tailwind e proxy de /api no dev
└── vitest.config.ts                     # configuração dos testes
```

## Como as peças se conectam

```text
sysmetrics_en.sh / sysmetrics_pt.sh   (repositório sysmetrics-collector)
        │  gravam uma linha JSON por coleta
        ▼
~/system_logs/system_AAAAMMDD.jsonl  e  sistema_AAAAMMDD.jsonl
        │  lidos em modo somente leitura
        ▼
server/  (container, serviço systemd, 127.0.0.1:8765)
        │  normaliza as chaves para inglês e serve /days e /day/AAAAMMDD
        ▼
src/  (extensão do navegador, página aberta ao clicar no ícone)
        busca a cada 5 minutos e mostra cartões, gráficos e tabela
```

A pasta `src/shared/` é o ponto em comum: o servidor usa `normalize.ts` para unificar os dois idiomas, e a interface usa `types.ts` para saber o formato de uma leitura.

## Gerado e fora do git

- `node_modules/`: dependências instaladas por `make install`.
- `dist/`: a extensão pronta para carregar no navegador, gerada por `make build`.
- `dist-server/server.mjs`: o servidor empacotado em um arquivo, usado pela imagem do container.
- `coverage/`: relatórios de cobertura, se gerados.
