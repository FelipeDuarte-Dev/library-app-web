import { useSignal } from "@preact/signals";

interface Props {
  bookId: number;
  currentStock: number;
  bookTitle: string;
  onStockChange?: () => void;
}

export default function StockManager({ bookId, currentStock, bookTitle, onStockChange }: Props) {
  const stock = useSignal(currentStock);
  const isUpdating = useSignal(false);
  const error = useSignal("");
  const showSuccess = useSignal(false);

  const updateStock = async (increment: number) => {
    const newStock = stock.value + increment;
    
    if (newStock < 0) {
      error.value = "El stock no puede ser negativo";
      setTimeout(() => error.value = "", 3000);
      return;
    }

    isUpdating.value = true;
    error.value = "";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await response.json();

      if (data.success) {
        stock.value = newStock;
        showSuccess.value = true;
        setTimeout(() => showSuccess.value = false, 2000);
        
        if (onStockChange) {
          onStockChange();
        }
      } else {
        error.value = data.message || "Error al actualizar el stock";
      }
    } catch (err) {
      error.value = "Error de conexión con la API";
    } finally {
      isUpdating.value = false;
    }
  };

  return (
    <div class="flex items-center gap-2">
      <button
        onClick={() => updateStock(-1)}
        disabled={isUpdating.value || stock.value === 0}
        class="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Disminuir stock"
      >
        <span class="text-lg font-bold">−</span>
      </button>

      <div class="relative">
        <span class={`px-3 py-1 rounded-full text-xs font-medium ${
          stock.value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {stock.value}
        </span>
      </div>

      <button
        onClick={() => updateStock(1)}
        disabled={isUpdating.value}
        class="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Aumentar stock"
      >
        <span class="text-lg font-bold">+</span>
      </button>

      {error.value && (
        <div class="absolute z-10 mt-1 px-3 py-1 bg-red-100 text-red-700 text-xs rounded shadow-lg">
          {error.value}
        </div>
      )}
    </div>
  );
}