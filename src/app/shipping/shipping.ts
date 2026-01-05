import { AfterViewInit, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { PaymentDataService } from '../shared/data-access/payment-data.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

interface MetodoEnvio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempoEstimado: string;
}

@Component({
  selector: 'app-shipping',
  imports: [CurrencyPipe, NgFor, NgIf, FormsModule],
  templateUrl: './shipping.html',
  styleUrl: './shipping.scss',
})
export default class Shipping implements AfterViewInit {

  ngAfterViewInit(): void {
    initFlowbite();
  }

  cartState = inject(CartStateService).state;
  paymentDataService = inject(PaymentDataService);
  router = inject(Router);

  metodoEnvioSeleccionado: string = '';
  costoEnvio: number = 0;

  metodosEnvio: MetodoEnvio[] = [
    {
      id: 'estandar',
      nombre: 'Envío Estándar',
      descripcion: 'Entrega en 5-7 días hábiles',
      precio: 15000,
      tiempoEstimado: '5-7 días'
    },
    {
      id: 'express',
      nombre: 'Envío Express',
      descripcion: 'Entrega en 2-3 días hábiles',
      precio: 30000,
      tiempoEstimado: '2-3 días'
    },
    {
      id: 'overnight',
      nombre: 'Envío Urgente',
      descripcion: 'Entrega al día siguiente',
      precio: 50000,
      tiempoEstimado: '1 día'
    }
  ];

  ngOnInit() {
    // if (!this.paymentDataService.getDatosCliente()) {
    //   this.router.navigate(['/payment']);
    //   return;
    // }

    const datosCliente = this.paymentDataService.getDatosCliente();

    console.log('=== SHIPPING - Datos del cliente ===', datosCliente);

    if (!datosCliente) {
      console.warn('No hay datos del cliente, redirigiendo a payment');
      this.router.navigate(['/payment']);
      return;
    }

    this.calcularMetodosEnvio();
  }

  calcularMetodosEnvio() {
    const datosCliente = this.paymentDataService.getDatosCliente();

    if (!datosCliente) return;

    console.log('Calculando métodos de envío para país:', datosCliente.paisCliente);

    const paisCliente = datosCliente.paisCliente || '';
    const esColombia = paisCliente === 'Colombia' ||
      paisCliente === 'CO' ||
      (paisCliente && paisCliente.toLowerCase().includes('colombia'));

    // const esColombia = datosCliente.pais_cliente === 'Colombia' ||
    // datosCliente.pais_cliente === 'CO' ||
    // datosCliente.pais_cliente.toLowerCase().includes('colombia');

    console.log('¿Es Colombia?', esColombia);

    if (esColombia) {
      this.metodosEnvio = [
        {
          id: 'estandar',
          nombre: 'Envío Estándar',
          descripcion: 'Entrega en 5-7 días hábiles',
          precio: 15000,
          tiempoEstimado: '5-7 días'
        },
        {
          id: 'express',
          nombre: 'Envío Express',
          descripcion: 'Entrega en 2-3 días hábiles',
          precio: 30000,
          tiempoEstimado: '2-3 días'
        },
        {
          id: 'overnight',
          nombre: 'Envío Urgente',
          descripcion: 'Entrega al día siguiente',
          precio: 50000,
          tiempoEstimado: '1 día'
        }
      ];

      if (this.cartState.precio() > 100000) {
        this.metodosEnvio[0].precio = 0;
        this.metodosEnvio[0].descripcion = 'Entrega en 5-7 días hábiles - ¡GRATIS!';
      }
    } else {
      this.metodosEnvio = [
        {
          id: 'estandar',
          nombre: 'Envío Internacional Estándar',
          descripcion: 'Entrega en 10-15 días hábiles',
          precio: 50000,
          tiempoEstimado: '10-15 días'
        },
        {
          id: 'express',
          nombre: 'Envío Internacional Express',
          descripcion: 'Entrega en 5-7 días hábiles',
          precio: 80000,
          tiempoEstimado: '5-7 días'
        }
      ];
    }
  }

  onSeleccionarMetodo(metodo: MetodoEnvio) {
    this.metodoEnvioSeleccionado = metodo.id;
    this.costoEnvio = metodo.precio;
    console.log('Método de envío seleccionado:', metodo);
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.metodoEnvioSeleccionado) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      if (!this.metodoEnvioSeleccionado) {
        alert('Por favor, selecciona un método de envío');
      }
      return;
    }

    const datosEnvio = {
      metodoEnvio: this.metodoEnvioSeleccionado,
      precioEnvio: this.costoEnvio
    }

    console.log('Guardando datos de envío:', datosEnvio);
    this.paymentDataService.setDatosEnvio(datosEnvio);

    this.router.navigate(['/checkout']);
  }

  volverAtras() {
    this.router.navigate(['/payment']);
  }

  obtenerMetodoSeleccionado(): MetodoEnvio | undefined {
    return this.metodosEnvio.find(m => m.id === this.metodoEnvioSeleccionado);
  }

}
