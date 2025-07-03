import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Order } from "./Schemas/luchSchema";
import OrderForm from "./OrderForm";
import ResumenVentas from "./ResumenVentas";
import ResumenPedidoCard from "./CardOrderSummary";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import DeliLogo from "../../img/DeliLogo.png";

const lunchItems: Order[] = [
  { nombre: "Almuerzo", precio: 13000 },
  { nombre: "Proteina", precio: 4500 },
  { nombre: "Bandeja", precio: 12000 },
  { nombre: "Porcion de papa ", precio: 4000 },
  { nombre: "Ejecutivo Varios", precio: 19000 },
  { nombre: "Eje. Sopa Especial", precio: 20000 },
  { nombre: "Ejecutivo Churrasco", precio: 22000 },
  { nombre: "Ejecutivo Sobre Barriga", precio: 19000 },
  { nombre: "Ejecutivo  Mojarra", precio: 19000 },
  { nombre: "Sopa del Dia", precio: 5000 },
  { nombre: "Sopa Pequena", precio: 7000 },
  { nombre: "Sopa Grande", precio: 10000 },
  { nombre: "Platano Queso y Bocadillo ", precio: 5000 },
  { nombre: "Chicharron Con Arepa", precio: 3000 },
  { nombre: "Arepa", precio: 3000 },
  { nombre: "Huevo adicional ", precio: 1000 },
  { nombre: "Para Llevar", precio: 1000 },
];

const breakfastItems: Order[] = [
  { nombre: "Combo 1", precio: 14000 },
  { nombre: "Combo 2", precio: 11000 },
  { nombre: "Combo 3", precio: 9000 },
  { nombre: "Combo 4", precio: 12000 },
  { nombre: "changua", precio: 8500 },
  { nombre: "caldo", precio: 7500 },
  { nombre: "Chocolate y Pan ", precio: 3800 },
  { nombre: "Arroz Con Huevo", precio: 4500 },
  { nombre: "Huevos Rancheros", precio: 5500 },
  { nombre: "Huevos Al gusto", precio: 3500 },
  { nombre: "Tamal Especial", precio: 8000 },
  { nombre: "Para Llevar", precio: 1000 },
];

const drinks: Order[] = [
  { nombre: "cafe", precio: 3000 },
  { nombre: "Chocolate", precio: 3000 },
  { nombre: "Perico", precio: 2000 },
  { nombre: "Gaseosa Grande", precio: 3500 },
  { nombre: "Gaseosa Pequena", precio: 2500 },
  { nombre: "Agua Grande ", precio: 2500 },
  { nombre: "Agua pequena ", precio: 1500 },
  { nombre: "Jugo Hit", precio: 2500 },
  { nombre: "Jugo Hit Grande", precio: 3000 },
  { nombre: "Jugos naturales agua", precio: 4500 },
  { nombre: "Jugos naturales leche", precio: 5500 },
  { nombre: "Para Llevar", precio: 1000 },
];

function Restaurant() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [resumenDelDia, setResumenDelDia] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const pedidosQuery = query(
      collection(db, "pedidos"),
      orderBy("timestamp", "desc")
    );

    const unsubscribePedidos = onSnapshot(pedidosQuery, (snapshot) => {
      setPedidos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCargando(false);
    });

    const unsubscribeResumen = onSnapshot(
      collection(db, "resumenDelDia"),
      (snapshot) => {
        setResumenDelDia(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    return () => {
      unsubscribePedidos();
      unsubscribeResumen();
    };
  }, []);

  const guardarPedidoEnFirestore = async (pedido: any) => {
    await addDoc(collection(db, "pedidos"), {
      ...pedido,
      timestamp: new Date(),
    });
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
  };

  const handlePagoCompleto = async (pedidoActualizado: any) => {
    try {
      await guardarResumenEnFirestore(pedidoActualizado);
      await deleteDoc(doc(db, "pedidos", pedidoActualizado.id));
    } catch (error) {
      console.error("Error al marcar como pagado:", error);
    }
  };

  const handleCancelarPedido = async (pedidoCancelado: any) => {
    try {
      await deleteDoc(doc(db, "pedidos", pedidoCancelado.id));
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
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
        <h1 className="mb-4 text-center text-success fw-bold display-4">
          <img
            src={DeliLogo}
            alt="Delisopas Logo"
            style={{ height: "80px" }}
            className="me-3"
          />
          Delisopas
        </h1>

        <div className="d-flex flex-wrap gap-3 justify-content-center mb-5">
          <Link to="/almuerzos" className="btn btn-outline-primary shadow">
            🍛 Almuerzos
          </Link>
          <Link to="/desayunos" className="btn btn-outline-success shadow">
            🥐 Desayunos
          </Link>
          <Link to="/bebidas" className="btn btn-outline-secondary shadow">
            🧃 Bebidas
          </Link>
          <Link to="/pedidos" className="btn btn-outline-warning shadow">
            📝 Pedidos
          </Link>
          <Link to="/resumen" className="btn btn-outline-info shadow">
            📊 Resumen
          </Link>
          <button
            onClick={handleCerrarCaja}
            className="btn btn-outline-danger shadow"
          >
            🧾 Cerrar Caja
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline-dark shadow"
          >
            🔓 Cerrar sesión
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
            path="/bebidas"
            element={
              <OrderForm
                title="Bebidas"
                items={drinks}
                onSubmit={handleNuevoPedido}
              />
            }
          />
          <Route
            path="/pedidos"
            element={["pendiente", "en cocina", "servido"].map((estado) => (
              <div key={estado} className="mb-5">
                <div
                  className={`text-center mb-3 py-2 rounded fs-5 fw-bold shadow-sm ${
                    estado === "pendiente"
                      ? "bg-secondary text-white"
                      : estado === "en cocina"
                      ? "bg-warning text-dark"
                      : "bg-info text-dark"
                  }`}
                >
                  {estado === "pendiente" && "⏳ PENDIENTE"}
                  {estado === "en cocina" && "👨‍🍳 EN COCINA"}
                  {estado === "servido" && "🍽️ SERVIDO"}
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
                  {pedidos
                    .filter(
                      (pedido) =>
                        !pedido.pagado &&
                        (pedido.estado || "pendiente") === estado
                    )
                    .map((pedido, index) => (
                      <div className="col" key={index}>
                        <ResumenPedidoCard
                          pedido={pedido}
                          onPagoCompleto={handlePagoCompleto}
                          onCancelarPedido={handleCancelarPedido}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          />
          <Route
            path="/resumen"
            element={
              <>
                <ul className="list-group mb-4">
                  <li className="list-group-item">
                    Total de pedidos: {resumenDelDia.length}
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
