import ResumenPedidoCard from "./CardOrderSummary";
import OrderForm from "./OrderForm";
import { Order } from "./Schemas/luchSchema";
import { useState } from "react";

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
  const [pedidos, setPedidos] = useState<any[]>([]); // o tipado más exacto si deseas

  const handleNuevoPedido = (data: any) => {
    setPedidos((prev) => [...prev, data]);
  };

  return (
    <div className="container">
      <OrderForm
        title="Almuerzos"
        items={lunchItems}
        onSubmit={handleNuevoPedido}
      />
      <OrderForm
        title="Desayunos"
        items={breakfastItems}
        onSubmit={handleNuevoPedido}
      />

      <h3 className="mt-5">Pedidos Recibidos</h3>
      <div className="row row-cols-1 row-cols-md-2 g-3 mt-3">
        {pedidos.map((pedido, index) => (
          <div className="col" key={index}>
            <ResumenPedidoCard pedido={pedido} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurant;
