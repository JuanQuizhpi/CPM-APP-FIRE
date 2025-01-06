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
  docData,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  User,
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

  // Registro con datos adicionales
  getUserEmail(): string | null {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }

  // Método para obtener datos del usuario por correo
  async getUserDataByEmail(email: string): Promise<any> {
    try {
      // Referencia a la colección 'users'
      const usersCollection = collection(this.firestore, 'users');

      // Realizar la consulta para obtener el documento del usuario
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si encontramos el documento, devolver los datos del primer usuario encontrado
        //return querySnapshot.docs[0].data();
        // Si encontramos el documento, devolver un objeto que incluya el ID del documento
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() }; // Agregamos el `id` al objeto
      } else {
        console.error('No user found with this email');
        return null; // No se encontró el usuario
      }
    } catch (error) {
      console.error('Error fetching user from Firestore:', error);
      return null;
    }
  }

  // Método para obtener un usuario por su correo
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
