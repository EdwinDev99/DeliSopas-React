import { useState } from "react";
import { Order } from "./Schemas/luchSchema";

type Pedido = {
  id: string;
  mesa: string;
  detalles: string;
  productos?: Order[];
  metodoPago?: string;
  pagado?: boolean;
  estado?: string; // ← Agregado para mostrar estado tipo "en cocina", "servido"
};

type Props = {
  pedido: Pedido;
  onPagoCompleto: (pedidoActualizado: Pedido) => void;
  onCancelarPedido: (pedido: Pedido) => void;
};

function ResumenPedidoCard({
  pedido,
  onPagoCompleto,
  onCancelarPedido,
}: Props) {
  const productos = pedido.productos ?? [];

  const productosAgrupados = productos.reduce((acc, producto) => {
    const nombre = producto.nombre;
    const cantidad = producto.cantidad || 1;

    if (!acc[nombre]) {
      acc[nombre] = {
        nombre,
        precio: producto.precio,
        cantidad,
      };
    } else {
      acc[nombre].cantidad += cantidad;
    }
    return acc;
  }, {} as Record<string, { nombre: string; precio: number; cantidad: number }>);

  const calcularTotal = () => {
    return Object.values(productosAgrupados).reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  const [metodoPago, setMetodoPago] = useState<string>(
    pedido.metodoPago || "efectivo"
  );

  const [estado, setEstado] = useState<string>(pedido.estado || "pendiente");

  const estadoColor = (estado: string) => {
    switch (estado) {
      case "en cocina":
        return "warning";
      case "servido":
        return "info";
      case "pendiente":
        return "secondary";
      default:
        return "dark";
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>🪑 Mesa {pedido.mesa}</h5>
        <span className={`badge bg-${estadoColor(estado)}`.trim()}>
          {(estado ?? "pendiente").toUpperCase()}
        </span>
      </div>

      <ul className="list-group list-group-flush mb-3">
        {Object.values(productosAgrupados).map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              {item.nombre}{" "}
              <span className="badge bg-primary rounded-pill">
                x{item.cantidad}
              </span>
            </div>
            <div>${item.precio * item.cantidad}</div>
          </li>
        ))}
      </ul>

      {pedido.detalles && (
        <p className="text-muted mb-2">
          <strong>📝 Detalles:</strong> {pedido.detalles}
        </p>
      )}

      <h6 className="fw-bold text-end">
        Total del pedido: ${calcularTotal().toLocaleString()}
      </h6>

      <div className="mt-3">
        <label className="me-2">Estado del pedido:</label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="form-select mb-2"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en cocina">En cocina</option>
          <option value="servido">Servido</option>
        </select>
      </div>

      <div className="mt-2">
        <label className="me-2">Método de Pago:</label>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="form-select"
        >
          <option value="efectivo">Efectivo</option>
          <option value="nequi">Nequi</option>
          <option value="daviplata">Daviplata</option>
          <option value="codigoQR">Código QR</option>
        </select>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button
          className="btn btn-success"
          onClick={() => {
            if (!pedido.productos || pedido.productos.length === 0) {
              console.error(
                "Pedido sin productos, no se puede completar el pago"
              );
              return;
            }

            onPagoCompleto({
              ...pedido,
              metodoPago,
              pagado: true,
              estado,
            });
          }}
        >
          ✔️ Hecho (pagado)
        </button>

        <button
          className="btn btn-danger"
          onClick={() =>
            onCancelarPedido({
              ...pedido,
              estado,
            })
          }
        >
          ❌ Cancelar pedido
        </button>
      </div>
    </div>
  );
}

export default ResumenPedidoCard;
