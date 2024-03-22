import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { firebaseConfig } from 'src/environments/environment';
import { LandingComponent } from './pages/landing/landing.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { VerifyEmailComponent } from './pages/login/verify-email/verify-email.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BuildingInfoComponent } from './pages/building-info/building-info.component';
import { BuildingOverviewComponent } from './pages/building-info/building-overview/building-overview.component';
import { UserInfoComponent } from './pages/individual-condo/user-info/user-info.component';
import { IndividualCondoComponent } from './pages/individual-condo/individual-condo.component';
import { LocationComponent } from './pages/individual-condo/location/location.component';
import { CondoFeaturesComponent } from './pages/individual-condo/condo-features/condo-features.component';
import { DescriptionComponent } from './pages/individual-condo/description/description.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { RouterModule } from '@angular/router';
import { CondoComponent } from './pages/building-info/condo/condo.component';
import { KeyRegistrationComponent } from './pages/key-registration/key-registration.component';
import { SearchComponent } from './components/search/search.component';
import { BuildingComponent } from './components/building/building.component';
import { LockerComponent } from './pages/building-info/locker/locker.component';
import { ParkingSpotComponent } from './pages/building-info/parking-spot/parking-spot.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { DeleteNotificationDialogComponent } from './pages/notifications/delete-notification-dialog/delete-notification-dialog.component';
import { AddNewPropertyComponent } from './pages/add-new-property/add-new-property.component';
import { AddCondoDialogComponent } from './pages/add-new-property/add-condo-dialog/add-condo-dialog.component';
import { AddLockerDialogComponent } from './pages/add-new-property/add-locker-dialog/add-locker-dialog.component';
import { AddParkingDialogComponent } from './pages/add-new-property/add-parking-dialog/add-parking-dialog.component';
import { EmployeesListComponent } from './pages/my-employees/employees-list/employees-list.component';
import { MyEmployeesComponent } from './pages/my-employees/my-employees.component';
import { BudgetReportComponent } from './pages/building-info/budget-report/budget-report.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { MyPropertiesComponent } from './pages/my-properties/my-properties.component';
import { AddNewBuildingOperationComponent } from './pages/add-new-building-operation/add-new-building-operation.component';
import { RequestPageComponent } from './pages/request-page/request-page.component';
import { EditCondoDialogComponent } from './pages/individual-condo/edit-condo-dialog/edit-condo-dialog.component';
import { BookingsComponent } from './pages/building-info/bookings/bookings.component';
import { BookingCardComponent } from './pages/building-info/bookings/booking-card/booking-card.component';
import { ScheduleComponent } from './pages/building-info/schedule/schedule.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    UserProfileComponent,
    BudgetReportComponent,
    BuildingInfoComponent,
    BuildingOverviewComponent,
    UserInfoComponent,
    IndividualCondoComponent,
    LocationComponent,
    CondoFeaturesComponent,
    DescriptionComponent,
    CondoComponent,
    KeyRegistrationComponent,
    BuildingComponent,
    SearchComponent,
    LockerComponent,
    ParkingSpotComponent,
    NotificationsComponent,
    DeleteNotificationDialogComponent,
    AddNewPropertyComponent,
    AddCondoDialogComponent,
    AddLockerDialogComponent,
    AddParkingDialogComponent,
    EmployeesListComponent,
    MyEmployeesComponent,
    BudgetReportComponent,
    PaymentComponent,
    MyPropertiesComponent,
    AddNewBuildingOperationComponent,
    RequestPageComponent,
    EditCondoDialogComponent,
    BookingsComponent,
    BookingCardComponent,
    ScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgxMapLibreGLModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    // provideFirestore(() => getFirestore()),
    // provideFunctions(() => getFunctions()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    // provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatBadgeModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
