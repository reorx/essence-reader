import Dexie, { type Table } from 'dexie';
import type { Metadata, Files, TOC } from './services/types';

interface Book {
  id?: number;
  meta: Metadata;
  contents: string[];
  toc: TOC[];
  files: Files;
  progress: number;
}

class BookDB extends Dexie {
  books!: Table<Book>;

  constructor() {
    super('bookDB');
    this.version(4).stores({
      books: '++id, meta, contents, toc, files, progress'
    });
  }
}

export const db = new BookDB();

export const storeBook = async (book: Book) => {
  for (let storedBook of await db.books.toArray()) {
    if (storedBook.meta.title === book.meta.title) {
      return storedBook.id;
    }
  }

  try {
    const id = await db.books.add(book);
    return id;
  } catch (error) {
    console.log(error);
  }
}