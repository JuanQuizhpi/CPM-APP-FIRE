import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { error } from 'console';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/users.service';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AuthService } from '../../../core/services/auth.service';
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-perfilestudiante',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatOptionModule,
    MatCardModule,
  ],
  templateUrl: './perfilestudiante.component.html',
  styleUrl: './perfilestudiante.component.scss',
})
export class PerfilestudianteComponent implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      names: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      idCard: [{ value: '', disabled: true }],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]], // Contraseña actual requerida
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // Nueva contraseña: requerida y mínimo 6 caracteres
    });
  }

  //Metodos para obtener los usuarios
  userEmail: string | null = null;
  user: any;

  async getUserEmail() {
    this.authService.authState$.subscribe(async (user) => {
      if (user) {
        //this.userEmail = user.email;
        this.user = user;
        this.userEmail = user.email;
        console.log('Correo del usuario autenticado', this.user);
        //console.log('Correo del usuario autenticado', this.userEmail);
      } else {
        this.userEmail = null;
        this.user = null;
        console.log('No hay usuario autenticado');
      }
    });
  }

  //Metodo para obtener los datos del usuario para actualizarlos
  userData: any = null;
  async getUserData() {
    if (this.userEmail) {
      this.userData = await this.authService.getUserDataByEmail(this.userEmail);
      console.log('User Data:', this.userData);
      // Asignar los valores al formulario
      this.form.patchValue({
        names: this.userData?.names,
        lastName: this.userData?.lastName,
        phone: this.userData?.phone,
        idCard: this.userData?.idCard,
      });
    }
  }

  // Método para actualizar los datos si es necesario
  /*updateData() : void {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      // Llama al servicio para actualizar los datos
    }
  }*/

  updateData(): void {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'warning',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas actualizar los datos del usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#148f77',
      cancelButtonColor: '#7d3c98',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Obtener una copia de los valores del formulario
        const updatedUser = { ...this.form.value };

        this.userService
          .updateUserData(this.userData.id, updatedUser)
          .then(() => {
            Swal.fire({
              title: 'Actualizado',
              text: 'El Usuario ha sido actualizado correctamente.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
            }).then(() => {
              this.form.reset();
            });
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar el Usuario.',
              icon: 'error',
            });
          });
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'La actualización ha sido cancelada.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  ngOnInit(): void {
    this.getUserEmail();
  }

  //Metodo para cambair de clave
  currentPassword: string = ''; // Contraseña actual
  newPassword: string = ''; // Nueva contraseña

  // Cambiar contraseña del usuario
  
  async changePassword() {
    try {
      if (this.passwordForm.invalid) {
        // Mostrar mensaje de error si el formulario es inválido
        Swal.fire({
          title: 'Formulario inválido',
          text: 'Por favor, completa todos los campos correctamente.',
          icon: 'warning',
        });
        return;
      }

      // Confirmación antes de proceder con la actualización
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas actualizar tu contraseña?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#148f77',
        cancelButtonColor: '#7d3c98',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'No, cancelar',
      });

      if (result.isConfirmed) {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          // Mostrar mensaje si no hay un usuario autenticado
          Swal.fire({
            title: 'Error',
            text: 'No hay usuario autenticado.',
            icon: 'error',
          });
          return;
        }

        const { currentPassword, newPassword } = this.passwordForm.value;

        // Reautenticación
        const credential = EmailAuthProvider.credential(
          currentUser.email!,
          currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);

        // Actualización de la contraseña
        await updatePassword(currentUser, newPassword);

        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Éxito',
          text: 'Contraseña actualizada correctamente.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
        });

        // Resetear el formulario tras el éxito
        this.passwordForm.reset();
      } else {
        // Mostrar mensaje si el usuario cancela la acción
        Swal.fire({
          title: 'Cancelado',
          text: 'La actualización de contraseña ha sido cancelada.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      // Mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: `No se pudo actualizar la contraseña. La contraseña actual ingresada es incorrecta.`,
        icon: 'error',
      });
      console.error('Error al actualizar la contraseña:', error.message);
    }
  }
}
