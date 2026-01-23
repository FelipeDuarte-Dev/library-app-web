import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Página no encontrada | Biblioteca</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="max-w-2xl w-full">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 sm:px-8 py-8 sm:py-12 text-center">
              <div class="text-white">
                <div class="text-6xl sm:text-7xl md:text-8xl font-bold mb-3 sm:mb-4 animate-bounce">
                  404
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold mb-2">
                  📚 Libro No Encontrado
                </h1>
                <p class="text-blue-100 text-base sm:text-lg px-4">
                  Parece que este libro se perdió en la biblioteca...
                </p>
              </div>
            </div>

            <div class="px-6 sm:px-8 py-8 sm:py-10 text-center">
              <div class="mb-6 sm:mb-8">
                <svg class="mx-auto w-24 h-24 sm:w-32 sm:h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <p class="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 px-2">
                La página que buscas no existe o ha sido movida a otra estantería.
              </p>

              {/* Botones de acción */}
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a href="/" class="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-center">
                  <span class="hidden sm:inline">🏠 Ir al Inicio</span>
                  <span class="sm:hidden">🏠 Inicio</span>
                </a>
                <a href="/books/new" class="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-center">
                  <span class="hidden sm:inline">➕ Agregar Libro</span>
                  <span class="sm:hidden">➕ Nuevo</span>
                </a>
              </div>

              <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <p class="text-xs sm:text-sm text-gray-500 px-2">
                  ¿Necesitas ayuda? Vuelve a la{" "}
                  <a href="/" class="text-blue-600 hover:text-blue-800 underline">
                    biblioteca principal
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}