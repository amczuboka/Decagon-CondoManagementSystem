import { Injectable } from '@angular/core';
import {
  Storage,
  ref as ref_storage,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Database, child, onValue, ref as ref_data } from 'firebase/database';
import { getStorage, listAll } from 'firebase/storage';

/**
 * Service for interacting with Firebase Storage and Realtime Database.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  /**
   * Uploads a file to Firebase Storage and returns the download URL and a temporary name.
   *
   * @param file - The file to upload.
   * @param path - The path in Firebase Storage where the file should be stored.
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
    return downloadURL;
  }

  /**
   * Deletes a file from Firebase Storage.
   *
   * @param downloadUrl - The download URL of the file in Firebase Storage.
   */
  async deleteFile(downloadUrl: string): Promise<void> {
    const fileRef = ref_storage(this.storage, downloadUrl);
    deleteObject(fileRef)
      .then(() => {
        console.log('File deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  }

  /**
   * Generates a unique ID for storing data in the Firebase Realtime Database.
   *
   * @param path - The path in the database where the ID will be used.
   * @param database - The Firebase Database instance to use.
   * @returns A unique ID as a string.
   */
  async IDgenerator(path: string, database: Database): Promise<string> {
    let id = '';
    let isGood = false;
    let data: never[] | null | undefined = [];
    const dbRef = ref_data(database);
    while (!isGood) {
      try {
        id = (Math.random().toString(36).substring(2) + Date.now()).replace(
          /\s/g,
          ''
        );
        let databaseRef = child(dbRef, path + id);
        onValue(databaseRef, (snapshot) => {
          data = snapshot.val();
        });
        if (data == null || data == undefined || data.length == 0) {
          isGood = true;
        }
      } catch (err) {
        break;
      }
    }

    return id;
  }

  /**
   * Deletes all files within a specified folder in the storage.
   *
   * @param {string} path - The path of the folder in the storage.
   * @returns A Promise that resolves when all files in the folder have been deleted.
   * @throws Will throw an error if the deletion operation fails or if the files cannot be listed.
   */
  async deleteFolderContents(path: string): Promise<void> {
    const storage = getStorage();
    const folderRef = ref_storage(storage, path);

    listAll(folderRef)
      .then((res) => {
        res.items.forEach((fileRef) => {
          deleteObject(fileRef)
            .then(() => {
              console.log('File deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting file:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error listing files:', error);
      });
  }
}
