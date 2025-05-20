import { Order } from "./Schemas/luchSchema";

type Pedido = {
  mesa: string;
  detalles: string;
  productos: Order[];
  pagosDivididos?: Record<string, number>;
};

type Props = {
  resumenDelDia: Pedido[];
};

function ResumenVentas({ resumenDelDia }: Props) {
  const agruparProductos = (pedidos: Pedido[]) => {
    const productosVendidos: { [key: string]: number } = {};

    pedidos.forEach((pedido) => {
      (pedido.productos ?? []).forEach((producto) => {
        if (producto.nombre) {
          productosVendidos[producto.nombre] =
            (productosVendidos[producto.nombre] || 0) +
            (producto.cantidad || 1);
        }
      });
    });

    return productosVendidos;
  };

  const calcularTotalVentas = () => {
    return resumenDelDia.reduce((total, pedido) => {
      return (
        total +
        (pedido.productos ?? []).reduce(
          (subtotal, producto) =>
            subtotal + producto.precio * (producto.cantidad || 1),
          0
        )
      );
    }, 0);
  };

  // ✅ Nueva función para calcular totales por método de pago
  const calcularTotalesPorMetodo = () => {
    const totales: Record<string, number> = {
      efectivo: 0,
      nequi: 0,
      daviplata: 0,
      codigoQR: 0,
    };

    resumenDelDia.forEach((pedido) => {
      if (pedido.pagosDivididos) {
        for (const metodo in pedido.pagosDivididos) {
          totales[metodo] += pedido.pagosDivididos[metodo] || 0;
        }
      }
    });

    return totales;
  };

  const totalesPorMetodo = calcularTotalesPorMetodo();

  return (
    <div className="mt-5">
      <h6 className="mt-4">Totales por Método de Pago:</h6>
      <ul className="list-group">
        <li className="list-group-item">
          💵 Efectivo: ${totalesPorMetodo.efectivo.toLocaleString()}
        </li>
        <li className="list-group-item">
          📱 Nequi: ${totalesPorMetodo.nequi.toLocaleString()}
        </li>
        <li className="list-group-item">
          🏦 Daviplata: ${totalesPorMetodo.daviplata.toLocaleString()}
        </li>
        <li className="list-group-item">
          🔳 Código QR: ${totalesPorMetodo.codigoQR.toLocaleString()}
        </li>
      </ul>

      <h4>Resumen de Ventas</h4>

      <ul className="list-group">
        {Object.entries(agruparProductos(resumenDelDia)).map(
          ([nombre, cantidad]) => (
            <li key={nombre} className="list-group-item">
              {nombre}: {cantidad} vendidos
            </li>
          )
        )}
      </ul>
      <h3 className="mt-3">
        💰 Total de Ventas: ${calcularTotalVentas().toLocaleString()}
      </h3>
    </div>
  );
}

export default ResumenVentas;
