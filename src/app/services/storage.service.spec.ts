import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(StorageService);
    const authService = TestBed.inject(AuthService);
    await authService.SignIn('dojefe6817@giratex.com','123456');
  });

  afterEach(async () => {
    const authService = TestBed.inject(AuthService);
    await authService.SignOut();
  });

  it('should upload a file to Firebase Storage and return the download URL and deletes it', async () => {
    // Arrange
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const path = 'test/';

    // Act
    const result = await service.uploadToFirestore(file, path);

    // Assert
    expect(result).toContain(file.name);
    await service.deleteFile(path + file.name);
  });
});