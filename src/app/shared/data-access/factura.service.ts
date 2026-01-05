import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FacturaInterface, FacturaRequest, FacturaResponse } from '../interfaces/factura.interface';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface ProductoFactura {
  id_producto: number;
  cantidad_producto: number;
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

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  private apiUrl = `${environment.API_URL}facturas`;

  constructor(private http: HttpClient) { }

  async crearFactura(facturaData: FacturaRequest): Promise<FacturaResponse> {

    try {

      console.log('=== SERVICIO FACTURA ===');
      console.log('Datos recibidos (camelCase):', facturaData);

      if (!facturaData.datosCliente) {
        throw new Error('Los datos del cliente son requeridos');
      }

      if (facturaData.precioEnvio === undefined || facturaData.precioEnvio === null) {
        throw new Error('El precio de envío es requerido');
      }

      const tipoPrecio = 'detal';


      const payload = {
        datosCliente: {
          nombre_cliente: facturaData.datosCliente.nombreCliente,
          apellido_cliente: facturaData.datosCliente.apellidoCliente,
          email_cliente: facturaData.datosCliente.emailCliente,
          direccion_cliente: facturaData.datosCliente.direccionCliente,
          complemento_direccion: facturaData.datosCliente.complementoDireccion || '',
          telefono_cliente: facturaData.datosCliente.telefonoCliente,
          pais_cliente: facturaData.datosCliente.paisCliente,
          region_cliente: facturaData.datosCliente.regionCliente,
          ciudad_cliente: facturaData.datosCliente.ciudadCliente
        },
        productos: facturaData.productos.map(p => ({
          id_producto: p.idProducto,
          cantidad_producto: p.cantidadProducto
        })),
        precio_envio: Number(facturaData.precioEnvio),
        metodo_pago: facturaData.metodoPago,
        tipo_precio: tipoPrecio
      };

      console.log('Payload a enviar (snake_case):', payload);
      console.log('Payload JSON:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del backend:', errorData);
        throw new Error(errorData.mensaje || 'Error al crear la factura');
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      const facturaResponse: FacturaResponse = {
        idFactura: data.id_factura,
        mensaje: data.mensaje,
        valorTotal: data.valor_total,
        valorPagado: data.valor_pagado,
        precioEnvio: data.precio_envio
      };

      return facturaResponse;
      // console.log('Factura creada exitosamente:', data);
      // return data;
    } catch (error: any) {
      console.error('Error al crear factura:', error);
      throw new Error(error.message || 'Error al procesar la factura');
    }
  }

  async obtenerFactura(id: number): Promise<FacturaInterface> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);

      if (!response.ok) {
        throw new Error('Factura no encontrada');
      }

      const data: FacturaInterface = await response.json();
      console.log('Datos recibidos del backend:', data);

      const factura: FacturaInterface = {
        id: data.id,
        fecha: new Date(data.fecha),
        nombreCliente: data.nombreCliente,
        apellidoCliente: data.apellidoCliente,
        emailCliente: data.emailCliente,
        direccionCliente: data.direccionCliente,
        complementoDireccion: data.complementoDireccion,
        telefonoCliente: data.telefonoCliente,
        paisCliente: data.paisCliente,
        regionCliente: data.regionCliente,
        ciudadCliente: data.ciudadCliente,
        valorPagado: data.valorPagado,
        precioEnvio: data.precioEnvio,
        valorTotal: data.valorTotal,
        metodoPago: data.metodoPago,
        detalle: data.detalle || []
      };

      return factura;
    } catch (error: any) {
      console.error('Error al obtener factura:', error);
      throw new Error(error.message || 'Error al obtener la factura');
    }
  }

  async obtenerFacturas(): Promise<FacturaInterface[]> {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error('Error al obtener facturas');
      }

      const data: any[] = await response.json();

      return data.map(item => ({
        id: item.id,
        fecha: new Date(item.fecha),
        nombreCliente: item.nombreCliente,
        apellidoCliente: item.apellidoCliente,
        emailCliente: item.emailCliente,
        direccionCliente: item.direccionCliente,
        complementoDireccion: item.complementoDireccion,
        telefonoCliente: item.telefonoCliente,
        paisCliente: item.paisCliente,
        regionCliente: item.regionCliente,
        ciudadCliente: item.ciudadCliente,
        valorPagado: item.valorPagado,
        precioEnvio: item.precioEnvio,
        valorTotal: item.valorTotal,
        metodoPago: item.metodoPago,
        detalle: item.detalle || []
      }));
    } catch (error: any) {
      console.error('Error al obtener facturas:', error);
      throw new Error(error.message || 'Error al obtener las facturas');
    }
  }

  private handleError(error: any): string {
    if (error.error instanceof ErrorEvent) {
      return `Error del cliente: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        return error.error.mensaje || 'Datos de factura inválidos';
      } else if (error.status === 404) {
        return 'Producto no encontrado o sin stock';
      } else if (error.status === 500) {
        return error.error.mensaje || 'Error en el servidor al procesar la factura';
      }
      return `Error del servidor: ${error.status} - ${error.message}`;
    }
  }

}
