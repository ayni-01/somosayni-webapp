import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';

@Component({
  selector: 'sa-root-redirector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p style="padding:24px;color:#6b7280">Redirigiendo...</p>',
})
export class RootRedirector implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);

  ngOnInit(): void {
    const destino = this.auth.estaAutenticado() ? '/app/inicio' : '/auth/login';
    this.router.navigateByUrl(destino, { replaceUrl: true });
  }
}
