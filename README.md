# SysMetrics Dashboard

[![CI](https://github.com/jonatas-melo-silva/sysmetrics-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/jonatas-melo-silva/sysmetrics-dashboard/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

Extensão de navegador que mostra, em uma página só, temperaturas, carga, memória, disco e processos do seu Linux, a partir dos logs que os scripts do [sysmetrics-collector](https://github.com/jonatas-melo-silva/sysmetrics-collector) gravam. Os dados ficam na sua máquina: o servidor só responde em `127.0.0.1`.

```text
sysmetrics_en.sh / sysmetrics_pt.sh
        │  uma linha JSON por coleta
        ▼
~/system_logs/*.jsonl  ──►  servidor local (container, 127.0.0.1:8765)  ──►  extensão do navegador
```

## Requisitos

- Linux com systemd
- Podman ou Docker, e `make`
- Navegador Chromium com suporte a extensões Manifest V3 (Brave, Chrome)
- Logs em `~/system_logs`, gerados por `sysmetrics_en.sh` ou `sysmetrics_pt.sh`

## Instalação

Baixe o projeto e instale o servidor como serviço de usuário. O `make` usa Podman e, se ele não existir, Docker:

```bash
git clone git@github.com:jonatas-melo-silva/sysmetrics-dashboard.git
cd sysmetrics-dashboard
make service-install
curl -s 127.0.0.1:8765/days
```

O `curl` deve devolver a lista de dias com log, por exemplo `["20261105"]`.

Depois gere a extensão e carregue no navegador:

```bash
make install
make build
```

Em `brave://extensions` (ou `chrome://extensions`), ligue o modo do desenvolvedor, clique em "Carregar sem compactação" e escolha a pasta `dist/`.

## Uso

Gere logs com um dos scripts, de preferência a cada 5 minutos pelo cron (`crontab -e`):

```text
*/5 * * * * /caminho/completo/sysmetrics_en.sh > /dev/null 2>&1
```

Clique no ícone da extensão para abrir a página. Ela mostra a última leitura (temperaturas, RAM, swap, disco, carga e uptime), os gráficos de temperatura, carga e memória do dia e a tabela dos processos mais ativos, agrupados por comando. O seletor escolhe qualquer dia que tenha log, e a página busca dados novos a cada 5 minutos ou ao clicar em Atualizar.

Os arquivos dos dois scripts são aceitos juntos: `system_AAAAMMDD.jsonl` (chaves em inglês) e `sistema_AAAAMMDD.jsonl` (chaves em português). Para ver o que o servidor entrega:

```bash
curl -s 127.0.0.1:8765/day/20261105 | head -c 300
```

## Configuração

Variáveis de ambiente do servidor:

| Variável      | Padrão          | O que faz                                                        |
| ------------- | --------------- | ---------------------------------------------------------------- |
| `LOG_DIR`     | `~/system_logs` | Pasta com os arquivos `.jsonl`                                   |
| `PORT`        | `8765`          | Porta em que o servidor escuta                                   |
| `HOST`        | `127.0.0.1`     | Endereço de escuta (a imagem usa `0.0.0.0` e publica só no host) |
| `PUBLIC_PORT` | igual a `PORT`  | Porta que o cliente enxerga, se for diferente da de escuta       |

Para mudar a porta, altere também `public/manifest.json`, `src/lib/api.ts` e o `-p` em `deploy/sysmetrics-dashboard.service.in`, e rode `make service-install` e `make build` de novo.

O servidor é somente leitura, recusa qualquer `Host` que não seja `127.0.0.1` ou `localhost` e não envia cabeçalhos CORS, então só a extensão consegue consultá-lo.

## Solução de problemas

**A página diz que o servidor não respondeu.** Veja o estado do serviço com `systemctl --user status sysmetrics-dashboard` e os logs com `journalctl --user -u sysmetrics-dashboard`.

**`/days` volta vazio mesmo com logs na pasta.** O container roda sem root e precisa de permissão de leitura nos arquivos. Confira com `ls -l ~/system_logs`: os `.jsonl` devem ter leitura para todos (`-rw-r--r--`).

**`unauthorized` ao baixar a imagem.** O Podman está usando um login antigo do Docker Hub. Rode `podman logout docker.io` e tente de novo.

**Os gráficos têm poucos pontos.** Cada coleta é um ponto. Sem o cron rodando, só aparecem as coletas que você fez à mão.

## Contribuindo

O ambiente de desenvolvimento, os testes e o fluxo de PR estão em [CONTRIBUTING.md](CONTRIBUTING.md). O mapa de pastas e arquivos está em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Licença

[MIT](LICENSE)
