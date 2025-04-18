import { FormProvider, useForm } from "react-hook-form";
import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";
import { LunchFormData, lunchSchema } from "../Schemas/lunchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

type Props = {};

function LounchForm({}: Props) {
  const methods = useForm<LunchFormData>({
    resolver: zodResolver(lunchSchema),
    defaultValues: {
      mesa: "",
      Pedidos: [],
    },
  });

  const pedidos = methods.watch("Pedidos");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const suma = pedidos.reduce(
      (acc: number, pedido: any) => acc + pedido.precio,
      0
    );
    setTotal(suma);
  }, [pedidos]);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          console.log("Formulario:", data);
          const total = data.Pedidos.reduce(
            (acc, item) => acc + item.precio,
            0
          );
          console.log("Total a pagar:", total);
        })}
      >
        <Input mesa="mesa">MESA</Input>
        <h2>Seleccionar Almuerzos</h2>
        <div className="row row-cols-3 g-3">
          <div className="col">
            <OrderButton value={13000} label="Almuerzo Corriente">
              Almuerzo Corriente <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton value={15000} label="Ejecutivo Varios">
              Ejecutivo Varios
              <br /> $15.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton value={13000} label="Eje Sopa Especial">
              Eje Sopa Especial
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton value={13000} label="Ejecutivo Churrasco">
              Ejecutivo Churrasco <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton value={13000} label="opa Pequena">
              ~Sopa Pequena~
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton value={13000} label="Sopa grande">
              ~Sopa grande~ <br /> ~ $13.000 ~
            </OrderButton>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button>Enviar Pedido</Button>
        </div>
        {`el total es:${total}`}
      </form>
    </FormProvider>
  );
}

export default LounchForm;
