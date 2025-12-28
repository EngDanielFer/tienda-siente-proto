export interface FacturaInterface {
    id: number;
    fecha: Date;
    nombre_cliente: string;
    apellido_cliente: string;
    email_cliente: string;
    direccion_cliente: string;
    complemento_direccion?: string;
    telefono_cliente: string;
    pais_cliente: string;
    region_cliente: string;
    ciudad_cliente: string;
    valor_pagado: number;
    precio_envio: number;
    valor_total: number;
    metodo_pago: string;
}

export interface ProductoFactura {
    id_producto: number;
    cantidad_producto: number;
    nombre_producto?: string;
    precio_unitario?: number;
}

export interface DatosCliente {
    nombre_cliente: string;
    apellido_cliente: string;
    email_cliente: string;
    direccion_cliente: string;
    complemento_direccion?: string;
    telefono_cliente: string;
    pais_cliente: string;
    region_cliente: string;
    ciudad_cliente: string;
}

export interface FacturaRequest {
    datosCliente: DatosCliente;
    productos: ProductoFactura[];
    precio_envio: number;
    metodo_pago: string;
}

export interface FacturaResponse {
    id_factura: number;
    mensaje: string;
    valor_total: number;
    valor_pagado: number;
    precio_envio: number;
}

export interface FacturaDetalle {
  id_factura: number;
  id_producto: number;
  cantidad_producto: number;
  precio_unitario: number;
  subtotal: number;
}