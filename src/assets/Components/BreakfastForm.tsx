import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";

type Props = {};

function BreakfastForm({}: Props) {
  return (
    <form>
      <Input name="mesa">MESA</Input>
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
        <Input name="Changua">Changua</Input>
        <Input name="Changua">Caldo</Input>
        <Input name="Changua">Pan Y chocolate</Input>
        <Input name="Changua">Huevos Arroz</Input>
        <Input name="Changua">Huevos Al Guaso</Input>
        <Input name="Changua">Tamal Especial</Input>
      </div>
      <h2 className="m-4">Bebidas</h2>
      <div className="row row-cols-2 g-3">
        <Input name="Changua">Cafe</Input>
        <Input name="Changua">Chocolate</Input>
        <Input name="Changua">Perico</Input>
        <Input name="Changua">Jugo Hit</Input>
        <Input name="Changua">Jugo Hit Grande</Input>
        <Input name="Changua">Jugo N.agua</Input>
        <Input name="Changua">Jugo N.Leche</Input>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Button>Enviar Pedido</Button>
      </div>
    </form>
  );
}

export default BreakfastForm;
