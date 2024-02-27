import { LoginComponent } from './pages/login/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { VerifyEmailComponent } from './pages/login/verify-email/verify-email.component';
import { AuthguardGuard } from './services/auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BuildingInfoComponent } from './pages/building-info/building-info.component';
import { IndividualCondoComponent } from './pages/individual-condo/individual-condo.component';
import { CondoFeaturesComponent } from './pages/individual-condo/condo-features/condo-features.component';
import { DescriptionComponent } from './pages/individual-condo/description/description.component';
import { LocationComponent } from './pages/individual-condo/location/location.component';

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthguardGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthguardGuard],
  },
  { path: 'individual-condo', component: IndividualCondoComponent },
  { path: 'building-info', component: BuildingInfoComponent },
  { path: 'condo-features', component: CondoFeaturesComponent },
  { path: 'description', component: DescriptionComponent },
  { path: 'location', component: LocationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
