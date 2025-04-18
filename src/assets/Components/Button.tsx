import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Button({ children }: Props) {
  return (
    <button className="btn btn-success btn-lg" type="submit">
      {children}
    </button>
  );
}

export default Button;
