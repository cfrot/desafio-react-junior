import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import { loginApi } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function realizarLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await loginApi(email, senha);

      localStorage.setItem("token", resposta.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.usuario)
      );

      navigate("/dashboard");
    } catch (erroRecebido) {
      setErro(erroRecebido.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand">
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

        <div className="login-heading">
          <h2>Bem-vindo de volta!</h2>
          <p>
            Entre com seus dados para acessar
            <br />
            o painel de solicitações.
          </p>
        </div>

        <form className="login-form" onSubmit={realizarLogin}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Digite seu e-mail"
          />

          <Input
            label="Senha"
            name="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Digite sua senha"
          />

          {erro && <p className="error-message">{erro}</p>}

          <Button
            type="submit"
            disabled={carregando}
            className="login-button"
          >
            {carregando ? "Entrando..." : "→ Entrar na plataforma"}
          </Button>
        </form>

        <footer className="login-footer">
          <span>▣</span>
          Seus dados estão protegidos
        </footer>
      </section>
    </main>
  );
}

export default Login;