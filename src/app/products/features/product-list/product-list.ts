import { Component, inject } from '@angular/core';
import { ProductCard } from '../../ui/product-card/product-card';
import { ProductsStateService } from '../../data-access/products-state.service';
import { CartStateService } from '../../../shared/data-access/cart-state.service';
import { ProductInterface } from '../../../shared/interfaces/product.interface';
import { Paginator } from '../../ui/paginator/paginator';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, Paginator],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  providers: [ProductsStateService]
})
export default class ProductList {
  productsState = inject(ProductsStateService);
  cartState = inject(CartStateService).state;

  changePage(page: number) {
    this.productsState.setPage(page);
  }

  addToCart(producto: ProductInterface){
    this.cartState.add({
      producto,
      cantidad: 1
    });
  }
}
