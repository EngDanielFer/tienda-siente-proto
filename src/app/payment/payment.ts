import { AfterViewInit, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  dropdownOpen = false;

  paisSeleccionado = {
    label: '+1 United States',
    code: '+1',
    flag: 'https://flagcdn.com/us.svg',
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

  onSubmit(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }
  }
}
