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

function simularLatencia() {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function buscarUsuarioPeloToken(token) {
  return usuarios.find((usuario) => usuario.token === token);
}

export async function loginApi(email, senha) {
  await simularLatencia();

  const usuarioEncontrado = usuarios.find(
    (usuario) =>
      usuario.email === email &&
      usuario.senha === senha
  );

  if (!usuarioEncontrado) {
    throw criarErro("E-mail ou senha inválidos.", 401);
  }

  const { senha: _, token, ...usuarioSemSenha } =
    usuarioEncontrado;

  return {
    token,
    usuario: usuarioSemSenha,
  };
}

export async function buscarSolicitacoesApi(token) {
  await simularLatencia();

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

export async function excluirSolicitacaoApi(id, token) {
  await simularLatencia();

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

  solicitacoes = solicitacoes.filter(
    (solicitacao) => solicitacao.id !== id
  );

  return {
    sucesso: true,
  };
}