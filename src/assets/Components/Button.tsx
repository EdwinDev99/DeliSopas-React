import { ReactNode } from "react";

type buttonType = "button" | "submit";

type Props = {
  children: ReactNode;
  type?: buttonType;
};

function Button({ children, type = "button" }: Props) {
  return (
    <button className="btn btn-success btn-lg" type={type}>
      {children}
    </button>
  );
}

export default Button;
