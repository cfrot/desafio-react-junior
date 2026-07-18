import Button from "./Button";

function SolicitacaoCard({
  solicitacao,
  podeExcluir,
  excluindo,
  onExcluir,
}) {
  const statusClass = solicitacao.status
    .toLowerCase()
    .replace(" ", "-")
    .replace("í", "i")
    .replace("ã", "a");

  const prioridadeClass = solicitacao.prioridade
    .toLowerCase()
    .replace("é", "e");

  return (
    <article className="request-card">
      <div className="request-icon">▤</div>

      <div className="request-main">
        <h3>{solicitacao.assunto}</h3>

        <p className="request-company">
          {solicitacao.empresa}
        </p>

        <p className="request-applicant">
          Solicitante: {solicitacao.solicitante}
        </p>
      </div>

      <div className="request-info">
        <span className="info-label">Status</span>

        <span className={`badge status-${statusClass}`}>
          {solicitacao.status}
        </span>
      </div>

      <div className="request-info">
        <span className="info-label">Prioridade</span>

        <span
          className={`badge priority-${prioridadeClass}`}
        >
          ● {solicitacao.prioridade}
        </span>
      </div>

      <div className="request-info responsible-info">
        <span className="info-label">Responsável</span>

        <div className="responsible">
          <span className="avatar-small">
            {solicitacao.responsavel.charAt(0)}
          </span>

          <span>{solicitacao.responsavel}</span>
        </div>
      </div>

      {podeExcluir && (
        <Button
          className="delete-button"
          onClick={() => onExcluir(solicitacao.id)}
          disabled={excluindo}
        >
          {excluindo ? "..." : "Excluir"}
        </Button>
      )}
    </article>
  );
}

export default SolicitacaoCard;