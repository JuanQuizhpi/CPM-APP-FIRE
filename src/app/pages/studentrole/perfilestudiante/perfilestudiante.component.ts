import { Component, OnInit } from '@angular/core';
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
    MatOptionModule,MatCardModule
  ],
  templateUrl: './perfilestudiante.component.html',
  styleUrl: './perfilestudiante.component.scss',
})
export class PerfilestudianteComponent implements OnInit {
  constructor(private authService: AuthService) {}

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

  ngOnInit(): void {
    this.getUserEmail();
  }

  //Metodo para cambair de clave
  currentPassword: string = ''; // Contraseña actual
  newPassword: string = ''; // Nueva contraseña

  // Cambiar contraseña del usuario
  async changePassword() {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error('No hay usuario autenticado');
        return;
      }

      // Reautenticación
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        this.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Actualización de la contraseña
      await updatePassword(currentUser, this.newPassword);
      console.log('Contraseña actualizada correctamente');
      alert('Contraseña actualizada correctamente');
    } catch (error: any) {
      console.error('Error al actualizar la contraseña:', error.message);
      alert(`Error al actualizar la contraseña: ${error.message}`);
    }
  }
}
