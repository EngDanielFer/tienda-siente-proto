import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart-state.service';
import { DrawerService } from '../../data-access/drawer.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  cartState = inject(CartStateService).state;
  private drawer = inject(DrawerService);

  openCartDrawer() {
    this.drawer.openCartDrawer();
  }
  
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

}
