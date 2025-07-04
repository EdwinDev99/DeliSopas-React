import { useState } from "react";
import { Order } from "./Schemas/luchSchema";

type Pedido = {
  id?: string;
  mesa: string;
  detalles: string;
  productos: Order[];
  pagosDivididos?: Record<string, number>;
  metodoPago?: string;
  pagado?: boolean;
  fechaPago?: string; // 👈 nuevo campo opcional
  estado?: string;
};

type Props = {
  resumenDelDia: Pedido[];
};

function ResumenPedidoSimple({ pedido }: { pedido: Pedido }) {
  const totalPagado = pedido.pagosDivididos
    ? Object.values(pedido.pagosDivididos).reduce((a, b) => a + b, 0)
    : 0;

  const fechaFormateada =
    pedido.fechaPago &&
    new Intl.DateTimeFormat("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(pedido.fechaPago));

  return (
    <div className="card border-primary h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">
          🪑 <strong>Mesa:</strong> {pedido.mesa}
        </h6>
        {pedido.detalles && (
          <p className="card-text text-muted small mb-2">
            📝 <strong>Detalles:</strong> {pedido.detalles}
          </p>
        )}

        <p className="card-text mb-1 fw-semibold">📦 Productos:</p>
        <ul
          className="list-group list-group-flush flex-grow-1 mb-3"
          style={{ maxHeight: "140px", overflowY: "auto" }}
        >
          {pedido.productos.map((producto, i) => (
            <li key={i} className="list-group-item py-1 px-2">
              🍽️ {producto.nombre} × {producto.cantidad || 1}
            </li>
          ))}
        </ul>

        {/* <p className="card-text mb-0">
          💳 <strong>Método Pago:</strong>{" "}
          {pedido.metodoPago || "No especificado"}
        </p> */}
        <p className="card-text text-muted small mt-1 mb-2">
          📅 <strong>Fecha de Pago:</strong>{" "}
          {fechaFormateada || "No registrada"}
        </p>
        <p className="card-text fw-bold fs-5 text-success mt-auto">
          💰 Total Pagado: ${totalPagado.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ResumenVentas({ resumenDelDia }: Props) {
  const [showModal, setShowModal] = useState(false);

  const agruparProductos = (pedidos: Pedido[]) => {
    const productosVendidos: { [key: string]: number } = {};

    pedidos.forEach((pedido) => {
      (pedido.productos ?? []).forEach((producto) => {
        if (producto.nombre) {
          productosVendidos[producto.nombre] =
            (productosVendidos[producto.nombre] || 0) +
            (producto.cantidad || 1);
        }
      });
    });

    return productosVendidos;
  };

  const calcularTotalVentas = () => {
    return resumenDelDia.reduce((total, pedido) => {
      return (
        total +
        (pedido.productos ?? []).reduce(
          (subtotal, producto) =>
            subtotal + producto.precio * (producto.cantidad || 1),
          0
        )
      );
    }, 0);
  };

  const calcularTotalesPorMetodo = () => {
    const totales: Record<string, number> = {
      efectivo: 0,
      nequi: 0,
      daviplata: 0,
      codigoQR: 0,
    };

    resumenDelDia.forEach((pedido) => {
      if (pedido.pagosDivididos) {
        for (const metodo in pedido.pagosDivididos) {
          totales[metodo] += pedido.pagosDivididos[metodo] || 0;
        }
      }
    });

    return totales;
  };

  const totalesPorMetodo = calcularTotalesPorMetodo();

  // ✅ Ordenar pedidos pagados por fechaPago descendente
  const pedidosPagados = resumenDelDia
    .filter((pedido) => pedido.pagado)
    .sort((a, b) => {
      const fechaA = new Date(a.fechaPago || "").getTime();
      const fechaB = new Date(b.fechaPago || "").getTime();
      return fechaB - fechaA; // Más recientes primero
    });

  return (
    <div className="mt-5">
      <h4 className="mb-3">🧾 Resumen de Ventas del Día</h4>

      <h6 className="mt-4">💳 Totales por Método de Pago:</h6>
      <ul className="list-group mb-4">
        <li className="list-group-item">
          💵 Efectivo: ${totalesPorMetodo.efectivo.toLocaleString()}
        </li>
        <li className="list-group-item">
          📱 Nequi: ${totalesPorMetodo.nequi.toLocaleString()}
        </li>
        <li className="list-group-item">
          🏦 Daviplata: ${totalesPorMetodo.daviplata.toLocaleString()}
        </li>
        <li className="list-group-item">
          🔳 Código QR: ${totalesPorMetodo.codigoQR.toLocaleString()}
        </li>
      </ul>

      <h5>📦 Productos Vendidos</h5>
      <ul className="list-group mb-4">
        {Object.entries(agruparProductos(resumenDelDia)).map(
          ([nombre, cantidad]) => (
            <li key={nombre} className="list-group-item">
              🍽️ {nombre}: {cantidad} vendidos
            </li>
          )
        )}
      </ul>

      <h3 className="mt-4 mb-4 text-success fw-bold">
        💰 Total de Ventas: ${calcularTotalVentas().toLocaleString()}
      </h3>

      <hr className="my-4" />

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        📝 Mostrar Pedidos Pagados ({pedidosPagados.length})
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">📋 Pedidos Pagados</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Cerrar"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    {pedidosPagados.length === 0 && (
                      <p>No hay pedidos pagados.</p>
                    )}
                    {pedidosPagados.map((pedido, index) => (
                      <div key={pedido.id || index} className="col-md-4 mb-3">
                        <ResumenPedidoSimple pedido={pedido} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumenVentas;
