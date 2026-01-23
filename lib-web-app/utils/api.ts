const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  stock: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
}

export const categories = [
  'Ficción',
  'No Ficción',
  'Ciencia Ficción',
  'Fantasía',
  'Romance',
  'Misterio',
  'Thriller',
  'Historia',
  'Biografía',
  'Autoayuda',
  'Tecnología',
  'Ciencia',
  'Arte',
  'Filosofía',
  'Poesía'
];

export class BooksAPI {
  static async getBooks(params?: {
    title?: string;
    author?: string;
    category?: string;
    year_from?: number;
    year_to?: number;
    stock_filter?: 'available' | 'unavailable';
    per_page?: number;
    page?: number;
  }): Promise<ApiResponse<Book[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/books?${queryParams}`;
    const response = await fetch(url);
    return await response.json();
  }

  static async getBook(id: number): Promise<ApiResponse<Book>> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return await response.json();
  }

  static async createBook(book: Omit<Book, 'id'>): Promise<ApiResponse<Book>> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    return await response.json();
  }

  static async updateBook(id: number, book: Partial<Omit<Book, 'id'>>): Promise<ApiResponse<Book>> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    return await response.json();
  }

  static async deleteBook(id: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }

  static async updateStock(id: number, increment: number): Promise<ApiResponse<Book>> {
    const bookResponse = await this.getBook(id);
    
    if (!bookResponse.success || !bookResponse.data) {
      return bookResponse;
    }

    const currentStock = bookResponse.data.stock;
    const newStock = Math.max(0, currentStock + increment); 

    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stock: newStock }),
    });
    
    return await response.json();
  }
}