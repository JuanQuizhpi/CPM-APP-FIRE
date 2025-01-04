import { Component, OnInit } from '@angular/core';
import { BookService, Book } from '../../../core/services/books.service';
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

import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-libroestudiante',
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
  ],
  templateUrl: './libroestudiante.component.html',
  styleUrl: './libroestudiante.component.scss',
})
export class LibroestudianteComponent implements OnInit {
  books: Book[] = [];

  displayedColums: string[] = [
    'title',
    'author',
    'editorial',
    'edicion',
    'publishedYear',
    'bibliografiaSGS',
    'availability',
    'actions',
  ];
  constructor(
    private bookService: BookService,
    private router: Router,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.dataSource.data = books;
    });
  }

  dataSource = new MatTableDataSource<Book>();
  searchText: string = '';
  searchField: string = 'title';

  applyFilter(): void {
    const normalizeSearch = this.normalizeText(this.searchText);
    this.dataSource.filterPredicate = (data: Book, filter: string) => {
      const field = data[this.searchField as keyof Book] as string | number;
      return this.normalizeText(field?.toString() || '').includes(filter);
    };
    this.dataSource.filter = normalizeSearch;
  }

  private normalizeText(text: string): string {
    return text
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  redirectToMakePrestamo(): void {
    console.log('Nos vamos a generar el prestamo');
  }

  /**
   * Muestra la bibliografía del libro en una alerta de SweetAlert.
   * @param book El libro cuya bibliografía se desea mostrar.
   */

  showBibliography(book: Book): void {
    // Validación para evitar errores si no existe el atributo bibliografiaSGS
    if (!book.bibliografiaSGS || book.bibliografiaSGS.trim() === '') {
      Swal.fire({
        title: 'Error',
        text: 'Este libro no tiene una bibliografía asociada.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    const bibliography = book.bibliografiaSGS;

    Swal.fire({
      title: 'Bibliografía',
      html: `<p>${bibliography}</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Copiar y cerrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Copiamos la bibliografía al portapapeles
        this.clipboard.copy(bibliography);
        Swal.fire(
          'Copiado',
          'La bibliografía se copió al portapapeles.',
          'success'
        );
      }
    });
  }
}
