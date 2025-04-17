import Button from "./Button";
import Input from "./Input";
import OrderButton from "./OrderButton";

type Props = {};

function LounchForm({}: Props) {
  return (
    <>
      <form>
        <Input>MESA</Input>
        <h2>Seleccionar Almuerzos</h2>
        <div className="row row-cols-3 g-3">
          <div className="col">
            <OrderButton>
              Almuerzo Corriente <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton>
              Ejecutivo Varios
              <br /> $15.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton>
              Eje Sopa Especial
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton>
              Ejecutivo Churrasco <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton>
              ~Sopa Pequena~
              <br /> $13.000
            </OrderButton>
          </div>
          <div className="col">
            <OrderButton>
              ~Sopa grande~ <br /> ~ $13.000 ~
            </OrderButton>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Button>Enviar Pedido</Button>
        </div>
      </form>
    </>
  );
}

export default LounchForm;
