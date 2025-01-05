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
  docData,query,where,getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Prestamo {
  id?: string; // ID autogenerado por Firestore
  bookId: string;
  title: string;
  author: string;
  student: {
    email: string;
    names: string;
    lastName: string;
    phone: string;
    idCard: string;
  };
  borrowedAt: string; // Fecha inicial (ISO string)
  returnAt: string; // Fecha de devolución (ISO string)
  estado: boolean; // true = activo, false = inactivo
}

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private prestamosCollection = collection(this.firestore,'prestamos');

  constructor(private firestore: Firestore){}

  // Create - Agregar un nuevo préstamo
  async addPrestamo(prestamo: Prestamo): Promise<void> {
    await addDoc(this.prestamosCollection, prestamo);
  }

  // Read - Obtener todos los préstamos
  getPrestamos(): Observable<Prestamo[]> {
    return collectionData(this.prestamosCollection, { idField: 'id' }) as Observable<Prestamo[]>;
  }

  // Read - Obtener un préstamo por ID
  getPrestamoById(prestamoId: string): Observable<Prestamo> {
    const prestamoDoc = doc(this.firestore, `prestamos/${prestamoId}`);
    return docData(prestamoDoc, { idField: 'id' }) as Observable<Prestamo>;
  }

  // Read - Obtener préstamos por estado
  async getPrestamosByEstado(estado: boolean): Promise<Prestamo[]> {
    const prestamosQuery = query(this.prestamosCollection, where('estado', '==', estado));
    const querySnapshot = await getDocs(prestamosQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Prestamo[];
  }

  // Update - Actualizar un préstamo
  async updatePrestamo(prestamoId: string, updatedData: Partial<Prestamo>): Promise<void> {
    const prestamoDoc = doc(this.firestore, `prestamos/${prestamoId}`);
    await updateDoc(prestamoDoc, updatedData);
  }

  // Delete - Eliminar un préstamo
  async deletePrestamo(prestamoId: string): Promise<void> {
    const prestamoDoc = doc(this.firestore, `prestamos/${prestamoId}`);
    await deleteDoc(prestamoDoc);
  }

  // Método para cancelar un préstamo
  async cancelarPrestamo(prestamoId: string, bookId: string): Promise<void> {
    // Referencia al documento del préstamo
    const prestamoDocRef = doc(this.firestore, `prestamos/${prestamoId}`);
    
    // Referencia al documento del libro
    const bookDocRef = doc(this.firestore, `books/${bookId}`);
    
    try {
      // Actualizamos el estado del préstamo a "false" (anulado)
      await updateDoc(prestamoDocRef, { estado: false });

      // Actualizamos la disponibilidad del libro a "true" (disponible)
      await updateDoc(bookDocRef, { availability: true });

      console.log('Préstamo cancelado correctamente');
    } catch (error) {
      console.error('Error al cancelar el préstamo:', error);
    }
  }



}
