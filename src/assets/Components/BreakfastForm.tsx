import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";

type Props = {};

function BreakfastForm({}: Props) {
  return (
    <form>
      <Input>MESA</Input>
      <h2>Seleccionar Almuerzos</h2>
      <div className="row row-cols-3 g-3">
        <div className="col">
          <OrderButton>
            Combo ~1~ <br /> $14.000
          </OrderButton>
        </div>
        <div className="col">
          <OrderButton>
            Combo ~2~
            <br /> $10.000
          </OrderButton>
        </div>
        <div className="col">
          <OrderButton>
            Combo ~3~
            <br /> $8.500
          </OrderButton>
        </div>
        <div className="col">
          <OrderButton>
            Combo ~4~
            <br /> $11.500
          </OrderButton>
        </div>
      </div>
      <h2 className="m-4">Adicionales</h2>
      <div className="row row-cols-2 g-3">
        <Input>Changua</Input>
        <Input>Caldo</Input>
        <Input>Pan Y chocolate</Input>
        <Input>Huevos Arroz</Input>
        <Input>Huevos Al Guaso</Input>
        <Input>Tamal Especial</Input>
      </div>
      <h2 className="m-4">Bebidas</h2>
      <div className="row row-cols-2 g-3">
        <Input>Cafe</Input>
        <Input>Chocolate</Input>
        <Input>Perico</Input>
        <Input>Jugo Hit</Input>
        <Input>Jugo Hit Grande</Input>
        <Input>Jugo N.agua</Input>
        <Input>Jugo N.Leche</Input>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Button>Enviar Pedido</Button>
      </div>
    </form>
  );
}

export default BreakfastForm;
