import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/ui/header/header';
import { initFlowbite, Drawer } from 'flowbite';
import { Footer } from './shared/ui/footer/footer';
import { DrawerService } from './shared/data-access/drawer.service';
import Cart from './cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Cart],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('tienda-siente-proto');
  private cartDrawer!: Drawer;

  constructor(private drawerService: DrawerService) { }

  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterViewInit(): void {
    const drawerEl = document.getElementById('cart-drawer');
    if (drawerEl) {
      this.cartDrawer = new Drawer(drawerEl, {
        placement: 'right',
        backdrop: true,
        bodyScrolling: false,
        edge: false,
      });
      this.drawerService.registrarCartDrawer(this.cartDrawer);
    }
  }
}
