export interface FacturaInterface {
    id: number;
    fecha: Date;
    nombreCliente: string;
    apellidoCliente: string;
    emailCliente: string;
    direccionCliente: string;
    complementoDireccion?: string;
    telefonoCliente: string;
    paisCliente: string;
    regionCliente: string;
    ciudadCliente: string;
    valorPagado: number;
    precioEnvio: number;
    valorTotal: number;
    metodoPago: string;
    detalle: FacturaDetalle[];
}

export interface ProductoFactura {
    idProducto: number;
    cantidadProducto: number;
    nombreProducto?: string;
    precioUnitario?: number;
}

export interface DatosCliente {
    nombreCliente: string;
    apellidoCliente: string;
    emailCliente: string;
    direccionCliente: string;
    complementoDireccion?: string;
    telefonoCliente: string;
    paisCliente: string;
    regionCliente: string;
    ciudadCliente: string;
}

export interface FacturaRequest {
    datosCliente: DatosCliente;
    productos: ProductoFactura[];
    precioEnvio: number;
    metodoPago: string;
    // tipoPrecio: 'mayor' | 'detal';
}

export interface FacturaResponse {
    idFactura: number;
    mensaje: string;
    valorTotal: number;
    valorPagado: number;
    precioEnvio: number;
}

export interface FacturaDetalle {
  idFactura: number;
  idProducto: number;
  cantidadProducto: number;
  precioUnitario: number;
  subtotal: number;
}