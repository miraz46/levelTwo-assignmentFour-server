# Library Management System API


 **About** : Library Management System API is a RESTful backend service built with Node.js, Express, TypeScript, and MongoDB. It allows users to manage books and borrow operations, including CRUD operations for books, borrowing books with availability control, and viewing aggregated borrow summaries.

**Features** :
- Book Management:
  - Add, update, delete, and retrieve books
  - Genre validation with predefined categories
  - Unique ISBN enforcement
  - Copy count management and availability status 

- Borrow Management:
  - Borrow books with quantity and due date
  - Validation for borrow quantity and due dates
  - Aggregated borrow summaries showing total borrowed quantities per book

- Filtering & Sorting:
  - Filter books by genre
  - Sort books by various fields (e.g., createdAt, title)
  - Pagination support (optional)

- Validation & Error Handling:
  - Schema-level validation using Mongoose
  - API input validation
  - Proper HTTP status codes and error responses


 **Technologies**
- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- dotenv (for environment variables)


 **Installation**

 1. Clone the repository:
```markdown
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```
 2. Install dependencies::
```markdown
npm install
```
 3. Set up environment variables:
 Create a .env file in the root directory:
```markdown
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/Library_Management_System_assignment3?retryWrites=true&w=majority
```
Replace <username> and <password> with your MongoDB Atlas credentials or local MongoDB URI.

 4. Run the application:
```markdown
npm run dev
```

**Installation**
- Use tools like Postman or Insomnia to test API endpoints.
-Import the Postman collection (if provided) for quick testing.


## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/books`       | List all books with filtering and sorting |
| POST   | `/api/books`       | Create a new book                    |
| GET    | `/api/books/:id`   | Get a specific book by ID            |
| PATCH  | `/api/books/:id`   | Update a book                        |
| DELETE | `/api/books/:id`   | Delete a book                        |
| POST   | `/api/borrow`      | Borrow a book                        |
| GET    | `/api/borrow`      | Get borrowed books summary           |

