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
import { KeyRegistrationComponent } from './components/key-registration/key-registration.component';
import { CondoComponent } from './components/condo/condo.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [AuthguardGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  {
    path: 'key-registration',
    component: KeyRegistrationComponent,
    canActivate: [AuthguardGuard],
  },
  { path: 'condo', component: CondoComponent, canActivate: [AuthguardGuard] },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'building-info',
    component: BuildingInfoComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'individual-condo',
    component: IndividualCondoComponent,
    canActivate: [AuthguardGuard],
  },
  { path: '**', redirectTo: '', canActivate: [AuthguardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
