import { Order } from "./Schemas/luchSchema";

type Pedido = {
  mesa: string;
  detalles: string;
  productos: Order[];
};

type Props = {
  pedido: Pedido;
};

function ResumenPedidoCard({ pedido }: Props) {
  // Agrupar por nombre del producto
  const productosAgrupados = pedido.productos.reduce((acc, producto) => {
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

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h5 className="mb-3">🪑 Mesa {pedido.mesa}</h5>

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
    </div>
  );
}

export default ResumenPedidoCard;
