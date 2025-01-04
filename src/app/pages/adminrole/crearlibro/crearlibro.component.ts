import { Component , OnInit} from '@angular/core';
import { BookService, Book } from '../../../core/services/books.service';
import { FormBuilder, FormGroup, Validators ,FormControl, ReactiveFormsModule } from '@angular/forms';
import { error } from 'console';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crearlibro',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,NgIf,MatCheckboxModule],
  templateUrl: './crearlibro.component.html',
  styleUrl: './crearlibro.component.scss'
})
export class CrearlibroComponent {

  bockForm:FormGroup;


  constructor(private booksService : BookService, private fb:FormBuilder){
    //Inicializamos el formulario
    this.bockForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required],
      city: ['', Validators.required],
      publishedYear: [new Date().getFullYear(), Validators.required],
      availability: [true, Validators.required],
    });
  }

  addBook():void{
    if(this.bockForm.invalid) return;
    const book : Book = this.bockForm.value;
    this.booksService.addBook(book).then(()=>{
      this.bockForm.reset();
    }).catch((error)=>{
      console.error('Error al agregar libro', error);
    });
  }

  

  showCreateConfirmation() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de agregar un libro o referencia.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, Crear ',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addBook();
        }
      });
    }


}


