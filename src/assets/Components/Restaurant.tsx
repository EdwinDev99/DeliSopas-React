import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Order } from "./Schemas/luchSchema";
import OrderForm from "./OrderForm";
import ResumenVentas from "./ResumenVentas";
import ResumenPedidoCard from "./CardOrderSummary";
import { db } from "./firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const lunchItems: Order[] = [
  { nombre: "Almuerzo", precio: 13000 },
  { nombre: "Ejecutivo Varios", precio: 15000 },
  { nombre: "Eje. Sopa Especial", precio: 13000 },
  { nombre: "Ejecutivo Churrasco", precio: 13000 },
  { nombre: "Sopa Pequena", precio: 13000 },
  { nombre: "Sopa Grande", precio: 13000 },
];

const breakfastItems: Order[] = [
  { nombre: "Combo 1", precio: 14000 },
  { nombre: "Combo 2", precio: 10000 },
  { nombre: "Combo 3", precio: 8500 },
  { nombre: "Combo 4", precio: 11500 },
  { nombre: "changua", precio: 6500 },
  { nombre: "caldo", precio: 7500 },
  { nombre: "Chocolate y Pan ", precio: 3500 },
  { nombre: "Arroz Con Huevo", precio: 4500 },
  { nombre: "Huevos Con Arroz", precio: 7000 },
  { nombre: "Huevos Al gusto", precio: 3500 },
  { nombre: "Tamal Especial", precio: 8000 },
  { nombre: "cafe", precio: 3000 },
  { nombre: "Chocolate", precio: 3000 },
  { nombre: "Perico", precio: 2000 },
  { nombre: "Jugo Hit", precio: 2000 },
  { nombre: "Jugo Hit Grander", precio: 3000 },
  { nombre: "Jugos naturales agua", precio: 4500 },
  { nombre: "Jugos naturales leche", precio: 5500 },
];

function Restaurant() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [resumenDelDia, setResumenDelDia] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
      const resumenSnapshot = await getDocs(collection(db, "resumenDelDia"));

      setPedidos(
        pedidosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setResumenDelDia(
        resumenSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      setCargando(false);
    };

    cargarDatos();
  }, []);

  const guardarPedidoEnFirestore = async (pedido: any) => {
    await addDoc(collection(db, "pedidos"), pedido);
  };

  const guardarResumenEnFirestore = async (pedido: any) => {
    await addDoc(collection(db, "resumenDelDia"), pedido);
  };

  const eliminarColeccion = async (nombre: string) => {
    const snapshot = await getDocs(collection(db, nombre));
    const deletes = snapshot.docs.map((d) => deleteDoc(doc(db, nombre, d.id)));
    await Promise.all(deletes);
  };

  const handleNuevoPedido = async (data: any) => {
    await guardarPedidoEnFirestore(data);
    setPedidos((prev) => [...prev, data]);
  };

  const handlePagoCompleto = async (pedidoActualizado: any) => {
    const nuevosPedidos = pedidos.map((pedido) =>
      pedido.mesa === pedidoActualizado.mesa ? pedidoActualizado : pedido
    );
    setPedidos(nuevosPedidos);
    setResumenDelDia((prev) => [...prev, pedidoActualizado]);

    await guardarResumenEnFirestore(pedidoActualizado);
  };

  const calcularTotal = (productos: Order[]) => {
    return productos.reduce(
      (total, producto) => total + producto.precio * (producto.cantidad || 1),
      0
    );
  };

  const handleCerrarCaja = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres cerrar la caja? Se borrarán todos los datos."
    );
    if (confirmacion) {
      setPedidos([]);
      setResumenDelDia([]);
      await eliminarColeccion("pedidos");
      await eliminarColeccion("resumenDelDia");
    }
  };

  if (cargando) {
    return (
      <div className="container mt-4">
        <h2>Cargando datos...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="container mt-4">
        <h1 className="mb-4">Restaurante</h1>

        <div className="d-flex flex-wrap gap-3 mb-5">
          <Link to="/almuerzos" className="btn btn-primary">
            Almuerzos
          </Link>
          <Link to="/desayunos" className="btn btn-success">
            Desayunos
          </Link>
          <Link to="/pedidos" className="btn btn-warning">
            Pedidos Recibidos
          </Link>
          <Link to="/resumen" className="btn btn-info">
            Resumen del Día
          </Link>
          <button onClick={handleCerrarCaja} className="btn btn-danger">
            Cerrar Caja
          </button>
        </div>

        <Routes>
          <Route
            path="/almuerzos"
            element={
              <OrderForm
                title="Almuerzos"
                items={lunchItems}
                onSubmit={handleNuevoPedido}
              />
            }
          />
          <Route
            path="/desayunos"
            element={
              <OrderForm
                title="Desayunos"
                items={breakfastItems}
                onSubmit={handleNuevoPedido}
              />
            }
          />
          <Route
            path="/pedidos"
            element={
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {pedidos.map((pedido, index) => (
                  <div className="col" key={index}>
                    <ResumenPedidoCard
                      pedido={pedido}
                      onPagoCompleto={handlePagoCompleto}
                    />
                  </div>
                ))}
              </div>
            }
          />
          <Route
            path="/resumen"
            element={
              <>
                <ul className="list-group mb-4">
                  <li className="list-group-item">
                    Total de pedidos: {resumenDelDia.length}
                  </li>
                  <li className="list-group-item">
                    Total en efectivo: $
                    {resumenDelDia
                      .filter((p) => p.metodoPago === "efectivo")
                      .reduce((acc, p) => acc + calcularTotal(p.productos), 0)
                      .toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    Total en Nequi: $
                    {resumenDelDia
                      .filter((p) => p.metodoPago === "nequi")
                      .reduce((acc, p) => acc + calcularTotal(p.productos), 0)
                      .toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    Total en Daviplata: $
                    {resumenDelDia
                      .filter((p) => p.metodoPago === "daviplata")
                      .reduce((acc, p) => acc + calcularTotal(p.productos), 0)
                      .toLocaleString()}
                  </li>
                </ul>
                <ResumenVentas resumenDelDia={resumenDelDia} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default Restaurant;
