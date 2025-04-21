import { ReactNode } from "react";
import { Order } from "./Schemas/luchSchema";

type Props = {
  children: ReactNode;
  order: Order;
  onClick?: (order: Order) => void;
};

function OrderButton({ children, order, onClick }: Props) {
  return (
    <button
      type="button"
      className="btn btn-success w-50"
      style={{ height: "100px", whiteSpace: "normal" }}
      onClick={() => onClick?.(order)}
    >
      {children}
    </button>
  );
}

export default OrderButton;
