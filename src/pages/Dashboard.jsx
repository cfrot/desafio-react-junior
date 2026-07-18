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

  const iniciais = usuario.nome
    .split(" ")
    .slice(0, 2)
    .map((nome) => nome.charAt(0))
    .join("");

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">
        <header className="dashboard-header">
          <div className="brand dashboard-brand">
            <div className="brand-icon">
              <span />
              <span />
              <span />
            </div>

            <div>
              <h1>
                Solicita<span>+</span>
              </h1>
              <p>Painel de Solicitações</p>
            </div>
          </div>

          <div className="user-summary">
            <div className="user-avatar">{iniciais}</div>

            <div>
              <strong>{usuario.nome}</strong>
              <span>{usuario.perfil}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <h2>
              Olá, <span>{usuario.nome}!</span>
            </h2>

            <p>
              Confira abaixo as solicitações disponíveis
              para o seu perfil.
            </p>

            {usuario.perfil === "CONTADOR" && (
              <p className="companies">
                Empresas atendidas:{" "}
                {usuario.empresasAtendidas.join(", ")}
              </p>
            )}
          </div>

          {usuario.perfil === "EMPRESA" && (
            <Button
              className="new-request-button"
              onClick={() =>
                alert(
                  "Funcionalidade de criação não exigida no desafio."
                )
              }
            >
              ＋ Nova solicitação
            </Button>
          )}
        </section>

        <section className="requests-section">
          <div className="section-title">
            <div className="section-icon">▤</div>
            <h2>Solicitações</h2>
          </div>

          {carregando && (
            <div className="state-message">
              Carregando solicitações...
            </div>
          )}

          {!carregando && erro && (
            <div className="state-message error-state">
              <p>{erro}</p>

              <Button onClick={carregarSolicitacoes}>
                Tentar novamente
              </Button>
            </div>
          )}

          {!carregando &&
            !erro &&
            solicitacoes.length === 0 && (
              <div className="state-message">
                Nenhuma solicitação encontrada.
              </div>
            )}

          {!carregando &&
            !erro &&
            solicitacoes.length > 0 && (
              <div className="requests-list">
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

        <footer className="dashboard-footer">
          <Button
            className="logout-button"
            onClick={logout}
          >
            ↪ Sair da plataforma
          </Button>
        </footer>
      </section>
    </main>
  );
}

export default Dashboard;