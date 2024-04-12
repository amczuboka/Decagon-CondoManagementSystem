import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
/**
 * PaymentGuard class that implements the CanActivate interface.
 * This guard is used to determine if a route can be activated based on the user's state url.
 */
export class PaymentGuard implements CanActivate {
    constructor(public authService: AuthService, public router: Router) {}

    /**
     * Determines if a route can be activated based on the user's state url.
     *
     * Only is accessible if the public user presses the "Pay Fees" button.
     * @param route - The activated route snapshot.
     * @param state - The router state snapshot.
     * @returns An observable, promise, or boolean indicating if the route can be activated.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const user = JSON.parse(localStorage.getItem('user')!);
        const returnUrl = route.queryParams['returnUrl'];

        if (!returnUrl) {
            this.router.navigate(['']);
            return false;
        } else if (returnUrl.startsWith('/individual-condo') && returnUrl.includes('sourcePage=propertiesPage') && user.photoURL == "Public") {
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }
}
