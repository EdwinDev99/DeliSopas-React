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
      className="btn btn-success w-100 w-md-50" // Ancho 100% en móviles y 50% en pantallas medianas y grandes
      style={{ height: "100px", whiteSpace: "normal", padding: "10px" }}
      onClick={() => onClick?.(order)}
    >
      {children}
    </button>
  );
}

export default OrderButton;
