import { Recipe } from '../types/recipe.types';
import { Group } from '../types/api.types';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'mock-recipe-1',
    title: 'Arroz con Pollo',
    description: 'Un clasico latinoamericano lleno de sabor.',
    authorId: 'mock-123',
    author: { id: 'mock-123', name: 'Alberto', email: 'alberto@test.com' },
    ingredients: [
      { id: 'i1', name: 'Arroz', quantity: '2', unit: 'tazas', order: 1 },
      { id: 'i2', name: 'Pollo', quantity: '500', unit: 'g', order: 2 },
      { id: 'i3', name: 'Zanahoria', quantity: '1', unit: 'pieza', order: 3 },
    ],
    steps: [
      { id: 's1', description: 'Cocer el pollo en agua con sal por 20 minutos.', order: 1 },
      { id: 's2', description: 'Sofreir el arroz con aceite hasta dorar ligeramente.', order: 2 },
      { id: 's3', description: 'Agregar el caldo del pollo y las verduras. Cocinar 18 min.', order: 3 },
    ],
    groups: [{ group: { id: 'mock-group-1', name: 'Comidas' } }],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'mock-recipe-2',
    title: 'Guacamole',
    description: 'Clasico guacamole mexicano.',
    authorId: 'mock-123',
    author: { id: 'mock-123', name: 'Alberto', email: 'alberto@test.com' },
    ingredients: [
      { id: 'i4', name: 'Aguacate', quantity: '2', unit: 'piezas', order: 1 },
      { id: 'i5', name: 'Limon', quantity: '1', unit: 'pieza', order: 2 },
      { id: 'i6', name: 'Sal', quantity: '1', unit: 'pizca', order: 3 },
    ],
    steps: [
      { id: 's4', description: 'Pelar y deshuesar los aguacates.', order: 1 },
      { id: 's5', description: 'Machacar con un tenedor hasta obtener una mezcla homogenea.', order: 2 },
      { id: 's6', description: 'Agregar limon y sal al gusto.', order: 3 },
    ],
    groups: [],
    createdAt: '2026-01-12T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'mock-recipe-3',
    title: 'Tacos de Pastor',
    description: 'Tacos al pastor con pina y cilantro.',
    authorId: 'mock-other-user',
    author: { id: 'mock-other-user', name: 'Cocinero', email: 'cocinero@test.com' },
    ingredients: [
      { id: 'i7', name: 'Tortillas', quantity: '10', unit: 'piezas', order: 1 },
      { id: 'i8', name: 'Carne de cerdo', quantity: '400', unit: 'g', order: 2 },
      { id: 'i9', name: 'Pina', quantity: '100', unit: 'g', order: 3 },
    ],
    steps: [
      { id: 's7', description: 'Marinar la carne con achiote y especias por 2 horas.', order: 1 },
      { id: 's8', description: 'Asar la carne en trompo o sarten a fuego alto.', order: 2 },
      { id: 's9', description: 'Servir en tortillas con cilantro, cebolla y pina.', order: 3 },
    ],
    groups: [],
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'mock-group-1',
    name: 'Comidas',
    description: 'Platos principales',
    userId: 'mock-123',
    recipeCount: 1,
    recipes: [
      { id: 'mock-recipe-1', title: 'Arroz con Pollo', description: 'Un clasico latinoamericano.', authorId: 'mock-123' },
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mock-group-2',
    name: 'Entradas',
    description: 'Aperitivos y entradas',
    userId: 'mock-123',
    recipeCount: 0,
    recipes: [],
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

export const IS_MOCK = __DEV__;
