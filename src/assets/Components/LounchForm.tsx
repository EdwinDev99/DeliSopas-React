import { FormProvider, useForm } from "react-hook-form";
import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";
import { useState } from "react";
import { Order } from "./Schemas/luchSchema";

type Props = {};

function LounchForm({}: Props) {
  const methods = useForm();
  const { setValue } = methods;

  const [orders, setOrders] = useState<Order[]>([]);

  const handleButtonClick = (order: Order) => {
    // Usar setValue para actualizar el formulario
    setValue("almuerzos", [...orders, order]); // Guardamos el almuerzo en un campo virtual

    // Agregar el almuerzo al objeto almuerzos
    setOrders((prevAlmuerzos) => [...prevAlmuerzos, order]);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <Input {...methods.register("mesa")}>MESA</Input>
        <h2>Seleccionar Almuerzos</h2>
        <div className="row row-cols-3 g-3">
          <div className="col">
            <OrderButton
              order={{ nombre: "Almuerzo", precio: 13000 }}
              onClick={(console.log("agregando"), handleButtonClick)}
            >
              Almuerzo Corriente <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton
              order={{ nombre: "Ejecutivo Varios", precio: 13000 }}
              onClick={handleButtonClick}
            >
              Ejecutivo Varios
              <br /> $15.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton
              order={{ nombre: "Eje. Sopa Especial", precio: 13000 }}
              onClick={handleButtonClick}
            >
              Eje Sopa Especial
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton
              order={{ nombre: "Ejecutivo Churrasco", precio: 13000 }}
              onClick={handleButtonClick}
            >
              Ejecutivo Churrasco <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton
              order={{ nombre: "Sopa Pequena ", precio: 13000 }}
              onClick={handleButtonClick}
            >
              ~Sopa Pequena~
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton
              order={{ nombre: "Sopa Grande", precio: 13000 }}
              onClick={handleButtonClick}
            >
              ~Sopa grande~ <br /> ~ $13.000 ~
            </OrderButton>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button type="submit">Enviar Pedido</Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default LounchForm;
