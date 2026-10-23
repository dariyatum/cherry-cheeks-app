import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cherry focus-visible:ring-offset-2";

const variants = {
  primary: "bg-cherry text-white hover:opacity-90",
  secondary:
    "border border-cherry bg-white text-cherry hover:bg-cherry/10",
};

const disabledStyle =
  "cursor-not-allowed bg-gray-200 text-gray-400 border border-transparent";

function Button({
  children,
  variant = "primary",
  to,
  disabled = false,
  arrow = true,
  className = "",
  ...props
}) {
  const style = `${base} ${disabled ? disabledStyle : variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={18} aria-hidden="true" />}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={style} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={style} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

export default Button;