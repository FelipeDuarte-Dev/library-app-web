<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    public $categories = [
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
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('title') && $request->title != '') {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('author') && $request->author != '') {
            $query->where('author', 'like', '%' . $request->author . '%');
        }

        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        if ($request->has('year_from') && $request->year_from !== '') {
            $query->where('publication_year', '>=', (int)$request->year_from);
        }

        if ($request->has('year_to') && $request->year_to !== '') {
            $query->where('publication_year', '<=', (int)$request->year_to);
        }

        if ($request->has('stock_filter') && $request->stock_filter != '') {
            if ($request->stock_filter === 'available') {
                $query->where('stock', '>', 0);
            } elseif ($request->stock_filter === 'unavailable') {
                $query->where('stock', '=', 0);
            }
        }

        $perPage = $request->get('per_page', 10);
        $books = $query->orderBy('title')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $books->items(),
            'current_page' => $books->currentPage(),
            'last_page' => $books->lastPage(),
            'per_page' => $books->perPage(),
            'total' => $books->total(),
            'from' => $books->firstItem(),
            'to' => $books->lastItem(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1000|max:' . date('Y'),
            'stock' => 'required|integer|min:0',
            'category' => ['required', Rule::in($this->categories)],
        ]);

        $bookExist = Book::where('title', $validated['title'])
            ->where('author', $validated['author'])
            ->where('publisher', $validated['publisher'])
            ->first();

        if ($bookExist) {
            return response()->json([
                'success' => false,
                'message' => 'Book already exists',
            ], 409);
        }

        $book = Book::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Book created successfully',
            'data' => $book,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $book,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'publisher' => 'sometimes|string|max:255',
            'publication_year' => 'sometimes|integer|min:1000|max:' . date('Y'),
            'stock' => 'sometimes|integer|min:0',
            'category' => ['sometimes', Rule::in($this->categories)],
        ]);

        if (empty($validated)) {
            return response()->json([
                'success' => false,
                'message' => 'No valid fields provided for update',
            ], 422);
        }

        $book->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Book updated successfully',
            'data' => $book->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Book deleted successfully',
        ]);
    }
}
