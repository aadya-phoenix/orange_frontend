import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from './shared/services/guards/authentication.guards';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate:[AuthenticationServiceGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserModule),
    canActivate:[AuthenticationServiceGuard]
  },
  {
    path: 'message',
    loadChildren: () =>
      import('./message/message.module').then((m) => m.MessageModule),
    canActivate:[AuthenticationServiceGuard]
  },
  {
    path: 'pdltools',
    loadChildren: () =>
      import('./pdltools/pdltools.module').then((m) => m.PdltoolsModule),
    canActivate:[AuthenticationServiceGuard]
  }
  // {
  //   path: 'cources',
  //   loadChildren: () =>
  //     import('./dashboard/create-course/create-course.module').then(
  //       (m) => m.CreateCourseModule
  //     ),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
