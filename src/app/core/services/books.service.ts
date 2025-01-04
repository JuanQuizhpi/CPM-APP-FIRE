import { Injectable } from '@angular/core';
import { Firestore, collection,addDoc,doc,updateDoc,deleteDoc,collectionData, DocumentReference, DocumentData ,docData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


export interface Book{
    id?: string;
    title: string;
    author: string;
    editorial:string;
    edicion:string;
    city:string;
    publishedYear: number;
    bibliografiaSGS: string;
    availability:boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private booksCollection= collection(this.firestore,'books');

    constructor(private firestore: Firestore){}

    //Create
    addBook(book: Book):Promise<DocumentReference<DocumentData>>{
        return addDoc(this.booksCollection, book);
    }

    //Read
    getBooks():Observable<Book[]>{
        return collectionData(this.booksCollection, {idField:'id'})as Observable<Book[]>;
    }

    //Update
    updateBook(bookId: string , book: Partial<Book>):Promise<void>{
        const bookDoc = doc(this.firestore , `books/${bookId}`);
        return updateDoc(bookDoc, book);
    }

    //Delete
    deleteBook(bookId: string): Promise<void>{
        const bookDoc= doc(this.firestore , `books/${bookId}`);
        return deleteDoc(bookDoc);
    }

    //Buscar libro por ID
    getBookById(bookId: string): Observable<Book> {
        const bookDoc = doc(this.firestore, `books/${bookId}`);
        return docData(bookDoc, { idField: 'id' }) as Observable<Book>;
      }
      
}