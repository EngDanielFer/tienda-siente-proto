import { inject, Injectable } from '@angular/core';
import { ProductInterface } from '../../shared/interfaces/product.interface';
import { ProductsService } from './products.service';
import { signalSlice } from 'ngxtension/signal-slice';
import { map, Observable, switchMap } from 'rxjs';

interface State {
  producto: ProductInterface | null;
  status: 'loading' | 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class ProductDetailStateService {
  private productsService = inject(ProductsService);

  private initialState: State = {
    producto: null,
    status: 'loading' as const
  };

  state = signalSlice({
    initialState: this.initialState,
    actionSources: {
      getById: (_state, $: Observable<string>) => $.pipe(
        switchMap((id) => this.productsService.getProducto(id)),
        map(data => ({ producto: data, status: 'success' as const }))
      )
    }
  });
}
