import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FacturaService } from '../shared/data-access/factura.service';
import { FacturaInterface } from '../shared/interfaces/factura.interface';

@Component({
  selector: 'app-confirmacion',
  imports: [NgIf, CurrencyPipe, DatePipe],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.scss',
})
export default class Confirmacion implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    initFlowbite();
  }

  route = inject(ActivatedRoute);
  router = inject(Router);
  facturaService = inject(FacturaService);

  factura: FacturaInterface | null = null;
  cargando: boolean = true;
  error: string = '';

  ngOnInit(): void {
    const idFactura = this.route.snapshot.paramMap.get('id');

    if (idFactura) {
      this.cargarFactura(+idFactura);
    } else {
      this.error = 'ID de factura no válido';
      this.cargando = false;
    }
  }

  async cargarFactura(id: number): Promise<void> {
    try {
      this.factura = await this.facturaService.obtenerFactura(id);
      this.cargando = false;
    } catch (error: any) {
      this.error = 'Error al cargar la información de la factura';
      this.cargando = false;
      console.error('Error:', error);
    }
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }

  imprimirFactura(): void {
    window.print();
  }

}
