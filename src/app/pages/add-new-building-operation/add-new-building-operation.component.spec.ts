import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AddNewBuildingOperationComponent } from './add-new-building-operation.component';
import { BuildingService } from 'src/app/services/building.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Database } from 'firebase/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
// Mock AuthService
class MockAuthService {
    getUser() {
        // Provide a mock implementation
        return Promise.resolve({ uid: 'mockUserId', photoURL: 'mockPhotoURL' });
    }
}

// Mock BuildingService
class MockBuildingService {
    // Provide mock implementations of methods used in the component
}

// Mock UserService
class MockUserService {
    // Provide mock implementations of methods used in the component
}

// Mock Database
class MockDatabase {
    // Provide mock implementations of methods used in the component
}

// Mock AngularFirestore
const firestoreStub = {
    collection: () => ({
        valueChanges: () => ({
            subscribe: () => { }
        }),
        doc: () => ({
            valueChanges: () => ({
                subscribe: () => { }
            }),
            set: () => Promise.resolve(),
            update: () => Promise.resolve(),
            delete: () => Promise.resolve()
        })
    })
};

describe('AddNewBuildingOperationComponent', () => {
    let component: AddNewBuildingOperationComponent;
    let fixture: ComponentFixture<AddNewBuildingOperationComponent>;
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddNewBuildingOperationComponent],
            imports: [ReactiveFormsModule, MatSelectModule, MatOptionModule],
            providers: [
                { provide: BuildingService, useClass: MockBuildingService },
                { provide: AuthService, useClass: MockAuthService },
                { provide: UserService, useClass: MockUserService },
                { provide: Database, useClass: MockDatabase }, // Provide mock Database service
                { provide: AngularFirestore, useValue: firestoreStub } // Provide AngularFireFirestore mock
            ]
        })
            .compileComponents();
        formBuilder = TestBed.inject(FormBuilder);
        formGroup = formBuilder.group({
            building: '' // Mocking the building form control
            // other form controls if necessary
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddNewBuildingOperationComponent);
        component = fixture.componentInstance;
        component.operationForm = formGroup;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a valid operationForm initially', () => {
        expect(component.operationForm.valid).toBeFalsy();
    });

    it('should set operationName as required', () => {
        let operationName = component.operationForm.controls['operationName'];
        expect(operationName.valid).toBeFalsy();

        let errors = operationName.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeTruthy();

        operationName.setValue('Test Operation');
        errors = operationName.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeFalsy();
    });

    it('should set description as required', () => {
        let description = component.operationForm.controls['description'];
        expect(description.valid).toBeFalsy();

        let errors = description.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeTruthy();

        description.setValue('Test Description');
        errors = description.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeFalsy();
    });

    it('should set cost as required and with valid pattern', () => {
        let cost = component.operationForm.controls['cost'];
        expect(cost.valid).toBeFalsy();

        let errors = cost.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeTruthy();

        cost.setValue('Invalid Cost');
        errors = cost.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        cost.setValue('10.50');
        errors = cost.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    });

    it('should set building as required', () => {
        let building = component.operationForm.controls['building'];
        expect(building.valid).toBeFalsy();

        let errors = building.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeTruthy();

        // Simulating selecting a building
        building.setValue('Test Building');
        errors = building.errors || {} as { [key: string]: any };
        expect(errors['required']).toBeFalsy();
    });
    it('should call onSubmit method', () => {
        spyOn(component, 'onSubmit');
        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        expect(component.onSubmit).toHaveBeenCalled();
    });

});
