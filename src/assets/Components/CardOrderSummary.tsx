import { useEffect, useState } from "react";
import { Order } from "./Schemas/luchSchema";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Modal, Button, Form } from "react-bootstrap";

type Pedido = {
  id: string;
  mesa: string;
  detalles: string;
  productos?: Order[];
  metodoPago?: string;
  pagosDivididos?: Record<string, number>;
  pagado?: boolean;
  estado?: string;
  fechaPago?: string; // ✅ Campo agregado
  timestamp?: any;
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

  const calcularTotal = () =>
    Object.values(productosAgrupados).reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

  const totalPedido = calcularTotal();
  const [pagosDivididos, setPagosDivididos] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    setPagosDivididos({});
  }, [pedido.id]);

  const actualizarEstadoPedido = async (id: string, nuevoEstado: string) => {
    try {
      const pedidoRef = doc(db, "pedidos", id);
      await updateDoc(pedidoRef, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const actualizarProductos = async (nuevosProductos: Order[]) => {
    try {
      const pedidoRef = doc(db, "pedidos", pedido.id);
      await updateDoc(pedidoRef, { productos: nuevosProductos });
    } catch (error) {
      console.error("Error al actualizar productos:", error);
    }
  };

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNuevoNombre("");
    setNuevoPrecio("");
  };

  const handleAgregarProducto = async () => {
    if (!nuevoNombre || !nuevoPrecio) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const precio = parseFloat(nuevoPrecio);
    if (isNaN(precio)) {
      alert("Precio inválido");
      return;
    }

    const nuevoProducto: Order = {
      nombre: nuevoNombre,
      precio,
      cantidad: 1,
    };

    const nuevosProductos = [...productos, nuevoProducto];
    await actualizarProductos(nuevosProductos);
    handleCloseModal();
  };

  const metodos = [
    { valor: "efectivo", label: "💵" },
    { valor: "nequi", label: "📱 Nequi" },
    { valor: "daviplata", label: "🏦 Davi" },
    { valor: "codigoQR", label: "🔳 QR" },
  ];

  const handlePagoChange = (metodo: string, valor: string) => {
    const cantidad = parseInt(valor) || 0;
    const totalActualSinMetodo = Object.entries(pagosDivididos)
      .filter(([clave]) => clave !== metodo)
      .reduce((acc, [, val]) => acc + val, 0);

    const restante = totalPedido - totalActualSinMetodo;
    const nuevoValor = Math.min(cantidad, restante);

    setPagosDivididos((prev) => ({
      ...prev,
      [metodo]: nuevoValor,
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

  const imprimirParaCocina = () => {
    const printWindow = window.open("", "PRINT", "height=400,width=300");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Pedido Cocina - Mesa ${pedido.mesa}</title>
          <style>
            body { font-family: monospace; padding: 10px; }
            h3 { text-align: center; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 6px; font-size: 16px; }
            hr { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h3>Mesa ${pedido.mesa}</h3>
          <p>Detalles: ${pedido.detalles || "Ninguno"}</p>
          <hr />
          <ul>
            ${Object.values(productosAgrupados)
              .map((item) => `<li>${item.nombre} x${item.cantidad}</li>`)
              .join("")}
          </ul>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handlePagoCompletoClick = async () => {
    const pedidoActualizado: Pedido = {
      ...pedido,
      pagosDivididos,
      metodoPago: "dividido",
      pagado: true,
      fechaPago: new Date().toISOString(), // ✅ ya no da error
    };

    try {
      const pedidoRef = doc(db, "pedidos", pedido.id);
      await updateDoc(pedidoRef, pedidoActualizado);
      onPagoCompleto(pedidoActualizado);
    } catch (error) {
      console.error("Error al guardar el pago completo:", error);
    }
  };
  const fechaCreacion = pedido.timestamp
    ? new Date(pedido.timestamp.seconds * 1000).toLocaleString()
    : "Sin fecha";

  return (
    <div className="card p-2 mb-2 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="mb-0 fs-6">🪑 Mesa {pedido.mesa}</h6>
        <span
          className={`badge bg-${estadoColor(pedido.estado || "pendiente")}`}
        >
          {(pedido.estado || "pendiente").toUpperCase()}
        </span>
      </div>

      <ul className="list-group list-group-flush mb-2 small">
        {Object.values(productosAgrupados).map((item, index) => (
          <li
            key={index}
            className="list-group-item py-1 px-2 d-flex justify-content-between align-items-center"
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
        <p className="text-muted small mb-1">
          <strong>📝 Detalles:</strong> {pedido.detalles}
        </p>
      )}
      <div className="text-end text-muted small mt-1">
        Creado: {fechaCreacion}
      </div>

      {/* <h6 className="fw-bold text-end small">
        Total: ${totalPedido.toLocaleString()}
      </h6> */}

      <div className="mt-2 mb-2">
        <label className="me-2 small">Estado:</label>
        <select
          value={pedido.estado || "pendiente"}
          onChange={async (e) => {
            const nuevoEstado = e.target.value;
            await actualizarEstadoPedido(pedido.id, nuevoEstado);
          }}
          className="form-select form-select-sm"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en cocina">En cocina</option>
          <option value="servido">Servido</option>
        </select>
      </div>

      <div className="mb-2 small">
        <label>Métodos de pago:</label>
        {metodos.map((metodo) => (
          <div key={metodo.valor} className="input-group input-group-sm mb-1">
            <span className="input-group-text w-25">{metodo.label}</span>
            <input
              type="number"
              className="form-control"
              placeholder="$0"
              min="0"
              value={pagosDivididos[metodo.valor] ?? ""}
              onChange={(e) => handlePagoChange(metodo.valor, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mb-2 text-end small">
        <strong>Total pagado: ${sumaTotalPagada.toLocaleString()}</strong>
        <br />
        <span className={pendiente > 0 ? "text-danger" : "text-success"}>
          {pendiente > 0
            ? `Faltan $${pendiente.toLocaleString()}`
            : "✅ Pago completo"}
        </span>
      </div>

      <div className="d-flex gap-1 flex-wrap">
        <button
          className="btn btn-sm btn-success"
          disabled={pendiente !== 0}
          onClick={handlePagoCompletoClick}
        >
          ✔️ Hecho
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => onCancelarPedido({ ...pedido })}
        >
          ❌ Cancelar
        </button>

        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleShowModal}
        >
          ➕ Producto
        </button>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={imprimirParaCocina}
        >
          🖨️ Imprimir
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarProducto}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ResumenPedidoCard;
