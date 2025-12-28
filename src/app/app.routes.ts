import { Routes } from '@angular/router';
import { About } from './about/about';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home.routes')
    },
    {
        path: 'sobre-nosotros',
        component: About
    },
    {
        path: 'productos',
        loadChildren: () => import('./products/features/product-shell/product.route')
    },
    {
        path: 'cart',
        loadChildren: () => import('./cart/cart.routes')
    },
    {
        path: 'payment',
        loadChildren: () => import('./payment/payment.routes')
    },
    {
        path: 'shipping',
        loadComponent: () => import('./shipping/shipping')
    },
    {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout')
    },
    {
        path: 'confirmacion/:id',
        loadComponent: () => import('./confirmacion/confirmacion')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
