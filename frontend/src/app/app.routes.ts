import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { coordinadorGuard } from './core/guards/roles.guard';

export const routes: Routes = [
  // Ruta pública
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
      .then(m => m.LoginComponent)
  },

  // Rutas protegidas
  {
    path: 'personas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/personas/lista-personas/lista-personas')
      .then(m => m.ListaPersonas)
  },
  {
    path: 'personas/nueva',
    canActivate: [authGuard, coordinadorGuard],
    loadComponent: () =>
      import('./features/personas/form-persona/form-persona')
      .then(m => m.FormPersona)
  },
  {
    path: 'personas/:id/editar',
    canActivate: [authGuard, coordinadorGuard],
    loadComponent: () =>
      import('./features/personas/form-persona/form-persona')
      .then(m => m.FormPersona)
  },
  {
    path: 'personas/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/personas/ficha-persona/ficha-persona')
      .then(m => m.FichaPersona)
  },
  {
  path: 'personas/:id/pai/nuevo',
  canActivate: [authGuard, coordinadorGuard],
  loadComponent: () =>
    import('./features/pai/form-pai/form-pai')
    .then(m => m.FormPai)
},
  {
    path: 'personas/:id/pai',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pai/vista-pai/vista-pai')
      .then(m => m.VistaPai)
  },

  // Solo coordinador
  {
    path: 'usuarios',
    canActivate: [authGuard, coordinadorGuard],
    loadComponent: () =>
      import('./features/usuarios/lista-usuarios/lista-usuarios')
      .then(m => m.ListaUsuarios)
  },
  {
    path: 'usuarios/nuevo',
    canActivate: [authGuard, coordinadorGuard],
    loadComponent: () =>
      import('./features/usuarios/form-usuario/form-usuario')
      .then(m => m.FormUsuario)
  },

  // Redirecciones
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  { path: '**', redirectTo: 'personas' },
];
