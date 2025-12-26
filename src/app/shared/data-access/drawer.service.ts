import { Injectable } from '@angular/core';
import { Drawer } from 'flowbite';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private cartDrawer?: Drawer;

  registrarCartDrawer(drawer: Drawer) {
    this.cartDrawer = drawer;
  }

  openCartDrawer() {
    this.cartDrawer?.show();
  }

  closeCartDrawer() {
    this.cartDrawer?.hide();
  }
}
