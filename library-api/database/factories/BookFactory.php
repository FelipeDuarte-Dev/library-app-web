<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{

    public function definition(): array
    {
        $categories = [
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

        $publishers = [
            'Editorial Planeta',
            'Penguin Random House',
            'Grupo Santillana',
            'Editorial Alfaguara',
            'Anagrama',
            'Tusquets Editores',
            'Ediciones B',
            'RBA Libros',
            'Salamandra',
            'Siruela'
        ];

        return [
            'title' => $this->faker->sentence(rand(2, 6)),
            'author' => $this->faker->name(),
            'publisher' => $this->faker->randomElement($publishers),
            'publication_year' => $this->faker->numberBetween(1950, date('Y')),
            'stock' => $this->faker->numberBetween(0, 10),
            'category' => $this->faker->randomElement($categories),
        ];
    }
}
