# 🛡️ GateKeeper RBAC System

## 📌 Visão Geral

**GateKeeper RBAC System** é uma aplicação web **Single Page Application (SPA)** focada em **Autenticação** e **Controle de Acesso Baseado em Funções (RBAC – Role-Based Access Control)**.

O projeto foi desenvolvido como um **boilerplate profissional** para sistemas administrativos seguros, demonstrando boas práticas de arquitetura frontend, controle de permissões e organização de código utilizando **React e TypeScript**.

---

## 🎯 Objetivo do Projeto

O principal objetivo do GateKeeper RBAC é **controlar quem pode acessar o quê dentro de um sistema**, garantindo segurança, organização e escalabilidade.

Ele pode ser utilizado como:
- Base para **dashboards administrativos**
- Fundação para **sistemas internos corporativos**
- Projeto de estudo avançado para **autenticação e RBAC**
- Demonstração prática de arquitetura frontend moderna

---

## ⚙️ Funcionalidades Principais

### 🔐 Autenticação
- Login de usuários
- Registro de novos usuários
- Recuperação de senha
- Persistência de sessão
- Opção “Lembrar-me”

### 🧩 Controle de Acesso (RBAC)
O sistema diferencia permissões entre três perfis:

- **Admin**
  - Acesso total ao sistema
  - Gerenciamento de usuários (CRUD)
- **User**
  - Acesso ao painel principal
  - Funcionalidades padrão
- **Viewer**
  - Acesso restrito apenas para visualização

### 👥 Gerenciamento de Usuários
- Criação, edição e exclusão de usuários
- Busca e listagem
- Controle de permissões por perfil

### 🎨 Experiência do Usuário (UX)
- Interface moderna
- Suporte a múltiplos idiomas (PT-BR, EN, ES)
- Dark Mode e Light Mode
- Design com Glassmorphism, gradientes e animações suaves

---

## 🛠️ Tecnologias Utilizadas

### 🔧 Stack Principal
- **TypeScript** — tipagem estática e maior segurança
- **React 19** — versão mais recente (ESM)
- **React Router DOM v7** — roteamento e proteção de páginas
- **Tailwind CSS** — estilização moderna e responsiva

### 🧰 Recursos e Bibliotecas
- **Context API** — gerenciamento de estado global
- **Hooks modernos** (`useState`, `useEffect`, `useContext`, `useCallback`)
- **Emojis e SVGs inline** — ícones leves e sem dependências externas

---

## 📐 Arquitetura e Metodologia

O projeto segue princípios de **Clean Architecture aplicada ao Frontend**, com forte separação de responsabilidades e componentização modular.

### 🧠 Gerenciamento de Estado Global
- **AuthContext**
  - Controle de autenticação
  - Usuário atual
  - Token e permissões
- **ThemeContext**
  - Alternância entre Dark Mode e Light Mode
- **LanguageContext**
  - Internacionalização (i18n)
  - Português (BR), Inglês e Espanhol

---

## 🧪 Simulação de Backend (Mock Service)

O projeto **não utiliza um backend real** (Node, Python, etc.).

O arquivo `auth.service.ts` simula um servidor:
- Persistência de dados via `LocalStorage` e `SessionStorage`
- Simulação de banco de dados local
- Delays artificiais (`setTimeout`) para simular latência de rede
- Estados de carregamento realistas (`loading`)

Essa abordagem permite demonstrar:
- Fluxos reais de autenticação
- Tratamento de estados assíncronos
- UX semelhante a aplicações em produção

---

## 🔒 Segurança no Frontend

- **ProtectedRoute**
  - Bloqueia acesso de usuários não autenticados
- **RoleGuard**
  - Verifica se o usuário possui a role necessária
- Redirecionamento automático para:
  - Login
  - Página de Acesso Negado

Toda a lógica de permissões é **centralizada**, evitando condicionais espalhadas pelo código.

---

## 📂 Estrutura de Pastas

src/

├── app/ # Configuração principal e rotas

├── auth/ # Contexto e serviços de autenticação

├── pages/ # Telas da aplicação

├── components/ # Componentes reutilizáveis

├── hooks/ # Hooks customizados

├── services/ # Serviços e mock de API

├── types/ # Tipagens TypeScript

└── utils/ # Utilitários e helpers

---

## 📚 Observações Importantes

Este projeto não tem foco em backend

O objetivo é demonstrar:

Arquitetura frontend

Autenticação

RBAC

Boas práticas com React e TypeScript

Em produção, recomenda-se:

Backend real

Tokens em cookies HttpOnly

Validações no servidor

---

## 🚀 Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

