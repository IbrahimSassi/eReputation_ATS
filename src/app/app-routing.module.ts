import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent }   from './user/user.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'register',  component: UserComponent },
  { path: 'dashboard',  component: DashboardComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
