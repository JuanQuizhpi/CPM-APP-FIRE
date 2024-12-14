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

interface SignUpForm {
  names: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
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
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  signUp():void{
    if(this.form.invalid) return;
    console.log(this.form.value)
  }
}
