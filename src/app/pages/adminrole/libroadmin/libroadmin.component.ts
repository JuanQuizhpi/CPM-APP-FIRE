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

@Component({
  selector: 'app-libroadmin',
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
  templateUrl: './libroadmin.component.html',
  styleUrl: './libroadmin.component.scss',
})
export class LibroadminComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private router: Router) {}

  /*
  loadBooks(): void {
    this.bookServie.getBooks().subscribe((books) => {
      this.books = books;
    });
  }*/

  ngOnInit(): void {
    //this.loadBooks();
    this.bookService.getBooks().subscribe((books) => {
      this.dataSource.data = books;
    });
  }

  displayedColums: string[] = [
    'idbibliografia',
    'title',
    'author',
    'editorial',
    'edicion',
    'city',
    'publishedYear',
    'bibliografiaSGS',
    'categoria',
    'availability',
    'actions',
  ];
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

  redirectToAddBook(): void {
    this.router.navigate(['/crearlibrosAdmin']); // Asegúrate de que el path coincida con el definido en tus rutas
  }

  //Metodo para Eliminar libro
  deleteBook(bookId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el libro de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService
          .deleteBook(bookId)
          .then(() => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El libro ha sido eliminado correctamente.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error('Error eliminando libro:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el libro.',
              icon: 'error',
              timer: 3000,
              showConfirmButton: false,
            });
          });
      }
    });
  }

  editBook(book: Book): void {
    Swal.fire({
      title: '¿Editar libro?',
      text: `¿Quieres editar el libro "${book.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Navegar al componente de edición con el ID del libro
        this.router.navigate(['/actualizarlibrosAdmin', book.id]);
      }
    });
  }

  descargarLibros() {
    console.log('Método descargarLibros llamado');
    this.bookService.downloadBooksAsCSV()
      .then(() => console.log('Descarga completada.'))
      .catch(err => console.error('Error en la descarga:', err));
  }
  
}
