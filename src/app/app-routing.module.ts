import { LoginComponent } from './pages/login/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { VerifyEmailComponent } from './pages/login/verify-email/verify-email.component';
import { AuthguardGuard } from './services/auth.guard';
import { CompanyGuard } from './services/company.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BuildingInfoComponent } from './pages/building-info/building-info.component';
import { IndividualCondoComponent } from './pages/individual-condo/individual-condo.component';
import { KeyRegistrationComponent } from './pages/key-registration/key-registration.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { AddNewPropertyComponent } from './pages/add-new-property/add-new-property.component';
import { MyEmployeesComponent } from './pages/my-employees/my-employees.component';
import { BudgetReportComponent } from './pages/building-info/budget-report/budget-report.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { MyPropertiesComponent } from './pages/my-properties/my-properties.component';
import { AddNewBuildingOperationComponent } from './pages/add-new-building-operation/add-new-building-operation.component';

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
  {
    path: 'budget-report',
    component: BudgetReportComponent,
    canActivate: [AuthguardGuard, CompanyGuard],
  },
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
    path: 'individual-condo/:buildingId/:condoId',
    component: IndividualCondoComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'add-new-property',
    component: AddNewPropertyComponent,
    canActivate: [AuthguardGuard, CompanyGuard],
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'my-employees',
    component: MyEmployeesComponent,
    canActivate: [AuthguardGuard, CompanyGuard],
  },
  {
    path: 'my-properties',
    component: MyPropertiesComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: "add-new-building-operation",
    component: AddNewBuildingOperationComponent,
    canActivate: [AuthguardGuard],
  },
  //This has to be at the last path
  { path: '**', redirectTo: '', canActivate: [AuthguardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
