import { Signal, useSignal } from "@preact/signals";
import { Book, categories } from "../utils/api.ts";

interface Props {
  initialBooks: Book[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: any;
}

export default function BookList({ initialBooks, pagination, filters }: Props) {
  const showFilters = useSignal(false);

  const handleSearch = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value) params.append(key, value as string);
    }

    window.location.href = `/?${params.toString()}`;
  };

  const buildPaginationUrl = (page: number) => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    
    if (filters.title) params.append('title', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.category) params.append('category', filters.category);
    if (filters.year_from) params.append('year_from', filters.year_from.toString());
    if (filters.year_to) params.append('year_to', filters.year_to.toString());
    if (filters.stock_filter) params.append('stock_filter', filters.stock_filter);
    
    return `/?${params.toString()}`;
  };

  return (
    <div>
      {/* Barra de búsqueda y filtros */}
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Buscar Libros</h2>
          <button
            onClick={() => showFilters.value = !showFilters.value}
            class="text-blue-600 hover:text-blue-800"
          >
            {showFilters.value ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Título del libro"
              value={filters.title || ""}
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="author"
              placeholder="Autor"
              value={filters.author || ""}
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="category"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option value={cat} selected={filters.category === cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {showFilters.value && (
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="year_from"
                placeholder="Año desde"
                value={filters.year_from || ""}
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="year_to"
                placeholder="Año hasta"
                value={filters.year_to || ""}
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="stock_filter"
                class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="available" selected={filters.stock_filter === "available"}>
                  Disponible
                </option>
                <option value="unavailable" selected={filters.stock_filter === "unavailable"}>
                  No disponible
                </option>
              </select>
            </div>
          )}

          <div class="mt-4 flex gap-2">
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
            <a
              href="/"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Limpiar
            </a>
            <a
              href="/books/new"
              class="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Nuevo Libro
            </a>
          </div>
        </form>
      </div>

      {/* Lista de libros */}
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Editorial</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {initialBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} class="px-6 py-8 text-center text-gray-500">
                    No se encontraron libros con los filtros aplicados
                  </td>
                </tr>
              ) : (
                initialBooks.map((book) => (
                  <tr key={book.id}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.title}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.author}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.publisher}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {book.category}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.publication_year}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span class={`px-2 py-1 rounded-full text-xs ${
                        book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.stock} unidades
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`/books/${book.id}`}
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver
                      </a>
                      <a
                        href={`/books/${book.id}/edit`}
                        class="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.last_page > 1 && (
          <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> a{" "}
              <span class="font-medium">
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
              </span>{" "}
              de <span class="font-medium">{pagination.total}</span> resultados
            </div>
            <div class="flex gap-2">
              {pagination.current_page > 1 && (
                <a
                  href={buildPaginationUrl(pagination.current_page - 1)}
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Anterior
                </a>
              )}
              
              {/* Números de página */}
              <div class="flex gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(pageNum => {
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.last_page ||
                    (pageNum >= pagination.current_page - 1 && pageNum <= pagination.current_page + 1)
                  ) {
                    return (
                      <a
                        key={pageNum}
                        href={buildPaginationUrl(pageNum)}
                        class={`px-4 py-2 border rounded-lg ${
                          pageNum === pagination.current_page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  } else if (
                    pageNum === pagination.current_page - 2 ||
                    pageNum === pagination.current_page + 2
                  ) {
                    return <span key={pageNum} class="px-2 py-2">...</span>;
                  }
                  return null;
                })}
              </div>
              {pagination.current_page < pagination.last_page && (
                <a
                
                  href={buildPaginationUrl(pagination.current_page + 1)}
                  class="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}