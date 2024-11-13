import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { HttpClient } from '@angular/common/http';
import { ProductService } from './services/product.service';

interface Product {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],  // Agrega HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [HttpClient]  // Proveedor explícito de HttpClient,
  providers: [ProductService]
})
export class AppComponent {
  title               = 'Gestión de Productos';
  products: Product[] = [];
  product: Product    = { nombre: '', descripcion: '', precio: 0, cantidad: 0 };
  isEditing           = false;
  isAdding            = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      console.log(data)
      // this.products = data;
      this.products = Array.isArray(data.lista) ? data.lista : [];
      if (!Array.isArray(data.lista)) {
        console.error('La propiedad lista no es un array:', data.lista);
      }
    });
  }

  // Método para refrescar los productos
  refreshProducts(): void {
    this.loadProducts();  // Llama al método que carga los productos nuevamente
  }

  isFormSubmitted = false;

  onSubmit(): void {
    this.isFormSubmitted = true;
      // Validación antes de enviar el formulario
    if (!this.product.nombre || this.product.precio <= 0) {
      console.error('Formulario inválido.');
      return;
    }
    console.log(this.product)
    if (this.isEditing) {
      this.productService.updateProduct(this.product.id!, this.product).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    } else {
      this.productService.addProduct(this.product).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.product = { ...product };
    this.isEditing = true;
    this.isAdding = false;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }

  resetForm(): void {
    this.product = { nombre: '', descripcion: '', precio: 0, cantidad: 0 };
    this.isEditing = false;
    this.isAdding = true;
  }
}
