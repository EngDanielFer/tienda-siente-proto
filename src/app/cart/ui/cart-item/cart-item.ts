import { CurrencyPipe } from '@angular/common';
import { ProductItemCart } from '../../../shared/interfaces/product.interface';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
})
export default class CartItem {
  productoCartItem = input.required<ProductItemCart>();

  imagenSrc = computed(() => {
    const img = this.productoCartItem().producto.imagen_producto;
    if (img.startsWith('data:')) {
      return img;
    }
    return `data:image/jpeg;base64,${img}`;
  });

  onRemove = output<number>();

  onIncrease = output<ProductItemCart>();

  onDecrease = output<ProductItemCart>();

}
