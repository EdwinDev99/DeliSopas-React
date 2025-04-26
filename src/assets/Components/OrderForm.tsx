import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";
import { Order } from "./Schemas/luchSchema"; // O uno compartido si son iguales

type Props = {
  title: string;
  items: Order[];
  onSubmit?: (data: any) => void;
};

function OrderForm({ title, items, onSubmit }: Props) {
  const methods = useForm();
  const { setValue, register, handleSubmit, watch } = methods;
  const [orders, setOrders] = useState<Order[]>([]);

  const handleButtonClick = (order: Order) => {
    const existingOrder = orders.find((o) => o.nombre === order.nombre);
    let updatedOrders;

    if (existingOrder) {
      updatedOrders = orders.map((o) =>
        o.nombre === order.nombre
          ? { ...o, cantidad: (o.cantidad || 1) + 1 }
          : o
      );
    } else {
      updatedOrders = [...orders, { ...order, cantidad: 1 }];
    }

    setOrders(updatedOrders);
    setValue("productos", updatedOrders);
  };

  const calcularTotal = () => {
    return orders.reduce((total, o) => total + o.precio * (o.cantidad || 1), 0);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("Pedido:", data);
          onSubmit?.(data);
          methods.reset(); // Limpia campos como mesa y detalles
          setOrders([]); // Limpia productos seleccionados
        })}
      >
        <Input {...register("mesa")}>MESA</Input>
        <h2>{title}</h2>
        <div className="row row-cols-3 g-3">
          {items.map((item, i) => (
            <div className="col" key={i}>
              <OrderButton order={item} onClick={handleButtonClick}>
                {item.nombre} <br /> ${item.precio.toLocaleString()}
              </OrderButton>
            </div>
          ))}
        </div>

        {/* Lista de productos seleccionados */}
        {orders.length > 0 && (
          <div className="mt-4">
            <h5>Resumen del pedido:</h5>
            <ul className="list-group">
              {orders.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>
                    {item.nombre} x {item.cantidad}
                  </span>
                  <span>
                    ${(item.precio * (item.cantidad || 1)).toLocaleString()}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${calcularTotal().toLocaleString()}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-3">
          <label htmlFor="detalles">Detalles del Pedido</label>
          <textarea
            id="detalles"
            {...register("detalles")}
            placeholder="Ejemplo: Sin cebolla, sin salsa..."
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button type="submit">Enviar Pedido</Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default OrderForm;
