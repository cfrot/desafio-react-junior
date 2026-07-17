import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import SolicitacaoCard from "../components/SolicitacaoCard";

import {
  buscarSolicitacoesApi,
  excluirSolicitacaoApi,
} from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [idExcluindo, setIdExcluindo] = useState(null);

  const token = localStorage.getItem("token");

  const usuarioSalvo = localStorage.getItem("usuario");

  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  function limparSessao() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  function logout() {
    limparSessao();
    navigate("/login");
  }

  function tratarErroNaoAutorizado(erroRecebido) {
    if (erroRecebido.status === 401) {
      limparSessao();
      navigate("/login");
      return true;
    }

    return false;
  }

  async function carregarSolicitacoes() {
    setCarregando(true);
    setErro("");

    try {
      const resposta =
        await buscarSolicitacoesApi(token);

      setSolicitacoes(resposta);
    } catch (erroRecebido) {
      if (tratarErroNaoAutorizado(erroRecebido)) {
        return;
      }

      setErro(erroRecebido.message);
    } finally {
      setCarregando(false);
    }
  }

  async function excluirSolicitacao(id) {
    const confirmou = window.confirm(
      "Deseja realmente excluir esta solicitação?"
    );

    if (!confirmou) {
      return;
    }

    setIdExcluindo(id);
    setErro("");

    try {
      await excluirSolicitacaoApi(id, token);

      setSolicitacoes((listaAtual) =>
        listaAtual.filter(
          (solicitacao) => solicitacao.id !== id
        )
      );
    } catch (erroRecebido) {
      if (tratarErroNaoAutorizado(erroRecebido)) {
        return;
      }

      setErro(erroRecebido.message);
    } finally {
      setIdExcluindo(null);
    }
  }

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  if (!usuario) {
    return null;
  }

  return (
    <main>
      <header>
        <div>
          <h1>Painel de Solicitações</h1>

          <p>
            Olá, <strong>{usuario.nome}</strong>
          </p>

          <p>
            Perfil: <strong>{usuario.perfil}</strong>
          </p>
        </div>

        <Button onClick={logout}>
          Sair
        </Button>
      </header>

      {usuario.perfil === "EMPRESA" && (
        <section>
          <p>Empresa: {usuario.empresa}</p>

          <Button
            onClick={() =>
              alert(
                "Funcionalidade de criação não foi exigida no desafio."
              )
            }
          >
            Nova solicitação
          </Button>
        </section>
      )}

      {usuario.perfil === "CONTADOR" && (
        <section>
          <p>
            Empresas atendidas:{" "}
            {usuario.empresasAtendidas.join(", ")}
          </p>
        </section>
      )}

      <section>
        <h2>Solicitações</h2>

        {carregando && <p>Carregando solicitações...</p>}

        {!carregando && erro && (
          <div>
            <p>{erro}</p>

            <Button onClick={carregarSolicitacoes}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!carregando &&
          !erro &&
          solicitacoes.length === 0 && (
            <p>Nenhuma solicitação encontrada.</p>
          )}

        {!carregando &&
          !erro &&
          solicitacoes.length > 0 && (
            <div>
              {solicitacoes.map((solicitacao) => (
                <SolicitacaoCard
                  key={solicitacao.id}
                  solicitacao={solicitacao}
                  podeExcluir={
                    usuario.perfil === "ADMIN"
                  }
                  excluindo={
                    idExcluindo === solicitacao.id
                  }
                  onExcluir={excluirSolicitacao}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

export default Dashboard;