import { Component, inject } from '@angular/core';
import CartItem from './ui/cart-item/cart-item';
import { CurrencyPipe } from '@angular/common';
import { CartStateService } from '../shared/data-access/cart-state.service';
import { DrawerService } from '../shared/data-access/drawer.service';
import { Router } from '@angular/router';
import { ProductItemCart } from '../shared/interfaces/product.interface';

@Component({
  selector: 'app-cart',
  imports: [CartItem, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export default class Cart {
  cartState = inject(CartStateService).state;
  private drawerCart = inject(DrawerService);

  constructor(
    private router: Router
  ) { }

  onRemove(id: number) {
    this.cartState.remove(id);
  }

  onIncrease(producto: ProductItemCart) {
    this.cartState.update({
      producto: producto.producto,
      cantidad: producto.cantidad + 1
    });
  }

  onDecrease(producto: ProductItemCart){
    this.cartState.update({
      ...producto,
      cantidad: producto.cantidad - 1
    });
  }

  goToProducts() {
    this.drawerCart.closeCartDrawer();
    this.router.navigate(['/products']);
  }

  goToPayment() {
    this.drawerCart.closeCartDrawer();
    this.router.navigate(['./payment']);
  }
}
