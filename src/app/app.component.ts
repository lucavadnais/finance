import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavBarComponent} from "./components/nav-bar/nav-bar.component";
import {AuthProvider} from "./providers/auth/auth.provider";
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private routeSub: Subscription | undefined;
  title = 'finance';
  showNavBar = true;
  isLoggedIn = true;
  currentUrl = ''

  isHidden = false;
  lastScrollY = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authProvider: AuthProvider
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollY = window.scrollY;

    // Determine scroll direction
    if (currentScrollY > this.lastScrollY) {
      // Scrolling down, hide navbar
      this.isHidden = true;
    } else {
      // Scrolling up, show navbar
      this.isHidden = false;
    }

    // Update the last scroll position
    this.lastScrollY = currentScrollY;
  }

  ngOnInit(): void {
    this.lastScrollY = window.scrollY;
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.router.url;
        this.isLoggedIn = this.authProvider.authenticated();
        this.showNavBar = this.router.url !== '/login' && this.isLoggedIn;
      });
  }
}
