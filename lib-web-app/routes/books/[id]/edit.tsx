import { Handlers, PageProps } from "$fresh/server.ts";
import { BooksAPI, Book } from "../../../utils/api.ts";
import BookForm from "../../../islands/BookForm.tsx";

interface Data {
  book?: Book;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const id = Number(ctx.params.id);
    
    try {
      const response = await BooksAPI.getBook(id);
      
      if (response.success && response.data) {
        return ctx.render({ book: response.data });
      } else {
        return ctx.render({ error: "Libro no encontrado" });
      }
    } catch (error) {
      return ctx.render({ error: "Error de conexión con la API" });
    }
  },

  async POST(req, ctx) {
    const id = Number(ctx.params.id);
    const formData = await req.formData();
    
    const bookData = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      publication_year: Number(formData.get("publication_year")),
      stock: Number(formData.get("stock")),
      category: formData.get("category") as string,
    };

    try {
      const response = await BooksAPI.updateBook(id, bookData);
      
      if (response.success) {
        return new Response("", {
          status: 303,
          headers: { Location: `/books/${id}` },
        });
      } else {
        const bookResponse = await BooksAPI.getBook(id);
        return ctx.render({ 
          book: bookResponse.data,
          error: response.message || "Error al actualizar el libro" 
        });
      }
    } catch (error) {
      const bookResponse = await BooksAPI.getBook(id);
      return ctx.render({ 
        book: bookResponse.data,
        error: "Error de conexión con la API" 
      });
    }
  },
};

export default function EditBook({ data }: PageProps<Data>) {
  if (data.error && !data.book) {
    return (
      <div class="px-4 py-8 mx-auto max-w-4xl">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {data.error}
        </div>
        <a href="/" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Volver a la lista
        </a>
      </div>
    );
  }

  return (
    <div class="px-4 py-8 mx-auto max-w-4xl">
      <div class="mb-8">
        <a href={`/books/${data.book?.id}`} class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Volver al detalle
        </a>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Editar Libro
        </h1>
      </div>

      {data.error && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {data.error}
        </div>
      )}

      <BookForm book={data.book} />
    </div>
  );
}