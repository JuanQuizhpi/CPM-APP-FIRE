import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, Credential } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

interface LogInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  hide = true;

  formBuilder = inject(FormBuilder);
  private authServide = inject(AuthService);
  private _router = inject(Router);

  form: FormGroup<LogInForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('requiered')
        ? 'Campo requerido'
        : 'Ingrese Email Valido';
    }
    return false;
  }

  get isPasswordValid(): string | boolean{
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid){
      return control.hasError('required')
      ? 'Campo requerido'
      :'La contraseña debe tener al menos 6 caracteres'
    }
    return false;
  }

  async logIn(): Promise<void> {
    if (this.form.invalid) return;
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    try {
      const userCredentials=  await this.authServide.logInWithEmailAndPassword(credential);
      console.log(userCredentials);
      this.showWelcomeAlert();
      this._router.navigateByUrl('/')
    } catch (error) {
      console.log(error);
      this.showUnknownUserAlert();
    }
  }

  /**
   * Alestas de acceso al sitio
   */
  showUnknownUserAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Usuario Desconocido',
      confirmButtonText: 'Entendido'
    });
  }
  showWelcomeAlert() {
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: 'Nos alegra verte de nuevo.',
      confirmButtonText: 'Gracias'
    });
  }
}
