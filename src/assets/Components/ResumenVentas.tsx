import { Order } from "./Schemas/luchSchema"; // Asegúrate de importar tu tipo Order

type Pedido = {
  mesa: string;
  detalles: string;
  productos: Order[];
};

type Props = {
  resumenDelDia: Pedido[];
};

function ResumenVentas({ resumenDelDia }: Props) {
  // Agrupamos los productos por nombre y sumamos las cantidades
  const agruparProductos = (pedidos: Pedido[]) => {
    const productosVendidos: { [key: string]: number } = {};

    pedidos.forEach((pedido) => {
      pedido.productos.forEach((producto) => {
        if (producto.nombre) {
          productosVendidos[producto.nombre] =
            (productosVendidos[producto.nombre] || 0) +
            (producto.cantidad || 1); // Asumimos 1 si la cantidad no está definida
        }
      });
    });

    return productosVendidos;
  };

  // Función para calcular el total de ventas (precio * cantidad de cada producto)
  const calcularTotalVentas = () => {
    return resumenDelDia.reduce((total, pedido) => {
      return (
        total +
        pedido.productos.reduce(
          (subtotal, producto) =>
            subtotal + producto.precio * (producto.cantidad || 1),
          0
        )
      );
    }, 0);
  };

  return (
    <div className="mt-5">
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

      <h5 className="mt-3">
        Total de Ventas: ${calcularTotalVentas().toLocaleString()}
      </h5>
    </div>
  );
}

export default ResumenVentas;
