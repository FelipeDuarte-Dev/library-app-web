import { Handlers, PageProps } from "$fresh/server.ts";
import { BooksAPI, Book } from "../../../utils/api.ts";
import BookDetail from "../../../islands/BookDetail.tsx";

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
};

export default function BookDetailPage({ data }: PageProps<Data>) {
  if (data.error || !data.book) {
    return (
      <div class="px-4 py-8 mx-auto max-w-4xl">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {data.error || "Libro no encontrado"}
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
        <a href="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Volver a la lista
        </a>
      </div>

      <BookDetail book={data.book} />
    </div>
  );
}