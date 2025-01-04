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
    'publishedYear',
    'availability',
    'actions',
  ];

  constructor(private bookService: BookService, private router: Router) {}

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
}
