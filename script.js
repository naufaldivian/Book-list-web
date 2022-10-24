const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'Book-App';

let generateId = () => {
    return +new Date();
}

let generateBookObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

let addBuku = () => {
    const textJudul = document.getElementById('inputBookTitle').value;
    const textPenulis = document.getElementById('inputBookAuthor').value;
    const textTahun = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textJudul, textPenulis, textTahun, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let rakBuku = (bookObject) => {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = ('Author: ') + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = ('Year: ') + bookObject.year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete){
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = 'Unfinished';
        
        finishButton.addEventListener('click', () => {
            finishRead(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Remove';

        removeButton.addEventListener('click', () => {
            let konfirmasi;
            if (confirm("Do you want to delete this book?") == true){
                removeBook(bookObject.id);
            } else {
                konfirmasi = "Canceled";
            }
        });

        buttonContainer.append(finishButton, removeButton);
        container.append(textTitle, textAuthor, textYear, buttonContainer);
    } else {
        const unfinishButton = document.createElement('button');
        unfinishButton.classList.add('green');
        unfinishButton.innerText = 'Finished';

        unfinishButton.addEventListener('click', () => {
            unfinishRead(bookObject.id);
        })

        const removeButton1 = document.createElement('button');
        removeButton1.classList.add('red');
        removeButton1.innerText = 'Remove';

        removeButton1.addEventListener('click', () => {
            if (confirm("Do you want to delete this book?") == true){
                removeBook(bookObject.id);
            } else {
                konfirmasi = "Canceled";
            }
        });

        buttonContainer.append(unfinishButton, removeButton1);
        container.append(textTitle, textAuthor, textYear, buttonContainer);
    }
    return container;
}

let finishRead = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let unfinishRead = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let removeBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

let findBook = (bookId) => {
    for (const bookitem of books){
        if (bookitem.id === bookId){
            return bookitem;
        }
    }
    return null;
}

let findBookIndex = (bookId) => {
    for (const index in books){
        if (books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

let isStorageExist = () => {
    if (typeof (Storage) === undefined){
        alert('Maaf browser tidak mendukung local storage');
        return false;
    }
    return true;
}

let saveData = () => {
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

let loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', (event) => {
        event.preventDefault();
        addBuku();
    });
    if (isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, () => {
    const unreadBook = document.getElementById('incompleteBookshelfList');
    unreadBook.innerHTML = '';

    const readBook = document.getElementById('completeBookshelfList');
    readBook.innerHTML = '';

    for (const bookitem of books){
        const bookElement = rakBuku(bookitem);
        if (bookitem.isComplete){
            readBook.append(bookElement);
        } else
        unreadBook.append(bookElement);
    };
});
