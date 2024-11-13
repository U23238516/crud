import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { Observable } from 'rxjs';
import { Product } from '../models/product'; // Asegúrate de tener un modelo de producto adecuado
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface ProductResponse {
  cantidad: number;
  lista   : ProductResponse;
  status  : number;
}

@Injectable({
  providedIn: 'root'  // Esto asegura que el servicio esté disponible en todo el proyecto
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/productos/';  // Asegúrate de que tu backend esté corriendo

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error en la solicitud GET:', error);
        return throwError(() => new Error('Error en la solicitud GET'));
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error en la solicitud GET por ID:', error);
        return throwError(() => new Error('Error en la solicitud GET por ID'));
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError(error => {
        console.error('Error en la solicitud POST para agregar:', error);
        return throwError(() => new Error('Error en la solicitud POST para agregar'));
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}`, product).pipe(
      catchError(error => {
        console.error('Error en la solicitud PUT para actualizar:', error);
        return throwError(() => new Error('Error en la solicitud PUT para actualizar'));
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
      catchError(error => {
        console.error('Error en la solicitud DELETE para eliminar:', error);
        return throwError(() => new Error('Error en la solicitud DELETE para eliminar'));
      })
    );
  }

}
