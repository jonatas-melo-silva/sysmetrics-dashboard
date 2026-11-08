CE ?= $(shell command -v podman 2>/dev/null || command -v docker 2>/dev/null)
NODE_IMAGE ?= docker.io/library/node:22-slim
IMAGE ?= sysmetrics-dashboard
UNIT_DIR ?= $(HOME)/.config/systemd/user

ifeq ($(CE),)
$(error Podman ou Docker não encontrado)
endif

ifeq ($(notdir $(CE)),podman)
USERFLAGS := --userns=keep-id
else
USERFLAGS := --user $(shell id -u):$(shell id -g)
endif

RUN = $(CE) run --rm $(USERFLAGS) -e HOME=/tmp -v $(CURDIR):/app -w /app

.PHONY: help dev install test lint typecheck format check build image service-install shell clean
.DEFAULT_GOAL := help

help: ## Lista os comandos
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-16s %s\n", $$1, $$2}'

dev: ## Vite + servidor de logs em http://localhost:5173 (lê ~/system_logs)
	$(CE) run --rm $(USERFLAGS) -e HOME=/tmp -e LOG_DIR=/logs -v $(CURDIR):/app -v $(HOME)/system_logs:/logs:ro -w /app -p 127.0.0.1:5173:5173 $(NODE_IMAGE) sh -c 'npx tsx server/main.ts & npm run dev -- --host'

install: ## Instala as dependências (npm ci) dentro do container
	$(RUN) $(NODE_IMAGE) npm ci

test: ## Roda os testes
	$(RUN) $(NODE_IMAGE) npm test

lint: ## Roda o ESLint
	$(RUN) $(NODE_IMAGE) npm run lint

typecheck: ## Confere os tipos do TypeScript
	$(RUN) $(NODE_IMAGE) npm run typecheck

format: ## Formata o código com Prettier
	$(RUN) $(NODE_IMAGE) npm run format

check: ## Formatação, lint, tipos e testes, como no CI
	$(RUN) $(NODE_IMAGE) sh -c 'npm run format:check && npm run lint && npm run typecheck && npm test'

build: ## Gera a extensão em dist/ e o servidor em dist-server/server.mjs
	$(RUN) $(NODE_IMAGE) sh -c 'npm run build && npm run build:server'

image: ## Constrói a imagem do servidor
	$(CE) build -f Containerfile -t $(IMAGE) .

service-install: image ## Instala e liga o serviço systemd de usuário
	mkdir -p $(UNIT_DIR)
	sed -e 's|@CE@|$(CE)|g' -e 's|@USERFLAGS@|$(USERFLAGS)|g' deploy/sysmetrics-dashboard.service.in > $(UNIT_DIR)/sysmetrics-dashboard.service
	systemctl --user daemon-reload
	systemctl --user enable --now sysmetrics-dashboard

shell: ## Abre um shell no container de desenvolvimento
	$(RUN) -it $(NODE_IMAGE) bash

clean: ## Apaga node_modules, dist e dist-server
	rm -rf node_modules dist dist-server coverage
