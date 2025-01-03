import { inject, Injectable } from '@angular/core';
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
}

//Correos administradores
const ADMIN_EMAILS = ['admin1@ucuenca.edu.ec','admin2@ucuenca.edu.ec'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {  
  private auth: Auth = inject(Auth);

  readonly authState$ = authState(this.auth);

  signUpWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );
  }

  logInWithEmailAndPassword(credential: Credential) {
    return signInWithEmailAndPassword(
      this.auth,
      credential.email,
      credential.password
    );
  }

  logOut(): Promise<void>{
    return this.auth.signOut();
  }

  //Metodo Roles de usuario
  getUserRole(email:string): 'admin' |'student'{
    return ADMIN_EMAILS.includes(email) ? 'admin':'student';
  }

}
