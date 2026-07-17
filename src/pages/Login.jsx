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

  // Se já existir um token salvo, redireciona para o dashboard
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

      // Salva os dados do usuário autenticado
      localStorage.setItem("token", resposta.token);

      localStorage.setItem(
        "usuario",
        JSON.stringify(resposta.usuario)
      );

      // Redireciona para o dashboard
      navigate("/dashboard");
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <section>
        <h1>Painel de Solicitações</h1>
        <p>Entre com sua conta para acessar o sistema.</p>

        <form onSubmit={realizarLogin}>
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

          {erro && <p>{erro}</p>}

          <Button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default Login;