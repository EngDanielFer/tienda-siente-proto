import { Component, computed, effect, inject, input } from '@angular/core';
import { ProductDetailStateService } from '../../data-access/product-detail-state.service';
import { CurrencyPipe } from '@angular/common';
import { ProductInterface } from '../../../shared/interfaces/product.interface';
import { CartStateService } from '../../../shared/data-access/cart-state.service';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  providers: [ProductDetailStateService]
})
export default class ProductDetail {

  producto = input.required<ProductInterface>();
  productDetailState = inject(ProductDetailStateService).state;
  cartState = inject(CartStateService).state;

  imagenSrc = computed(() => {
    const img = this.productDetailState.producto()?.imagen_producto!;
    if (img.startsWith('data:')) {
      return img;
    }
    return `data:image/jpeg;base64,${img}`;
  });

  id = input.required<string>();

  constructor() {
    effect(() => {
      console.log(this.id());
      this.productDetailState.getById(this.id());
    });
  }

  addToCart() {
    this.cartState.add({
      producto: this.productDetailState.producto()!,
      cantidad: 1
    });
  }
}
