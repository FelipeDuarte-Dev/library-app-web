import { Handlers, PageProps } from "$fresh/server.ts";
import { BooksAPI } from "../../utils/api.ts";
import BookForm from "../../islands/BookForm.tsx";

interface Data {
  error?: string;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
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
      const response = await BooksAPI.createBook(bookData);
      
      if (response.success) {
        return new Response("", {
          status: 303,
          headers: { Location: "/" },
        });
      } else {
        return ctx.render({ error: response.message || "Error al crear el libro" });
      }
    } catch (error) {
      return ctx.render({ error: "Error de conexión con la API" });
    }
  },
};

export default function NewBook({ data }: PageProps<Data>) {
  return (
    <div class="px-4 py-8 mx-auto max-w-4xl">
      <div class="mb-8">
        <a href="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Volver a la lista
        </a>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Crear Nuevo Libro
        </h1>
      </div>

      {data?.error && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {data.error}
        </div>
      )}

      <BookForm />
    </div>
  );
}