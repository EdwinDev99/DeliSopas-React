import { useEffect, useState } from "react";
import { Order } from "./Schemas/luchSchema";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebase";
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

  // Estado para el modal
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

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>🪑 Mesa {pedido.mesa}</h5>
        <span
          className={`badge bg-${estadoColor(pedido.estado || "pendiente")}`}
        >
          {(pedido.estado || "pendiente").toUpperCase()}
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
          value={pedido.estado || "pendiente"}
          onChange={async (e) => {
            const nuevoEstado = e.target.value;
            await actualizarEstadoPedido(pedido.id, nuevoEstado);
          }}
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
              placeholder="$0"
              min="0"
              value={pagosDivididos[metodo.valor] ?? ""}
              onChange={(e) => handlePagoChange(metodo.valor, e.target.value)}
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

      <div className="d-flex gap-2 flex-wrap">
        <button
          className="btn btn-success"
          disabled={pendiente !== 0}
          onClick={() => {
            onPagoCompleto({
              ...pedido,
              pagosDivididos,
              metodoPago: "dividido",
              pagado: true,
            });
          }}
        >
          ✔️ Hecho (pagado)
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onCancelarPedido({ ...pedido })}
        >
          ❌ Cancelar pedido
        </button>

        <button className="btn btn-outline-primary" onClick={handleShowModal}>
          ➕ Agregar producto
        </button>
      </div>

      {/* Modal para agregar producto */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreProducto">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPrecioProducto" className="mt-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio"
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
