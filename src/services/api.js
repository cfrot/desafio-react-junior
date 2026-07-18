const usuarios = [
  {
    id: 1,
    nome: "Maria Souza",
    email: "maria@empresa.com",
    senha: "123456",
    perfil: "EMPRESA",
    empresa: "Padaria Pão Quente",
    token: "fake-jwt-empresa",
  },
  {
    id: 2,
    nome: "João Contador",
    email: "joao@contabil.com",
    senha: "123456",
    perfil: "CONTADOR",
    empresasAtendidas: [
      "Padaria Pão Quente",
      "Auto Peças Veloz",
    ],
    token: "fake-jwt-contador",
  },
  {
    id: 3,
    nome: "Administrador",
    email: "admin@cont365.com",
    senha: "123456",
    perfil: "ADMIN",
    token: "fake-jwt-admin",
  },
];

let solicitacoes = [
  {
    id: 101,
    assunto: "Envio de nota fiscal de fevereiro",
    empresa: "Padaria Pão Quente",
    solicitante: "Maria Souza",
    prioridade: "Alta",
    status: "Aberta",
    responsavel: "Ana (Fiscal)",
  },
  {
    id: 102,
    assunto: "Dúvida sobre Simples Nacional",
    empresa: "Auto Peças Veloz",
    solicitante: "Carlos Lima",
    prioridade: "Média",
    status: "Em andamento",
    responsavel: "Pedro (Contábil)",
  },
  {
    id: 103,
    assunto: "Fechamento da folha de março",
    empresa: "Padaria Pão Quente",
    solicitante: "Maria Souza",
    prioridade: "Alta",
    status: "Aberta",
    responsavel: "Júlia (DP)",
  },
  {
    id: 104,
    assunto: "Emissão de certidão negativa",
    empresa: "Studio Bella Hair",
    solicitante: "Renata Dias",
    prioridade: "Baixa",
    status: "Concluída",
    responsavel: "Ana (Fiscal)",
  },
  {
    id: 105,
    assunto: "Alteração de quadro societário",
    empresa: "Auto Peças Veloz",
    solicitante: "Carlos Lima",
    prioridade: "Alta",
    status: "Em andamento",
    responsavel: "Pedro (Contábil)",
  },
  {
    id: 106,
    assunto: "DRE do 1º trimestre",
    empresa: "Padaria Pão Quente",
    solicitante: "Maria Souza",
    prioridade: "Média",
    status: "Aberta",
    responsavel: "Marcos (Contábil)",
  },
  {
    id: 107,
    assunto: "Parcelamento de débito municipal",
    empresa: "Studio Bella Hair",
    solicitante: "Renata Dias",
    prioridade: "Média",
    status: "Aberta",
    responsavel: "Júlia (DP)",
  },
];

function aguardar(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function extrairToken(headers = {}) {
  const authorization = headers.Authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw criarErro("Não autorizado.", 401);
  }

  return authorization.replace("Bearer ", "");
}

function buscarUsuarioPeloToken(token) {
  return usuarios.find((usuario) => usuario.token === token);
}

async function mockApi(url, options = {}) {
  await aguardar();

  const method = options.method ?? "GET";

  if (url === "/auth/login" && method === "POST") {
    const { email, senha } = JSON.parse(options.body ?? "{}");

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.email === email &&
        usuario.senha === senha
    );

    if (!usuarioEncontrado) {
      throw criarErro("E-mail ou senha inválidos.", 401);
    }

    const {
      senha: _,
      token,
      ...usuarioSemSenha
    } = usuarioEncontrado;

    return {
      token,
      usuario: usuarioSemSenha,
    };
  }

  if (url === "/solicitacoes" && method === "GET") {
    const token = extrairToken(options.headers);
    const usuario = buscarUsuarioPeloToken(token);

    if (!usuario) {
      throw criarErro("Não autorizado.", 401);
    }

    if (usuario.perfil === "EMPRESA") {
      return solicitacoes.filter(
        (solicitacao) =>
          solicitacao.empresa === usuario.empresa
      );
    }

    if (usuario.perfil === "CONTADOR") {
      return solicitacoes.filter((solicitacao) =>
        usuario.empresasAtendidas.includes(
          solicitacao.empresa
        )
      );
    }

    return [...solicitacoes];
  }

  const deleteMatch = url.match(/^\/solicitacoes\/(\d+)$/);

  if (deleteMatch && method === "DELETE") {
    const token = extrairToken(options.headers);
    const usuario = buscarUsuarioPeloToken(token);

    if (!usuario) {
      throw criarErro("Não autorizado.", 401);
    }

    if (usuario.perfil !== "ADMIN") {
      throw criarErro(
        "Você não possui permissão para excluir.",
        403
      );
    }

    const id = Number(deleteMatch[1]);

    solicitacoes = solicitacoes.filter(
      (solicitacao) => solicitacao.id !== id
    );

    return {
      sucesso: true,
    };
  }

  throw criarErro("Endpoint não encontrado.", 404);
}

export async function loginApi(email, senha) {
  return mockApi("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });
}

export async function buscarSolicitacoesApi(token) {
  return mockApi("/solicitacoes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function excluirSolicitacaoApi(id, token) {
  return mockApi(`/solicitacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}