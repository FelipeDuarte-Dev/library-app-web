import { useSignal } from "@preact/signals";
import { Book } from "../utils/api.ts";

interface Props {
  book: Book;
}

export default function BookDetail({ book }: Props) {
  const showDeleteModal = useSignal(false);
  const isDeleting = useSignal(false);
  const deleteError = useSignal("");

  const handleDelete = async () => {
    isDeleting.value = true;
    deleteError.value = "";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${book.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        deleteError.value = data.message || "Error al eliminar el libro";
        isDeleting.value = false;
      }
    } catch (error) {
      deleteError.value = "Error de conexión con la API";
      isDeleting.value = false;
    }
  };

  return (
    <div>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        {/* Encabezado */}
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 text-white">
          <h1 class="text-3xl font-bold mb-2">{book.title}</h1>
          <p class="text-blue-100">por {book.author}</p>
        </div>

        {/* Contenido */}
        <div class="px-8 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Editorial</h3>
              <p class="text-lg text-gray-900">{book.publisher}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Año de Publicación</h3>
              <p class="text-lg text-gray-900">{book.publication_year}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Categoría</h3>
              <p>
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {book.category}
                </span>
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Stock</h3>
              <p>
                <span class={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.stock > 0 ? `${book.stock} unidades disponibles` : 'Sin stock'}
                </span>
              </p>
            </div>
          </div>

          {/* Información adicional */}
          {book.created_at && (
            <div class="border-t pt-6">
              <h3 class="text-sm font-medium text-gray-500 mb-3">Información del Sistema</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span class="font-medium">Creado:</span> {new Date(book.created_at).toLocaleString('es-ES')}
                </div>
                {book.updated_at && (
                  <div>
                    <span class="font-medium">Actualizado:</span> {new Date(book.updated_at).toLocaleString('es-ES')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div class="bg-gray-50 px-8 py-4 flex gap-3">
            <a
            href={`/books/${book.id}/edit`}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Editar Libro
          </a>
          <button
            onClick={() => showDeleteModal.value = true}
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar Libro
          </button>
        </div>
      </div>

      {showDeleteModal.value && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">
              ¿Eliminar libro?
            </h3>
            <p class="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar "<strong>{book.title}</strong>"? Esta acción no se puede deshacer.
            </p>

            {deleteError.value && (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {deleteError.value}
              </div>
            )}

            <div class="flex gap-3 justify-end">
              <button
                onClick={() => {
                  showDeleteModal.value = false;
                  deleteError.value = "";
                }}
                disabled={isDeleting.value}
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting.value}
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting.value ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}