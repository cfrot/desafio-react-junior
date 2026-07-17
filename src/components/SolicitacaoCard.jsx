import Button from "./Button";

function SolicitacaoCard({
  solicitacao,
  podeExcluir,
  excluindo,
  onExcluir,
}) {
  return (
    <article>
      <h2>{solicitacao.assunto}</h2>

      <p>
        <strong>Empresa:</strong>{" "}
        {solicitacao.empresa}
      </p>

      <p>
        <strong>Solicitante:</strong>{" "}
        {solicitacao.solicitante}
      </p>

      <p>
        <strong>Prioridade:</strong>{" "}
        {solicitacao.prioridade}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {solicitacao.status}
      </p>

      <p>
        <strong>Responsável:</strong>{" "}
        {solicitacao.responsavel}
      </p>

      {podeExcluir && (
        <Button
          onClick={() => onExcluir(solicitacao.id)}
          disabled={excluindo}
        >
          {excluindo ? "Excluindo..." : "Excluir"}
        </Button>
      )}
    </article>
  );
}

export default SolicitacaoCard;