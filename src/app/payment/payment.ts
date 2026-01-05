import { AfterViewInit, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentDataService } from '../shared/data-access/payment-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, NgFor, NgIf, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export default class Payment implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }

  cartState = inject(CartStateService).state;
  paymentDataService = inject(PaymentDataService);
  router = inject(Router)

  dropdownOpen = false;

  paisSeleccionado = {
    label: '+57 Colombia',
    code: '+57',
    flag: 'https://flagcdn.com/co.svg',
  };

  paisesCodigos = [
    { label: '+1 United States', code: '+1', flag: 'https://flagcdn.com/us.svg' },
    { label: '+44 United Kingdom', code: '+44', flag: 'https://flagcdn.com/gb.svg' },
    { label: '+61 Australia', code: '+61', flag: 'https://flagcdn.com/au.svg' },
    { label: '+49 Germany', code: '+49', flag: 'https://flagcdn.com/de.svg' },
    { label: '+57 Colombia', code: '+57', flag: 'https://flagcdn.com/co.svg' },
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  seleccionarPais(option: any) {
    this.paisSeleccionado = option;
    this.dropdownOpen = false;
  }

  valorPaisSelec: string = '';
  valorRegionSelec: string = '';
  valorCiudadSelec: string = '';

  paises = [
    { value: 'US', label: 'Estados Unidos' },
    { value: 'CO', label: 'Colombia' },
    { value: 'DE', label: 'Alemania' },
  ];

  regiones = [
    { value: 'CA', label: 'California', pais: 'US' },
    { value: 'TX', label: 'Texas', pais: 'US' },
    { value: 'ANT', label: 'Antioquia', pais: 'CO' },
    { value: 'CUN', label: 'Cundinamarca', pais: 'CO' },
    { value: 'BE', label: 'Berlín', pais: 'DE' },
  ];

  ciudades = [
    { value: 'LA', label: 'Los Ángeles', region: 'CA' },
    { value: 'HOU', label: 'Houston', region: 'TX' },
    { value: 'MED', label: 'Medellín', region: 'ANT' },
    { value: 'BOG', label: 'Bogotá', region: 'CUN' },
    { value: 'BER', label: 'Berlín', region: 'BE' },
  ];

  regionesFiltradas: any[] = [];
  ciudadesFiltradas: any[] = [];

  onCambiarPais(event: any) {
    const pais = event.target.value;
    this.valorRegionSelec = '';
    this.valorCiudadSelec = '';
    this.regionesFiltradas = this.regiones.filter(r => r.pais === pais);
    this.ciudadesFiltradas = [];
  }

  onCambiarRegion(event: any) {
    const region = event.target.value;
    this.valorCiudadSelec = '';
    this.ciudadesFiltradas = this.ciudades.filter(c => c.region === region);
  }

  async onSubmit(form: any) {
    console.log('=== PAYMENT FORM SUBMIT ===');
    console.log('Form valid:', form.valid);
    console.log('Form values:', form.value);
    console.log('País seleccionado:', this.valorPaisSelec);
    console.log('Región seleccionada:', this.valorRegionSelec);
    console.log('Ciudad seleccionada:', this.valorCiudadSelec);

    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }

    if (!this.valorPaisSelec || !this.valorRegionSelec || !this.valorCiudadSelec) {
      alert('Por favor, completa todos los campos de ubicación');
      return;
    }

    const paisSeleccionado = this.paises.find(p => p.value === this.valorPaisSelec);
    const regionSeleccionada = this.regiones.find(r => r.value === this.valorRegionSelec);
    const ciudadSeleccionada = this.ciudades.find(c => c.value === this.valorCiudadSelec);

    const telefonoCompleto = this.paisSeleccionado.code + (form.value.telefono || '');

    const datosCliente = {
      // nombre_cliente: form.value.nombre.trim(),
      // apellido_cliente: form.value.apellidos.trim(),
      // email_cliente: form.value.email.trim(),
      // telefono_cliente: this.paisSeleccionado.code + form.value.telefono,
      // pais_cliente: paisSeleccionado?.label || this.valorPaisSelec,
      // region_cliente: regionSeleccionada?.label || this.valorRegionSelec,
      // ciudad_cliente: ciudadSeleccionada?.label || this.valorCiudadSelec,
      // direccion_cliente: form.value.direccion.trim(),
      // complemento_direccion: form.value['complemento-direccion']?.trim() || ''
      nombreCliente: (form.value.nombre || '').trim(),
      apellidoCliente: (form.value.apellidos || form.value.apellido || '').trim(),
      emailCliente: (form.value.email || '').trim(),
      telefonoCliente: telefonoCompleto,
      paisCliente: paisSeleccionado?.label || this.valorPaisSelec,
      regionCliente: regionSeleccionada?.label || this.valorRegionSelec,
      ciudadCliente: ciudadSeleccionada?.label || this.valorCiudadSelec,
      direccionCliente: (form.value.direccion || '').trim(),
      complementoDireccion: (form.value['complemento-direccion'] || form.value.complemento || '').trim()
    };

    console.log('Datos del cliente a guardar:', datosCliente);

    if (!datosCliente.nombreCliente || !datosCliente.apellidoCliente ||
      !datosCliente.emailCliente || !datosCliente.telefonoCliente ||
      !datosCliente.direccionCliente) {
      alert('Por favor, completa todos los campos requeridos');
      console.error('Faltan campos requeridos:', datosCliente);
      return;
    }

    
    this.paymentDataService.setDatosCliente(datosCliente);

    this.router.navigate(['/shipping']);
  }
}
