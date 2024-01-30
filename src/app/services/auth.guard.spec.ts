import { TestBed } from '@angular/core/testing';

import { AuthguardGuard } from './auth.guard';
import { AppModule } from '../app.module';

describe('AuthguardGuard', () => {
  let guard: AuthguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    guard = TestBed.inject(AuthguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
