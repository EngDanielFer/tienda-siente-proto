import { inject, Injectable, Signal } from '@angular/core';
import { ProductItemCart } from '../interfaces/product.interface';
import { StorageService } from './storage.service';
import { map, Observable } from 'rxjs';
import { signalSlice } from 'ngxtension/signal-slice';

interface State {
  productos: ProductItemCart[];
  status: 'empty' | 'withProducts';
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CartStateService {

  private _storageService = inject(StorageService);

  private initialState: State = {
    productos: [],
    status: 'empty' as const,
    loaded: false
  };

  loadProducts$ = this._storageService.loadProducts().pipe(
    map((productos) => ({
      productos,
      loaded: true,
      status: productos.length > 0 ? 'withProducts' as const : 'empty' as const
    }))
  );

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.loadProducts$],
    selectors: (state) => ({
      cantidad: () => state().productos.reduce((acc, producto) => acc + producto.cantidad, 0),
      precio: () => {
        return state().productos.reduce(
          (acc, producto) => acc + producto.producto.precio_detal * producto.cantidad, 0
        );
      }
    }),
    actionSources: {
      add: (state, action$: Observable<ProductItemCart>) =>
        action$.pipe(
          map((producto) => this.add(state, producto)),
        ),
      remove: (state, action$: Observable<number>) => action$.pipe(
        map((id) => this.remove(state, id))
      ),
      update: (state, action$: Observable<ProductItemCart>) => action$.pipe(
        map((product) => this.update(state, product))
      ),
      clear: (state, action$: Observable<void>) =>
        action$.pipe(
          map(() => this.clear(state))
        )
    },
    effects: (state) => ({
      load: () => {
        if (state().loaded) {
          this._storageService.saveProducts(state().productos);
        }
      }
    })
  });

  private add(state: Signal<State>, product: ProductItemCart) {
    const isInCart = state().productos.find(
      (productInCart) => productInCart.producto.id == product.producto.id
    );

    let productos: ProductItemCart[];

    if (!isInCart) {
      productos = [...state().productos, { ...product, cantidad: 1 }];
    } else {
      isInCart.cantidad += 1;
      productos = [...state().productos];
    }

    return {
      productos,
      status: productos.length > 0 ? 'withProducts' as const : 'empty' as const
    };
  }

  private remove(state: Signal<State>, id: number) {
    const productos = state().productos.filter(
      (product) => product.producto.id != id
    );
    return {
      productos,
      status: productos.length > 0 ? 'withProducts' as const : 'empty' as const
    }
  }

  private update(state: Signal<State>, product: ProductItemCart) {
    const productos = state().productos.map((productInCart) => {
      if (productInCart.producto.id === product.producto.id) {
        return { ...productInCart, cantidad: product.cantidad };
      }

      return productInCart;
    });

    return {
      productos,
      status: productos.length > 0 ? 'withProducts' as const : 'empty' as const
    }
  }

  private clear(state: Signal<State>) {
    this._storageService.clearProducts();

    return {
      productos: [],
      status: 'empty' as const,
      loaded: true
    }
  }

}
