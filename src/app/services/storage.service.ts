import { Injectable } from '@angular/core';
import {
  Storage,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  /**
   * Uploads a file to Firebase Storage and returns the download URL and a temporary name.
   * @param file - The file to upload.
   * @param path - The path in Firebase Storage where the file should be stored.
   * @param storage - The Firebase Storage instance to use.
   * @returns A Promise that resolves to a string containing the download URL and temporary name.
   */
  async uploadToFirestore(file: any, path: string): Promise<string> {
    let url = '';
    let tempName = '';
    let storageRef = ref_storage(this.storage, path + file.name);

    try {
      url = await getDownloadURL(storageRef);
    } catch (err) {
      url = '';
    }

    while (url != '' || url == undefined) {
      try {
        tempName = Math.random().toString(36).substring(2);
        storageRef = ref_storage(this.storage, path + tempName + file.name);
        url = await getDownloadURL(storageRef);
      } catch (err) {
        break;
      }
    }
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    });
    const snapshot = await uploadTask;
    let downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL + ',' + tempName;
  }



  /**
   * Deletes a file from Firebase Storage.
   * @param downloadUrl - The download URL of the file in Firebase Storage.
   * @param storage - The Firebase Storage instance to use.
   */
  async deleteFile(downloadUrl: string) {
    const fileRef = ref_storage(this.storage, downloadUrl);
    deleteObject(fileRef)
      .then(() => {
        console.log('File deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  }

}