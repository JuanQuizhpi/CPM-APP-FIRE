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
import { UserService, User } from '../../../core/services/users.service';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  PrestamoService,
  Prestamo,
} from '../../../core/services/prestamo.service';
import { AuthService } from '../../../core/services/auth.service';
import { user } from '@angular/fire/auth';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-prestamoestudiante',
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
    MatOptionModule,MatSelectModule
  ],
  templateUrl: './prestamoestudiante.component.html',
  styleUrl: './prestamoestudiante.component.scss',
})
export class PrestamoestudianteComponent implements OnInit {
  prestamos: Prestamo[] = [];
  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = [
    'bookId',
    'title',
    'author',
    'borrowedAt',
    'returnAt',
    'estado',
    //'actions',
  ];

  constructor(
    private prestamoService: PrestamoService,
    private authService: AuthService
  ) {}

  listarPrestamos(): void {
    this.getUserEmail();
    if (this.userEmail) {
      this.prestamoService
        .getPrestamosByEmail(this.userEmail)
        .subscribe((prestamos) => {
          //Aplicamos el filtro en funcion del estado
          //this.prestamos = prestamos;
          this.prestamos = this.filtrarPorEstado(prestamos);
          this.dataSource.data = this.prestamos;
        });
    } else {
      console.log('El correo del usuario es nulo.');
    }
  }

  ngOnInit(): void {
    //Usamos para encontar por primera vez el usuario
    this.getUserEmail();
  }

  // Método para filtrar los préstamos por estado
  filtrarPorEstado(prestamos: Prestamo[]): Prestamo[] {
    if (this.estadoSeleccionado === 'Activo') {
      return prestamos.filter((prestamo) => prestamo.estado===true);
    } else if (this.estadoSeleccionado === 'Cancelado') {
      return prestamos.filter((prestamo) => !prestamo.estado);
    }
    return prestamos; // "Todos" - Sin filtrar
  }

  //Metodo para obtener loslibros automaticamente los libros por prestamo
  userEmail: string | null = null;

  estadoSeleccionado: string = 'Todos';

  async getUserEmail() {
    this.authService.authState$.subscribe(async (user) => {
      if (user) {
        this.userEmail = user.email;
        console.log('Correo del usuario autenticado', this.userEmail);
      } else {
        this.userEmail = null;
        console.log('No hay usuario autenticado');
      }
    });
  }
}
