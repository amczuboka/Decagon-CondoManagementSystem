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
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
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
import { BuildingOverviewComponent } from './components/building-overview/building-overview.component';
import { UserInfoComponent } from './pages/individual-condo/user-info/user-info.component';
import { IndividualCondoComponent } from './pages/individual-condo/individual-condo.component';
import { LocationComponent } from './pages/individual-condo/location/location.component';
import { CondoFeaturesComponent } from './pages/individual-condo/condo-features/condo-features.component';
import { DescriptionComponent } from './pages/individual-condo/description/description.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { RouterModule } from '@angular/router';
import { CondoComponent } from './components/condo/condo.component';
import { KeyRegistrationComponent } from './components/key-registration/key-registration.component';
import { SearchComponent } from './components/search/search.component';
import { BuildingComponent } from './components/building/building.component';
import { LockerComponent } from './components/locker/locker.component';
import { ParkingSpotComponent } from './components/parking-spot/parking-spot.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { DeleteNotificationDialogComponent } from './components/delete-notification-dialog/delete-notification-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { MyEmployeesComponent } from './pages/my-employees/my-employees.component';

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
    EmployeesListComponent,
    MyEmployeesComponent,
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
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
