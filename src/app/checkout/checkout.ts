import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { PaymentDataService } from '../shared/data-access/payment-data.service';
import { FacturaService } from '../shared/data-access/factura.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, NgFor, NgIf, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export default class Checkout implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }

  cartState = inject(CartStateService).state;
  paymentDataService = inject(PaymentDataService);
  facturaService = inject(FacturaService);
  router = inject(Router);

  metodoPagoSeleccionado: string = '';
  procesando: boolean = false;
  error: string = '';

  metodosPago = [
    {
      id: 'tarjeta-credito',
      nombre: 'Tarjeta de Crédito',
      descripcion: 'Visa, Mastercard, American Express',
      icono: '💳'
    },
    {
      id: 'tarjeta-debito',
      nombre: 'Tarjeta de Débito',
      descripcion: 'Débito bancario',
      icono: '💳'
    },
    {
      id: 'pse',
      nombre: 'PSE',
      descripcion: 'Pago Seguro en Línea',
      icono: '🏦'
    },
    {
      id: 'efectivo',
      nombre: 'Efectivo',
      descripcion: 'Pago contra entrega',
      icono: '💵'
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia Bancaria',
      descripcion: 'Transferencia directa',
      icono: '🏧'
    }
  ];

  datosCliente: any = null;
  datosEnvio: any = null;

  ngOnInit() {
    this.datosCliente = this.paymentDataService.getDatosCliente();
    this.datosEnvio = this.paymentDataService.getDatosEnvio();

    if (!this.datosCliente || !this.datosEnvio) {
      this.router.navigate(['/payment']);
      return;
    }
  }

  onSeleccionarMetodoPago(metodo: any) {
    this.metodoPagoSeleccionado = metodo.id;
    this.error = '';
  }

  async onSubmit(form: NgForm) {
    if (form.invalid || !this.metodoPagoSeleccionado) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      if (!this.metodoPagoSeleccionado) {
        this.error = 'Por favor, selecciona un método de pago';
      }
      return;
    }

    if (this.cartState.productos().length === 0) {
      this.error = 'El carrito está vacío';
      return;
    }

    this.procesando = true;
    this.error = '';

    try {
      const productos = this.cartState.productos().map(item => ({
        id_producto: item.producto.id,
        cantidad_producto: item.cantidad
      }));

      const facturaRequest = {
        datosCliente: this.datosCliente,
        productos: productos,
        precio_envio: this.datosEnvio.precio_envio,
        metodo_pago: this.obtenerNombreMetodoPago()
      }

      const response = await this.facturaService.crearFactura(facturaRequest);

      this.cartState.clear();
      this.paymentDataService.limpiarDatos();

      this.router.navigate(['/confirmacion', response.id_factura]);
    } catch (error: any) {
      console.error('Error al procesar pago:', error);
      this.error = error.message || 'Error al procesar el pago. Por favor, intenta nuevamente.';
      this.procesando = false;
    }
  }

  obtenerNombreMetodoPago(): string {
    const metodo = this.metodosPago.find(m => m.id === this.metodoPagoSeleccionado);
    return metodo ? metodo.nombre : this.metodoPagoSeleccionado;
  }

  volverAtras() {
    this.router.navigate(['/shipping']);
  }

  obtenerMetodoSeleccionado() {
    return this.metodosPago.find(m => m.id === this.metodoPagoSeleccionado);
  }

  obtenerTotal(): number {
    return this.cartState.precio() + (this.datosEnvio?.precio_envio || 0);
  }
}
