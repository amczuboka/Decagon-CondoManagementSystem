import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { getDatabase } from 'firebase/database';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(StorageService);
    const authService = TestBed.inject(AuthService);
    await authService.SignIn('dojefe6817@giratex.com', '123456');
  });

  afterEach(async () => {
    const authService = TestBed.inject(AuthService);
    await authService.SignOut();
    service.deleteFolderContents('test/');
  });

  it('should upload a file to Firebase Storage and return the download URL and deletes it', async () => {
    // Arrange
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const path = 'test/';

    // Act
    const result = await service.uploadToFirestore(file, path);

    // Assert
    expect(result).toContain(file.name);
    await service.deleteFile(result);
  });

  it('should delete the folder', async () => {
    // Arrange
    const file = new File(['file content'], 'test.txt', {
      type: 'text/plain',
    });
    const path = 'test/';

    // Act
    const result = await service.uploadToFirestore(file, path);

    // Assert
    expect(result).toContain(file.name);
    await expectAsync(service.deleteFolderContents(path)).toBeResolved();
  });

  it('should delete the file', async () => {
    // Arrange
    const file = new File(['file content'], 'test.txt', {
      type: 'text/plain',
    });
    const path = 'test/';

    // Act
    const result = await service.uploadToFirestore(file, path);

    // Assert
    expect(result).toContain(file.name);

    await expectAsync(service.deleteFile(result)).toBeResolved();
  });



  it('should generate a unique ID', async () => {
    // Arrange
    const path = 'test/';
    const database = getDatabase();
    // Act
    const result = await service.IDgenerator(path, database);
    // Assert
    expect(result).toBeTruthy();
  });
});
