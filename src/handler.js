const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const getHome = (request, h) => {
  return 'Hello, Bookshelf API!';
};

const addBook = (request, h) => { 
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload; 
    if (!name) { 
        return h.response({ 
            status: 'fail', 
            message: 'Gagal menambahkan buku. Mohon isi nama buku' 
        }).code(400); 
    } 
    if (readPage > pageCount) { 
        return h.response({ 
            status: 'fail', 
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' 
        }).code(400); 
    } 

    const id = nanoid(16); 
    const insertedAt = new Date().toISOString(); 
    const updatedAt = insertedAt; 
    const finished = pageCount === readPage; 
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }; 
    bookshelf.push(newBook); 
    return h.response({ 
        status: 'success', 
        message: 'Buku berhasil ditambahkan', 
        data: { 
            bookId: id 
        } 
    }).code(201); 
};

const getAllBooks = (request, h) => {

    const { name, reading, finished } = request.query; 
    let filteredBooks = bookshelf; 
    if (name) { 
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())); 
    } 
    if (reading !== undefined) { 
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading)); 
    } 
    if (finished !== undefined) { 
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished)); 
    }

    const books = bookshelf.map(({ id, name, publisher }) => ({ 
        id, 
        name, 
        publisher 
    })); 
    return { 
        status: 'success', 
        data: { 
            books 
        } 
    }; 
};

const getBookById = (request, h) => {
    const { bookId } = request.params;
    const book = bookshelf.find((b) => b.id === bookId);
    if (!book) { 
        return h.response({ 
            status: 'fail', 
            message: 'Buku tidak ditemukan' 
        }).code(404);
    }

    return { 
        status: 'success', 
        data: { 
            book 
        } 
    };
};

const updateBookById = (request, h) => { 
    const { bookId } = request.params; 
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload; 
    if (!name) { 
        return h.response({ 
            status: 'fail', 
            message: 'Gagal memperbarui buku. Mohon isi nama buku' 
        }).code(400); 
    } 
    if (readPage > pageCount) { 
        return h.response({ 
            status: 'fail', 
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' 
        }).code(400); 
    } 
    
    const index = bookshelf.findIndex((b) => b.id === bookId); 
    if (index === -1) { 
        return h.response({ 
            status: 'fail', 
            message: 'Gagal memperbarui buku. Id tidak ditemukan' 
        }).code(404); 
    } 
    const updatedAt = new Date().toISOString(); 
    bookshelf[index] = { 
        ...bookshelf[index], 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        finished: pageCount === readPage, 
        updatedAt 
    }; 
    return h.response({ 
        status: 'success', 
        message: 'Buku berhasil diperbarui' 
    }).code(200);
};

const deleteBookById = (request, h) => { 
    const { bookId } = request.params; 
    const index = bookshelf.findIndex((book) => book.id === bookId); 
    if (index === -1) { 
        return h.response({ 
            status: 'fail', 
            message: 'Buku gagal dihapus. Id tidak ditemukan' 
        }).code(404); 
    } 
    
    bookshelf.splice(index, 1); 
    return h.response({ 
        status: 'success', 
        message: 'Buku berhasil dihapus' 
    }).code(200);
};
module.exports = { getHome, addBook, getAllBooks, getBookById, updateBookById, deleteBookById };