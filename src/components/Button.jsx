function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`button ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;