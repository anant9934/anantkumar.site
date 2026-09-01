export interface Book {
  title: string;
  subtitle: string;
  author: string;
  amazonUrl: string;
  image?: string; // We can use placeholder or generic cover if we don't have the actual image asset
}

export const BOOKS: Book[] = [
  {
    title: 'The AI Student',
    subtitle: 'The Complete Operating System for Learning, Building, and Thinking in the Age of AI',
    author: 'ANANT KUMAR (AUTHOR), MANDEEP KUMAR (CO-AUTHOR)',
    amazonUrl: 'https://www.amazon.in/dp/B0H6P9VZR5',
    image: '/images/books/ai-student.jpg',
  },
  {
    title: 'The Rhythm Code',
    subtitle: 'Ancient Wisdom For Modern Burnout',
    author: 'ANANT KUMAR, SHIVAM KUMAR SINGH, VINITA KASHYAP',
    amazonUrl: 'https://www.amazon.in/dp/B0GRKSKRMS',
    image: '/images/books/rhythm-code.jpg',
  }
];
