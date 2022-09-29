import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { OlTestCreateScormComponent } from './ol-test-create-scorm/ol-test-create-scorm.component';
import { OlTestCreateComponent } from './ol-test-create/ol-test-create.component';
import { OlTestListComponent } from './ol-test-list/ol-test-list.component';
import { OlTestViewComponent } from './ol-test-view/ol-test-view.component';

const routes: Routes = [
   { path: '', component: OlTestListComponent, canActivate: [AuthenticationServiceGuard] },
   { path: 'create/orange', component: OlTestCreateComponent, canActivate: [AuthenticationServiceGuard] },
   { path: 'create/scorm', component: OlTestCreateScormComponent, canActivate: [AuthenticationServiceGuard] },
   { path: 'view/:id', component: OlTestViewComponent, canActivate: [AuthenticationServiceGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OlTestRoutingModule { }
