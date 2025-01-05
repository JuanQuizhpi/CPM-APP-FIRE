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
import { AuthService } from '../../../core/services/auth.service';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from '@angular/fire/firestore';

import { lastValueFrom } from 'rxjs';
import { User } from 'firebase/auth';

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
    private clipboard: Clipboard,
    private authService: AuthService,
    private firestore: Firestore
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

  //Metodos para obtener los usuarios
  userEmail: string | null = null;

  async getUserEmail() {
    this.authService.authState$.subscribe(async (user) => {
      if (user) {
        this.userEmail = user.email;
        console.log('Correo del usuario autenticado:', this.userEmail);
        if (this.userEmail) {
          // Obtener los datos del usuario usando el correo
          this.getUserData();
        }
      } else {
        this.userEmail = null;
        console.log('No hay usuario autenticado');
      }
    });
  }

  userData: any = null;

  // Método para obtener los datos del usuario
  async getUserData() {
    if (this.userEmail) {
      this.userData = await this.authService.getUserDataByEmail(this.userEmail);
      console.log('User Data:', this.userData);
    }
  }

  //Metodo para generar el prestamo
  maxLoanDays = 30; // Número máximo de días permitido para un préstamo

  async makePrestamo(book: Book): Promise<void> {
    if (!book.availability) {
      Swal.fire({
        title: 'No Disponible',
        text: 'El libro no está disponible para préstamo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    console.log(book);

    // Esperamos a obtener el correo del usuario
    await this.getUserEmail();

    // Verificamos si los datos del usuario están disponibles antes de continuar
    /*if (!this.userData || !this.userData.names) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener los datos del usuario.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }*/

    if (!this.userData || !this.userData.names) {
      let timerInterval: any;
      Swal.fire({
        title: 'Cargando datos...',
        html: 'Intentando obtener los datos del usuario. Este mensaje se cerrará en <b></b> milisegundos.',
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup()?.querySelector('b');
          timerInterval = setInterval(() => {
            if (timer) {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          // Intentar obtener los datos nuevamente
          try {
            await this.getUserData();
            if (!this.userData || !this.userData.names) {
              Swal.fire({
                title: 'Datos no disponibles',
                text: 'No se pudieron obtener los datos del usuario después de varios intentos. Por favor, contacta al administrador.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
              });
              return;
            }
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al cargar los datos del usuario. Intenta más tarde.',
              icon: 'error',
              confirmButtonText: 'Cerrar',
            });
          }
        }
      });
      return;
    }

    // Mostrar resumen del préstamo en un SweetAlert
    const { value: days } = await Swal.fire({
      title: 'Resumen del Préstamo',
      html: `
        <p><strong>Libro:</strong> ${book.title}</p>
        <p><strong>Autor:</strong> ${book.author}</p>
        <p><strong>Estudiante:</strong> ${this.userData['names']} ${this.userData['lastName']}</p>
        <p><strong>Email:</strong> ${this.userData['email']}</p>
        <p><strong>Cédula:</strong> ${this.userData['idCard']}</p>
        <p><strong>Teléfono:</strong> ${this.userData['phone']}</p>
        <p>Seleccione los días de préstamo (máximo ${this.maxLoanDays} días):</p>
        <input type="number" id="loan-days" class="swal2-input" min="1" max="${this.maxLoanDays}" value="14">
      `,
      confirmButtonText: 'Confirmar Préstamo',
      showCancelButton: true,
      preConfirm: () => {
        const daysInput = parseInt(
          (document.getElementById('loan-days') as HTMLInputElement)?.value ||
            '0',
          10
        );
        if (isNaN(daysInput) || daysInput < 1 || daysInput > this.maxLoanDays) {
          Swal.showValidationMessage(
            `Elija un número válido entre 1 y ${this.maxLoanDays} días.`
          );
        }
        return daysInput;
      },
    });

    if (!days) return; // El usuario canceló el préstamo

    // Calcular fechas
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + days);

    // Crear el préstamo
    const prestamosCollection = collection(this.firestore, 'prestamos');
    const prestamo = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      student: {
        email: this.userData['email'],
        names: this.userData['names'],
        lastName: this.userData['lastName'],
        phone: this.userData['phone'],
        idCard: this.userData['idCard'],
      },
      borrowedAt: today.toISOString(),
      returnAt: returnDate.toISOString(),
      estado:true
    };

    try {
      // Guardar el préstamo en Firestore
      await addDoc(prestamosCollection, prestamo);

      // Actualizar disponibilidad del libro
      const bookDoc = doc(this.firestore, `books/${book.id}`);
      await updateDoc(bookDoc, { availability: false });

      Swal.fire({
        title: 'Préstamo Exitoso',
        text: `El libro "${book.title}" ha sido prestado por ${days} días.`,
        icon: 'success',
        confirmButtonText: 'Cerrar',
      });
    } catch (error) {
      console.error('Error al registrar el préstamo:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al realizar el préstamo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  }
}
