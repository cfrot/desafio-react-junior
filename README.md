# Desafio React Júnior - Painel de Solicitações

Mini painel de solicitações desenvolvido em React como parte do desafio técnico para a vaga de Desenvolvedor Front-end Júnior.

A aplicação simula um sistema de solicitações com autenticação, controle de acesso por perfis de usuário e consumo de API mockada, reproduzindo um fluxo próximo ao que seria encontrado em um ambiente real de produção.

---

## Tecnologias utilizadas

- React
- Vite
- React Router DOM
- JavaScript (ES6+)
- CSS3
- Local Storage
- API Mockada (Serviço em memória com setTimeout)

---

## Como executar o projeto

Clone o repositório:

```bash
git clone https://github.com/cfrot/desafio-react-junior.git
```

Acesse a pasta do projeto:

```bash
cd desafio-react-junior
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

---

## Build da aplicação

Para gerar a build de produção:

```bash
npm run build
```

---

## Usuários de teste

### EMPRESA

```text
E-mail: maria@empresa.com
Senha: 123456
```

Permissões:

- Visualizar apenas as solicitações da própria empresa.
- Visualizar o botão "Nova Solicitação".

---

### CONTADOR

```text
E-mail: joao@contabil.com
Senha: 123456
```

Permissões:

- Visualizar as solicitações das empresas que atende.

---

### ADMIN

```text
E-mail: admin@cont365.com
Senha: 123456
```

Permissões:

- Visualizar todas as solicitações cadastradas.
- Excluir solicitações do sistema.

---

## Funcionalidades implementadas

- Login com autenticação simulada.
- Persistência da sessão utilizando Local Storage.
- Rotas protegidas.
- Controle de acesso por perfis de usuário.
- Consumo de API mockada.
- Listagem de solicitações.
- Exclusão de solicitações pelo perfil ADMIN.
- Tratamento de estados de carregamento.
- Tratamento de erros de autenticação (401 - Não autorizado).
- Logout do usuário.
- Interface responsiva.

---

## API Mockada

O projeto simula o consumo de uma API real conforme especificado no desafio técnico.

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "maria@empresa.com",
  "senha": "123456"
}
```

Response:

```json
{
  "token": "fake-jwt-empresa",
  "usuario": {
    "id": 1,
    "nome": "Maria Souza",
    "email": "maria@empresa.com",
    "perfil": "EMPRESA",
    "empresa": "Padaria Pão Quente"
  }
}
```

---

### Listagem de solicitações

```http
GET /solicitacoes
```

Header:

```http
Authorization: Bearer <token>
```

---

### Exclusão de solicitações

```http
DELETE /solicitacoes/{id}
```

Header:

```http
Authorization: Bearer <token>
```

---

## Estrutura do projeto

```text
src
│
├── assets
│
├── components
│   ├── Button.jsx
│   ├── Input.jsx
│   └── SolicitacaoCard.jsx
│
├── pages
│   ├── Dashboard.jsx
│   └── Login.jsx
│
├── routes
│   └── ProtectedRoute.jsx
│
├── services
│   └── api.js
│
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

---

## Decisões técnicas

Durante o desenvolvimento do projeto, optei por seguir o escopo proposto no desafio e priorizar simplicidade, organização e legibilidade do código.

Como não havia um back-end disponível, implementei uma API mockada utilizando um serviço em memória com latência simulada através de `setTimeout`, consumida pelo front-end como se fosse uma API real. Dessa forma, foi possível trabalhar com rotas (`POST /auth/login`, `GET /solicitacoes` e `DELETE /solicitacoes/{id}`), métodos HTTP, autenticação via Bearer Token e tratamento de respostas de erro, mantendo a experiência próxima de um ambiente de produção.

Para a autenticação, utilizei o `localStorage` para armazenar o token e os dados do usuário, permitindo a persistência da sessão mesmo após o refresh da página. A escolha foi feita por ser uma solução simples e suficiente para o escopo do desafio, além de facilitar a implementação das rotas protegidas.

Optei também por não utilizar bibliotecas adicionais de gerenciamento de estado, como Context API ou Redux, uma vez que a aplicação possui apenas duas telas e um fluxo de autenticação simples. A intenção foi evitar adicionar complexidade desnecessária ao projeto e demonstrar que é possível entregar uma solução organizada utilizando apenas os recursos nativos do React.

A estrutura do projeto foi dividida em componentes reutilizáveis, páginas, serviços responsáveis pela comunicação com a API mockada e rotas protegidas, buscando separar as responsabilidades de cada parte da aplicação e facilitar sua manutenção e escalabilidade.

Por fim, todas as regras de negócio descritas no desafio foram implementadas, incluindo controle de acesso por perfil (EMPRESA, CONTADOR e ADMIN), tratamento dos estados de carregamento e erro, persistência da sessão, tratamento de respostas 401 (não autorizado) e logout do usuário.

---

## Considerações finais

O principal objetivo deste projeto foi reproduzir um pequeno fluxo de autenticação e autorização encontrado em aplicações corporativas, mantendo o código simples, organizado e aderente aos requisitos do desafio técnico.

Todas as funcionalidades obrigatórias propostas no enunciado foram implementadas e testadas, buscando demonstrar boas práticas de componentização, organização do projeto e consumo de APIs utilizando React.