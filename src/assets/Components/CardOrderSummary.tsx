import { useState } from "react";
import { Order } from "./Schemas/luchSchema";

type Pedido = {
  id: string;
  mesa: string;
  detalles: string;
  productos?: Order[];
  metodoPago?: string;
  pagosDivididos?: Record<string, number>;
  pagado?: boolean;
  estado?: string;
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

  const totalPedido = calcularTotal();

  const [estado, setEstado] = useState<string>(pedido.estado || "pendiente");

  const [pagosDivididos, setPagosDivididos] = useState<Record<string, number>>({
    efectivo: 0,
    nequi: 0,
    daviplata: 0,
    codigoQR: 0,
    ...(pedido.pagosDivididos || {}),
  });

  const metodos = [
    { valor: "efectivo", label: "💵" },
    { valor: "nequi", label: "📱 Nequi" },
    { valor: "daviplata", label: "🏦 Davi" },
    { valor: "codigoQR", label: "🔳 QR" },
  ];

  const handlePagoChange = (metodo: string, valor: string) => {
    const cantidad = parseInt(valor) || 0;
    setPagosDivididos((prev) => ({
      ...prev,
      [metodo]: cantidad,
    }));
  };

  const sumaTotalPagada = Object.values(pagosDivididos).reduce(
    (acc, val) => acc + val,
    0
  );

  const pendiente = totalPedido - sumaTotalPagada;

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
        <span className={`badge bg-${estadoColor(estado)}`}>
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
        Total del pedido: ${totalPedido.toLocaleString()}
      </h6>

      <div className="mt-3">
        <label className="me-2">Estado del pedido:</label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="form-select mb-3"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en cocina">En cocina</option>
          <option value="servido">Servido</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Métodos de pago (puedes dividir):</label>
        {metodos.map((metodo) => (
          <div key={metodo.valor} className="input-group mb-2">
            <span className="input-group-text w-25">{metodo.label}</span>
            <input
              type="number"
              className="form-control"
              min="0"
              value={pagosDivididos[metodo.valor] ?? ""}
              onChange={(e) => handlePagoChange(metodo.valor, e.target.value)}
              placeholder="$0"
            />
          </div>
        ))}
      </div>

      <div className="mb-3 text-end">
        <strong>Total ingresado: ${sumaTotalPagada.toLocaleString()}</strong>
        <br />
        <span className={pendiente > 0 ? "text-danger" : "text-success"}>
          {pendiente > 0
            ? `Faltan $${pendiente.toLocaleString()}`
            : "✅ Pago completo"}
        </span>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-success"
          disabled={pendiente !== 0}
          onClick={() => {
            onPagoCompleto({
              ...pedido,
              pagosDivididos,
              metodoPago: "dividido",
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
