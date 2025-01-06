import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  DocumentReference,
  DocumentData,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  names: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  idCard: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection = collection(this.firestore, 'users');
  constructor(private firestore: Firestore) {}

  //Read
  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  //Buscar user por ID
  getBookById(userId: string): Observable<User> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return docData(userDoc, { idField: 'id' }) as Observable<User>;
  }

  // Actualizar datos del usuario en Firestore
  updateUserData(userId: string, updatedData: any): Promise<void> {
    const userDoc = doc(this.firestore,  `users/${userId}`);
    return updateDoc(userDoc,updatedData);
  }
}
