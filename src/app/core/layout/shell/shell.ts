import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from '../../auth/auth.store';
import { RolUsuario } from '../../../shared/models/usuario.model';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuario;

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

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }
}
