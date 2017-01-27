import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent }   from './user/user.component';
const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'register',  component: UserComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
