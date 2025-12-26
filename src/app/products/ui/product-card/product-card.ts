import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductInterface } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  producto = input.required<ProductInterface>();

  imagenSrc = computed(() => {
    const img = this.producto().imagen_producto;
    if (img.startsWith('data:')) {
      return img;
    }
    return `data:image/jpeg;base64,${img}`;
  });

  addToCart = output<ProductInterface>();

  add(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.producto());
  }

}
