
# 🎬 Movie Explorer Backend

This is the backend service for the **Movie Explorer** application, providing RESTful APIs for movie data retrieval, user authentication, and user-specific functionalities like managing favorite movies.

---

## 🚀 Features

* **User Authentication**: Secure user registration and login functionalities.
* **Favorites Management**: Users can add or remove movies from their favorites list.
* **Middleware Integration**: Utilizes middleware for authentication and error handling.
* **Deployment Ready**: Configured for deployment on platforms like Vercel.([GitHub][1])

---

## 🛠️ Project Setup

### Prerequisites

* **Node.js** (v14 or higher)
* **npm** (v6 or higher)
* **MongoDB** instance (local or cloud-based)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mutHu-19/Movie-backend.git
   cd Movie-backend
   ```



2. **Install Dependencies**:

   ```bash
   npm install
   ```



3. **Configure Environment Variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY = your_tmdb_api_key
   ```



4. **Start the Server**:

   ```bash
   npm start
   ```



The server should now be running at `http://localhost:5000`.

---

## 📚 API Usage

### Authentication

* **Register User**

  * **Endpoint**: `POST /api/auth/register`
  * **Body**:

    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```

* **Login User**

  * **Endpoint**: `POST /api/auth/login`
  * **Body**:([LinkedIn][2])

    ```json
    {
      "email": "john@example.com",
      "password": "securepassword"
    }
    ```

### Movies

* **Get All Movies**

  * **Endpoint**: `GET /api/movies`

* **Get Movie by ID**

  * **Endpoint**: `GET /api/movies/:id`

* **Add New Movie** *(Admin Only)*

  * **Endpoint**: `POST /api/movies`

  * **Headers**:([GitHub][1])

    ```http
    Authorization: Bearer <token>
    ```

  * **Body**:

    ```json
    {
      "title": "Inception",
      "description": "A mind-bending thriller",
      "releaseYear": 2010
    }
    ```

### Favorites

* **Add to Favorites**

  * **Endpoint**: `POST /api/users/favorites`

  * **Headers**:([GitHub][3])

    ```http
    Authorization: Bearer <token>
    ```

  * **Body**:

    ```json
    {
      "movieId": "movie_id_here"
    }
    ```

* **Get User Favorites**

  * **Endpoint**: `GET /api/users/favorites`
  * **Headers**:([GitHub][3])

    ```http
    Authorization: Bearer <token>
    ```

* **Remove from Favorites**

  * **Endpoint**: `DELETE /api/users/favorites/:movieId`
  * **Headers**:

    ```http
    Authorization: Bearer <token>
    ```

---

## 🧾 Folder Structure

```plaintext
Movie-backend/
├── config/             # Configuration files (e.g., DB connection)
├── controllers/        # Route handlers
├── data/               # Sample data or seed files
├── middleware/         # Custom middleware (e.g., auth)
├── models/             # Mongoose models
├── routes/             # API route definitions
├── utils/              # Utility functions
├── .gitignore
├── package.json
├── server.js           # Entry point
└── vercel.json         # Vercel deployment configuration
```



---

## 🌐 Deployment

The backend is configured for deployment on Vercel. Ensure that environment variables are set appropriately in the Vercel dashboard.

---

