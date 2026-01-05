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
  // tipoPrecioSeleccionado: 'mayor' | 'detal' = 'detal';
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

  // tiposPrecio = [
  //   {
  //     id: 'detal',
  //     nombre: 'Precio Detal',
  //     descripcion: 'Precio unitario para venta al público'
  //   },
  //   {
  //     id: 'mayor',
  //     nombre: 'Precio por Mayor',
  //     descripcion: 'Precio especial para compras al por mayor'
  //   }
  // ];

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

  // onSeleccionarTipoPrecio(tipo: 'mayor' | 'detal') {
  //   this.tipoPrecioSeleccionado = tipo;
  //   this.error = '';
  // }

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

    console.log('=== DEBUG CHECKOUT ===');
    console.log('Datos Cliente:', this.datosCliente);
    console.log('Datos Envío:', this.datosEnvio);
    console.log('Productos en carrito:', this.cartState.productos());
    console.log('Método de pago seleccionado:', this.metodoPagoSeleccionado);
    console.log('Tipo de precio seleccionado: detal');

    if (!this.datosCliente ||
      !this.datosCliente.nombreCliente ||
      !this.datosCliente.apellidoCliente ||
      !this.datosCliente.emailCliente) {
      this.error = 'Faltan datos del cliente. Por favor, vuelve al formulario de pago.';
      console.error('Datos del cliente incompletos:', this.datosCliente);
      return;
    }

    if (!this.datosEnvio ||
      (this.datosEnvio.precioEnvio === undefined &&
        this.datosEnvio.precio_envio === undefined)) {
      this.error = 'Faltan datos de envío. Por favor, selecciona un método de envío.';
      console.error('Datos de envío incompletos:', this.datosEnvio);
      this.router.navigate(['/shipping']);
      return;
    }

    this.procesando = true;
    this.error = '';

    try {
      const productos = this.cartState.productos().map(item => ({
        idProducto: item.producto.id,
        cantidadProducto: item.cantidad
      }));

      const precioEnvio = this.datosEnvio.precioEnvio ?? this.datosEnvio.precio_envio ?? 0;

      const facturaRequest = {
        datosCliente: {
          nombreCliente: this.datosCliente.nombreCliente,
          apellidoCliente: this.datosCliente.apellidoCliente || '',
          emailCliente: this.datosCliente.emailCliente,
          telefonoCliente: this.datosCliente.telefonoCliente,
          paisCliente: this.datosCliente.paisCliente,
          regionCliente: this.datosCliente.regionCliente,
          ciudadCliente: this.datosCliente.ciudadCliente,
          direccionCliente: this.datosCliente.direccionCliente,
          complementoDireccion: this.datosCliente.complementoDireccion || ''
        },
        productos: productos,
        precioEnvio: precioEnvio,
        metodoPago: this.obtenerNombreMetodoPago(),
        // tipoPrecio: this.tipoPrecioSeleccionado
      }

      console.log('Factura Request (antes de enviar):', JSON.stringify(facturaRequest));

      const response = await this.facturaService.crearFactura(facturaRequest);

      console.log('Respuesta del servidor:', response);

      this.cartState.clear();
      this.paymentDataService.limpiarDatos();

      this.router.navigate(['/confirmacion', response.idFactura]);
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

  // obtenerTipoPrecioSeleccionado() {
  //   return this.tiposPrecio.find(t => t.id === this.tipoPrecioSeleccionado);
  // }

  obtenerTotal(): number {
    const precioEnvio = this.datosEnvio?.precioEnvio ?? this.datosEnvio?.precio_envio ?? 0;
    return this.cartState.precio() + precioEnvio;

  }

  // calcularPrecioMayor(): number {
  //   return this.cartState.productos().reduce((total, item) => {
  //     const precioMayor = item.producto.precio_por_mayor || item.producto.precio_detal;
  //     return total + (precioMayor * item.cantidad);
  //   }, 0);
  // }

  // obtenerPrecioProducto(producto: any): number {
  //   return this.tipoPrecioSeleccionado === 'mayor'
  //     ? (producto.producto.precio_por_mayor || producto.producto.precio_detal)
  //     : producto.producto.precio_detal;
  // }
}
