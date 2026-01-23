import { useSignal } from "@preact/signals";
import { Book, categories } from "../utils/api.ts";

interface Props {
  book?: Book;
}

export default function BookForm({ book }: Props) {
  const title = useSignal(book?.title || "");
  const author = useSignal(book?.author || "");
  const publisher = useSignal(book?.publisher || "");
  const publicationYear = useSignal(book?.publication_year || new Date().getFullYear());
  const stock = useSignal(book?.stock || 0);
  const category = useSignal(book?.category || "");
  const errors = useSignal<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.value.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!author.value.trim()) {
      newErrors.author = "El autor es requerido";
    }

    if (!publisher.value.trim()) {
      newErrors.publisher = "La editorial es requerida";
    }

    if (publicationYear.value < 1000 || publicationYear.value > new Date().getFullYear()) {
      newErrors.publication_year = `El año debe estar entre 1000 y ${new Date().getFullYear()}`;
    }

    if (stock.value < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!category.value) {
      newErrors.category = "La categoría es requerida";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    (e.target as HTMLFormElement).submit();
  };

  return (
    <form method="POST" onSubmit={handleSubmit} class="bg-white rounded-lg shadow p-6">
      <div class="space-y-6">
        {/* Título */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={title.value}
            onInput={(e) => title.value = (e.target as HTMLInputElement).value}
            class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.value.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Cien años de soledad"
          />
          {errors.value.title && (
            <p class="mt-1 text-sm text-red-600">{errors.value.title}</p>
          )}
        </div>

        {/* Autor */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Autor *
          </label>
          <input
            type="text"
            name="author"
            value={author.value}
            onInput={(e) => author.value = (e.target as HTMLInputElement).value}
            class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.value.author ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Gabriel García Márquez"
          />
          {errors.value.author && (
            <p class="mt-1 text-sm text-red-600">{errors.value.author}</p>
          )}
        </div>

        {/* Editorial */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Editorial *
          </label>
          <input
            type="text"
            name="publisher"
            value={publisher.value}
            onInput={(e) => publisher.value = (e.target as HTMLInputElement).value}
            class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.value.publisher ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Editorial Sudamericana"
          />
          {errors.value.publisher && (
            <p class="mt-1 text-sm text-red-600">{errors.value.publisher}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            name="category"
            value={category.value}
            onChange={(e) => category.value = (e.target as HTMLSelectElement).value}
            class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.value.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(cat => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
          {errors.value.category && (
            <p class="mt-1 text-sm text-red-600">{errors.value.category}</p>
          )}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Año de Publicación */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Año de Publicación *
            </label>
            <input
              type="number"
              name="publication_year"
              value={publicationYear.value}
              onInput={(e) => publicationYear.value = Number((e.target as HTMLInputElement).value)}
              min="1000"
              max={new Date().getFullYear()}
              class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.value.publication_year ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.value.publication_year && (
              <p class="mt-1 text-sm text-red-600">{errors.value.publication_year}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={stock.value}
              onInput={(e) => stock.value = Number((e.target as HTMLInputElement).value)}
              min="0"
              class={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.value.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.value.stock && (
              <p class="mt-1 text-sm text-red-600">{errors.value.stock}</p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {book ? "Actualizar Libro" : "Crear Libro"}
          </button>
          <a
            href="/"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </a>
        </div>
      </div>
    </form>
  );
}