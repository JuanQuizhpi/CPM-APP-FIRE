import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  DocumentReference,
  DocumentData,
  docData,getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

export interface Book {
  id?: string;
  idbibliografia: string;
  title: string;
  author: string;
  editorial: string;
  edicion: string;
  city: string;
  publishedYear: number;
  bibliografiaSGS: string;
  categoria: string;
  availability: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksCollection = collection(this.firestore, 'books');

  constructor(private firestore: Firestore) {}

  //Create
  addBook(book: Book): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.booksCollection, book);
  }

  //Read
  getBooks(): Observable<Book[]> {
    return collectionData(this.booksCollection, {
      idField: 'id',
    }) as Observable<Book[]>;
  }

  //Update
  updateBook(bookId: string, book: Partial<Book>): Promise<void> {
    const bookDoc = doc(this.firestore, `books/${bookId}`);
    return updateDoc(bookDoc, book);
  }

  //Delete
  deleteBook(bookId: string): Promise<void> {
    const bookDoc = doc(this.firestore, `books/${bookId}`);
    return deleteDoc(bookDoc);
  }

  //Buscar libro por ID
  getBookById(bookId: string): Observable<Book> {
    const bookDoc = doc(this.firestore, `books/${bookId}`);
    return docData(bookDoc, { idField: 'id' }) as Observable<Book>;
  }

  // Descargar libros en formato CSV
  async downloadBooksAsCSV(): Promise<void> {
    try {
      // 1. Obtener los datos directamente de la colección
      const querySnapshot = await getDocs(this.booksCollection);
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Libros obtenidos:', books);
  
      if (!books || books.length === 0) {
        console.warn('No hay libros disponibles para exportar.');
        return;
      }
  
      // 2. Mapear los datos para generar un CSV
      const encabezados = Object.keys(books[0]);
      const filas = books.map((libro) =>
        encabezados.map((header) => `"${(libro as any)[header] || ''}"`).join(',')
      );
      const contenidoCSV = [encabezados.join(','), ...filas].join('\n');
  
      // 3. Crear y descargar el archivo CSV
      const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'books.csv');
      console.log('Archivo CSV generado con éxito.');
    } catch (error) {
      console.error('Error al descargar los libros en CSV:', error);
    }
  }
  
}
