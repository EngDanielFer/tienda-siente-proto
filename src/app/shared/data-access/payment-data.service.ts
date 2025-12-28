import { Injectable } from '@angular/core';

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

export interface DatosEnvio {
  metodo_envio: string;
  precio_envio: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentDataService {

  private readonly STORAGE_KEYS = {
    DATOS_CLIENTE: 'siente_datos_cliente',
    DATOS_ENVIO: 'siente_datos_envio'
  };

  setDatosCliente(datos: DatosCliente): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DATOS_CLIENTE, JSON.stringify(datos));
    } catch (error) {
      console.error('Error al guardar datos del cliente:', error);
    }
  }

  getDatosCliente(): DatosCliente | null {
    try {
      const datos = localStorage.getItem(this.STORAGE_KEYS.DATOS_CLIENTE);
      return datos ? JSON.parse(datos) : null;
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      return null;
    }
  }

  setDatosEnvio(datos: DatosEnvio): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DATOS_ENVIO, JSON.stringify(datos));
    } catch (error) {
      console.error('Error al guardar datos de envío:', error);
    }
  }

  getDatosEnvio(): DatosEnvio | null {
    try {
      const datos = localStorage.getItem(this.STORAGE_KEYS.DATOS_ENVIO);
      return datos ? JSON.parse(datos) : null;
    } catch (error) {
      console.error('Error al obtener datos de envío:', error);
      return null;
    }
  }

  limpiarDatos(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.DATOS_CLIENTE);
      localStorage.removeItem(this.STORAGE_KEYS.DATOS_ENVIO);
    } catch (error) {
      console.error('Error al limpiar datos:', error);
    }
  }

  tienesDatosCompletos(): boolean {
    return this.getDatosCliente() !== null && this.getDatosEnvio() !== null;
  }

}
