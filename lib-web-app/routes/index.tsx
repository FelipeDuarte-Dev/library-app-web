import { Handlers, PageProps } from "$fresh/server.ts";
import { BooksAPI, Book, ApiResponse } from "../utils/api.ts";
import BookList from "../islands/BookList.tsx";

interface Data {
  books: Book[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    title?: string;
    author?: string;
    category?: string;
    year_from?: number;
    year_to?: number;
    stock_filter?: string;
  };
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const filters = {
      title: url.searchParams.get("title") || undefined,
      author: url.searchParams.get("author") || undefined,
      category: url.searchParams.get("category") || undefined,
      year_from: url.searchParams.get("year_from") ? Number(url.searchParams.get("year_from")) : undefined,
      year_to: url.searchParams.get("year_to") ? Number(url.searchParams.get("year_to")) : undefined,
      stock_filter: url.searchParams.get("stock_filter") || undefined,
      page: url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1,
      per_page: 10,
    };

    const response = await BooksAPI.getBooks(filters);

    return ctx.render({
      books: response.data || [],
      pagination: {
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 10,
        total: response.total || 0,
      },
      filters,
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="px-4 py-8 mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          📚 Biblioteca
        </h1>
        <p class="text-gray-600">
          Gestiona tu colección de libros
        </p>
      </div>

      <BookList 
        initialBooks={data.books} 
        pagination={data.pagination}
        filters={data.filters}
      />
    </div>
  );
}