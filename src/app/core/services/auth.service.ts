import { inject, Injectable } from '@angular/core';
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
  docData,setDoc
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';

export interface Credential {
  email: string;
  password: string;
  names: string;
  lastName: string;
  phone: string;
  idcard: string;
}

//Correos administradores
const ADMIN_EMAILS = ['admin1@ucuenca.edu.ec', 'admin2@ucuenca.edu.ec'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  readonly authState$ = authState(this.auth);

  private firestore: Firestore = inject(Firestore);

  /*
  signUpWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );
  }*/

  // Registro con datos adicionales

  async signUpWithEmailAndPassword(
    credential: Credential
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );

    // Guardar datos adicionales en Firestore
    const userRole = this.getUserRole(credential.email);
    const userDoc = doc(this.firestore, `users/${userCredential.user.uid}`);

    await setDoc(userDoc, {
      email: credential.email,
      role: userRole,
      names: credential.names,
      lastName: credential.lastName,
      phone: credential.phone,
      idCard: credential.idcard,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  }

  logInWithEmailAndPassword(credential: Credential) {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );
  }

  logOut(): Promise<void> {
    return this.auth.signOut();
  }

  //Metodo Roles de usuario
  getUserRole(email: string): 'admin' | 'student' {
    return ADMIN_EMAILS.includes(email) ? 'admin' : 'student';
  }
}
