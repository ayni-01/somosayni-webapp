import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from '../../auth/auth.store';
import { RolUsuario } from '../../../shared/models/usuario.model';
import { NotificacionesBell } from '../../notificaciones/notificaciones-bell/notificaciones-bell';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: RolUsuario[];
}

const ITEMS: NavItem[] = [
  { label: 'Inicio',              icon: 'dashboard',         route: '/app/inicio',                       roles: ['TALENTO', 'EMPRESA'] },
  { label: 'Retos',               icon: 'emoji_events',      route: '/app/postulaciones/explorar',       roles: ['TALENTO', 'EMPRESA'] },
  { label: 'Mis Postulaciones',   icon: 'fact_check',        route: '/app/postulaciones/mis-postulaciones', roles: ['TALENTO'] },
  { label: 'Portafolio',          icon: 'workspace_premium', route: '/app/gamificacion/portafolio',      roles: ['TALENTO'] },
  { label: 'Mi Resumen',          icon: 'insights',          route: '/app/analitica/talento',            roles: ['TALENTO'] },
  { label: 'Mi Perfil',           icon: 'account_circle',    route: '/app/identidad/perfil',             roles: ['TALENTO'] },
  { label: 'Mis Retos',           icon: 'flag',              route: '/app/postulaciones/mis-retos',      roles: ['EMPRESA'] },
  { label: 'Publicar Reto',       icon: 'add_box',           route: '/app/postulaciones/publicar',       roles: ['EMPRESA'] },
  { label: 'Panel de Impacto',    icon: 'insights',          route: '/app/analitica/empresa',            roles: ['EMPRESA'] },
  { label: 'Perfil Corporativo',  icon: 'business',          route: '/app/identidad/empresa',            roles: ['EMPRESA'] },
];

@Component({
  selector: 'sa-shell',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, RouterOutlet,
    MatIconModule, MatButtonModule, MatToolbarModule,
    MatSidenavModule, MatListModule, MatMenuModule, MatDividerModule,
    NotificacionesBell,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly breakpoint = inject(BreakpointObserver);

  readonly usuario = this.auth.usuario;
  readonly esMobile = signal(false);
  readonly sidenavAbierto = signal(true);

  readonly subtitulo = computed(() => {
    const rol = this.usuario()?.rol;
    if (rol === 'EMPRESA') return 'Plataforma de Retos';
    return 'Flujo de Talento';
  });

  readonly items = computed<NavItem[]>(() => {
    const rol = this.usuario()?.rol;
    if (!rol) return [];
    return ITEMS.filter(i => i.roles.includes(rol));
  });

  readonly modoSidenav = computed(() => this.esMobile() ? 'over' as const : 'side' as const);

  constructor() {
    this.breakpoint.observe('(max-width: 1024px)')
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        const mobile = state.matches;
        this.esMobile.set(mobile);
        this.sidenavAbierto.set(!mobile);
      });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        if (this.esMobile()) this.sidenavAbierto.set(false);
      });
  }

  alternarSidenav(): void {
    this.sidenavAbierto.update(v => !v);
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }
}
