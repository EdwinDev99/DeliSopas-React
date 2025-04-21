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
  const { setValue, register, handleSubmit } = methods;
  const [orders, setOrders] = useState<Order[]>([]);

  const handleButtonClick = (order: Order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    setValue("productos", updatedOrders);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("Pedido:", data);
          onSubmit?.(data);
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

        {/* Campo para detalles del pedido */}
        <div className="mt-3">
          <label htmlFor="detalles">Detalles del Pedido</label>
          <input
            type="text"
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
