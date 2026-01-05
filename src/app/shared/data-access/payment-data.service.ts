import { Injectable } from '@angular/core';

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

export interface DatosEnvio {
  metodoEnvio: string;
  precioEnvio: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentDataService {

  // private readonly STORAGE_KEYS = {
  //   DATOS_CLIENTE: 'siente_datos_cliente',
  //   DATOS_ENVIO: 'siente_datos_envio'
  // };

  private readonly DATOS_CLIENTE_KEY = 'datosCliente';
  private readonly DATOS_ENVIO_KEY = 'datosEnvio';

  constructor() { }

  setDatosCliente(datos: any): void {
    // try {
    //   const datosCliente = {
    //     nombreCliente: datos.nombreCliente || datos.nombre_cliente,
    //     apellidoCliente: datos.apellidoCliente || datos.apellido_cliente,
    //     emailCliente: datos.emailCliente || datos.email_cliente,
    //     telefonoCliente: datos.telefonoCliente || datos.telefono_cliente,
    //     paisCliente: datos.paisCliente || datos.pais_cliente,
    //     regionCliente: datos.regionCliente || datos.region_cliente,
    //     ciudadCliente: datos.ciudadCliente || datos.ciudad_cliente,
    //     direccionCliente: datos.direccionCliente || datos.direccion_cliente,
    //     complementoDireccion: datos.complementoDireccion || datos.complemento_direccion || ''
    //   };

    //   localStorage.setItem('datosCliente', JSON.stringify(datosCliente));
    // } catch (error) {
    //   console.error('Error al guardar datos del cliente:', error);
    // }

    console.log('Guardando datos del cliente:', datos);
    localStorage.setItem(this.DATOS_CLIENTE_KEY, JSON.stringify(datos));
  }

  getDatosCliente(): DatosCliente | null {
    try {
      const datos = localStorage.getItem(this.DATOS_CLIENTE_KEY);
      const parsed = datos ? JSON.parse(datos) : null;
      console.log('Recuperando datos del cliente:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      return null;
    }
  }

  setDatosEnvio(datos: DatosEnvio): void {
    try {
      const datosNormalizados = {
        metodoEnvio: datos.metodoEnvio,
        precioEnvio: datos.precioEnvio
      };
      console.log('Guardando datos de envío:', datosNormalizados);
      localStorage.setItem(this.DATOS_ENVIO_KEY, JSON.stringify(datosNormalizados));
    } catch (error) {
      console.error('Error al guardar datos de envío:', error);
    }
  }

  getDatosEnvio(): DatosEnvio | null {
    try {
      const datos = localStorage.getItem(this.DATOS_ENVIO_KEY);
      const parsed = datos ? JSON.parse(datos) : null;
      console.log('Recuperando datos de envío:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error al obtener datos de envío:', error);
      return null;
    }
  }

  limpiarDatos(): void {
    try {
      localStorage.removeItem(this.DATOS_CLIENTE_KEY);
      localStorage.removeItem(this.DATOS_ENVIO_KEY);
    } catch (error) {
      console.error('Error al limpiar datos:', error);
    }
  }

  tienesDatosCompletos(): boolean {
    return this.getDatosCliente() !== null && this.getDatosEnvio() !== null;
  }

}
