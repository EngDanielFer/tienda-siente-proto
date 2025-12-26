import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../shared/data-access/base-http.service';
import { map, Observable } from 'rxjs';
import { ProductInterface } from '../../shared/interfaces/product.interface';

const LIMIT = 24;

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseHttpService {

  getProductos(page: number): Observable<{ productos: ProductInterface[], total: number }> {
    return this.http.get<ProductInterface[]>(`${this.apiSienteUrl}productos`).pipe(
      map((allProductos) => {
        const start = (page - 1) * LIMIT;
        const end = start + LIMIT;
        return {
          productos: allProductos.slice(start, end),
          total: allProductos.length
        }
      })
    )
  }

  getProducto(id: string): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${this.apiSienteUrl}productos/${id}`);
  }
  
}
