import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function OrderButton({ children }: Props) {
  return (
    <button type="button" className="btn btn-success">
      {children}
    </button>
  );
}

export default OrderButton;
