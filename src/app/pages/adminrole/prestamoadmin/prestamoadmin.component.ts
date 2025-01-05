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

@Component({
  selector: 'app-prestamoadmin',
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
    MatSortModule,MatOptionModule
  ],
  templateUrl: './prestamoadmin.component.html',
  styleUrl: './prestamoadmin.component.scss',
})
export class PrestamoadminComponent implements OnInit {
  prestamos: Prestamo[] = [];
  dataSource = new MatTableDataSource<Prestamo>();
  searchText: string = '';
  searchField: string = 'title';

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.prestamoService.getPrestamos().subscribe((prestamos) => {
      this.dataSource.data = prestamos;
    });
  }

  displayedColumns: string[] = [
    'bookId',
    'title',
    'author',
    'borrowedAt',
    'returnAt',
    'estado',
    'studentName',
    'studentEmail',
    'studentidCard',
    'studentphone',
    'actions', // Botones para acciones futuras
  ];

  // Aplicar filtro de búsqueda
  applyFilter(): void {
    const normalizeSearch = this.normalizeText(this.searchText);
    this.dataSource.filterPredicate = (data: Prestamo, filter: string) => {
      const field = data[this.searchField as keyof Prestamo]?.toString() || '';
      return this.normalizeText(field).includes(filter);
    };
    this.dataSource.filter = normalizeSearch;
  }

  // Normalizar texto para evitar problemas con mayúsculas, tildes, etc.
  private normalizeText(text: string): string {
    return text
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  deletePrestamo(prestamoId: string): void {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el prestamo de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.prestamoService
            .deletePrestamo(prestamoId)
            .then(() => {
              Swal.fire({
                title: 'Eliminado',
                text: 'El Prestamo ha sido eliminado correctamente.',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
              });
            })
            .catch((error) => {
              console.error('Error eliminando Prestamo:', error);
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al eliminar el prestamo.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false,
              });
            });
        }
      });
    }
}
