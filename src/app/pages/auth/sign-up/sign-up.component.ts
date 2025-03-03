import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, Credential } from '../../../core/services/auth.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';

interface SignUpForm {
  names: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  phone: FormControl<string>;
  idcard: FormControl<string>;
}

//Validador personalizado @ucuenca.edu.ec
export function emailUCuencaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    //const emailPattern = /^[a-z]+\.[a-z]+@ucuenca\.edu\.ec$/;
    const emailPattern = /@ucuenca\.edu\.ec$/;
    const isValid = emailPattern.test(control.value || '');
    return isValid ? null : { invalidEmail: true };
  };
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    MatSnackBarModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  hide = true;

  formBuilder = inject(FormBuilder);

  form: FormGroup<SignUpForm> = this.formBuilder.group({
    names: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.email,
        emailUCuencaValidator(),
      ],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
    phone: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
      ],
      nonNullable: true,
    }),
    idcard: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(10)],
      nonNullable: true,
    }),
  });

  private authService = inject(AuthService);
  private _router = inject(Router);

  get isEmailValid(): string | boolean {
    const control = this.form.get('email');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      if (control.hasError('required')) {
        return 'Campo requerido';
      } else if (control.hasError('email')) {
        return 'Ingrese un email valido';
      } else if (control.hasError('invalidEmail')) {
        return 'El correo debe ser de la institucion (@ucuenca.edu.ec)';
      }
    }
    return false;
  }

  get isPasswordValid(): string | boolean {
    const control = this.form.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'Campo requerido'
        : 'La contraseña debe tener al menos 6 caracteres';
    }
    return false;
  }

  async signUp(): Promise<void> {
    if (this.form.invalid) return;

    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      names: this.form.value.names || '',
      lastName : this.form.value.lastName || '',
      phone: this.form.value.phone || '',
      idcard:this.form.value.idcard || ''
    };

    try {
      const userCredentials = await this.authService.signUpWithEmailAndPassword(
        credential
      );
      console.log(userCredentials);
      this._router.navigateByUrl('/');
      this.showUserCreatedAlert();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.showCorreoDuplicadoAlert();
      }
      console.error(error);
    }
  }

  /**
   * Alertas de acceso al sitio
   */
  showUserCreatedAlert() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario creado exitosamente.',
      confirmButtonText: 'Aceptar',
    });
  }

  showCorreoDuplicadoAlert() {
    Swal.fire({
      icon: 'warning',
      title: '¡Advertencia!',
      text: 'Correo ya Registrado.',
      confirmButtonText: 'Aceptar',
    });
  }
}
