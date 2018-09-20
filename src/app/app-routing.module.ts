import {NgModule} from '@angular/core';
import {Routes , RouterModule} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {HomeComponent} from './home/home.component';
import {PlatesComponent} from './plates/plates.component';
import {RegisterVialsComponent} from './vials/register-vials/register-vials.component';
import {VialsComponent} from './vials/vials.component';
import {VialsToPlatesComponent} from './vials/vials-to-plates/vials-to-plates.component';

const appRouts: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent},
  // { path: 'recipes', component: RecipesComponent, children: [
  //     { path: '', component: RecipesStartComponent },
  //     { path: 'new', component: RecipeEditComponent, canActivate: [AuthGuard]},
  //     { path: ':id', component: RecipeDetailComponent },
  //     { path: ':id/edit', component: RecipeEditComponent, canActivate: [AuthGuard]},
  //   ] },
  { path: 'vials', component: VialsComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'register-dry'},
      { path: 'register-dry', component: RegisterVialsComponent, data: {type: 'dry'}},
      { path: 'register-dilute', component: RegisterVialsComponent, data: {type: 'dilution'}},
      { path: 'place', component: VialsToPlatesComponent}
    ] },
  { path: 'plates', component: PlatesComponent, children: [] },
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: '**', redirectTo: '/not-found' }

];

@NgModule({
  // imports: [RouterModule.forRoot(appRouts, {useHash: true})],
  imports: [RouterModule.forRoot(appRouts, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
