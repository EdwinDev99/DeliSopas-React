import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  children: ReactNode;
  value?: number;
  label: string;
};

function OrderButton({ children, value, label }: Props) {
  const { setValue, getValues } = useFormContext(); // accedemos al contexto del form

  const handleClick = () => {
    const current = getValues("Pedidos") || [];
    const newItem = { nombre: label, precio: value };
    setValue("Pedidos", [...current, newItem]);
    console.log("Agregado:", newItem);
  };
  return (
    <button onClick={handleClick} type="button" className="btn btn-success">
      {children}
    </button>
  );
}

export default OrderButton;
