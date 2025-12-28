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
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear la factura');
      }

      const data: FacturaResponse = await response.json();
      console.log('Factura creada exitosamente:', data);
      return data;
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
      return data;
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

      const data: FacturaInterface[] = await response.json();
      return data;
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
