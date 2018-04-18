class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
      const list = document.getElementById('book-list');
    //Create tr element
    const row = document.createElement('tr');
    //Insert cols
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
      //Create div
    const div = document.createElement('div');
    //Add class name
    div.className = `alert ${className}`;
    //Add text (node)
    div.appendChild(document.createTextNode(message));
    //Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    //Insert alert
    container.insertBefore(div, form);

    //Time out after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target){
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//Local Storage Class
class Store {
  //fetch for local storage
  static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
          books = [];
      } else {
          books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
  }
  static displayBooks() {
    const books = Store.getBooks();

    //loop through books
    books.forEach(function(book){
      const ui = new UI;

      //Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn, index){
    const books = Store.getBooks();
    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event listeners for Add Book
document.getElementById('book-form').addEventListener('submit', function(e){
  //Get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  //Instantiate book      
  const book = new Book(title, author, isbn);
 
  //Instantiate UI
  const ui = new UI();

  //Validate
  if(title === ''|| author === '' || isbn === ''){
      //Error alert
      ui.showAlert('Please fill in all fields', 'error');
  } else {
    //Add book to list
  ui.addBookToList(book);

  //Add to local storage. don't need to instantiate because static
  Store.addBook(book);

  //Show success
  ui.showAlert('Book Added!', 'success');

  //Clear Fields
  ui.clearFields();
  }

  

  e.preventDefault();
});


//If have something that will show up more than once with same class or something that is not there when page loads but dynamically added, will have to use event delegation

//Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){

  //Instantiate UI
  const ui = new UI();

  //Delete book
  ui.deleteBook(e.target);

  //Remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show message
  ui.showAlert('Book removed!', 'success');
  e.preventDefault();
});