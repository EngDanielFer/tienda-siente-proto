import { inject, Injectable } from '@angular/core';
import { ProductInterface } from '../../shared/interfaces/product.interface';
import { signalSlice } from 'ngxtension/signal-slice'
import { ProductsService } from './products.service';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

interface State {
  products: ProductInterface[];
  status: 'loading' | 'error' | 'success';
  page: number;
  pageSize: number;
  total: number
}

@Injectable()
export class ProductsStateService {
  private productsService = inject(ProductsService);

  private initialState: State = {
    products: [],
    status: 'loading' as const,
    page: 1,
    pageSize: 8,
    total: 0
  };

  private changePage$ = new Subject<number>();

  private loadProducts$ = this.changePage$.pipe(
    startWith(1),
    switchMap((page) => this.productsService.getProductos(page).pipe(
      map((resp) => ({
        products: resp.productos,
        total: resp.total,
        page,
        status: 'success' as const
      }))
    )),
    catchError(() => 
      of({
        products: [],
        total: 0,
        page: 1,
        status: 'error' as const
      }),
    )
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.changePage$.pipe(
        map((page) => ({ page, status: 'loading' as const })),
      ),
      this.loadProducts$,
    ]
  });

  setPage(page: number) {
    this.changePage$.next(page);
  }
}
