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
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizarlibro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,MatSelectModule,CommonModule,NgIf
  ],
  templateUrl: './actualizarlibro.component.html',
  styleUrl: './actualizarlibro.component.scss',
})
export class ActualizarlibroComponent implements OnInit {
  bookId!: string;
  bookForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      editorial: [''],
      city: [''],
      publishedYear: [null, Validators.required],
      availability: [true],
    });
    // Obtener el ID del libro desde la ruta
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.loadBookDetails();
  }

  loadBookDetails(): void {
    this.bookService.getBookById(this.bookId).subscribe((book) => {
      this.bookForm = this.formBuilder.group({
        title: [book.title, Validators.required],
        author: [book.author, Validators.required],
        editorial: [book.editorial],
        city: [book.city],
        publishedYear: [book.publishedYear, Validators.required],
        availability: [book.availability]
      });
    });
  }

  saveChanges(): void {
    if (this.bookForm.invalid) return;
  
    // Obtener una copia de los valores del formulario
    const updatedBook = { ...this.bookForm.value };
  
    // Asegurar que availability sea un valor booleano
    updatedBook.availability = updatedBook.availability === 'true' ? true : updatedBook.availability;
    updatedBook.availability = updatedBook.availability === 'false' ? false : updatedBook.availability;
  
    // Actualizar el libro en Firestore
    this.bookService.updateBook(this.bookId, updatedBook).then(() => {
      Swal.fire({
        title: 'Actualizado',
        text: 'El libro ha sido actualizado correctamente.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        // Redirigir a la lista de libros
        this.router.navigate(['/librosAdmin']);
      });
    }).catch((error) => {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el libro.',
        icon: 'error',
      });
    });
  }
  
}
