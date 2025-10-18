📦 E-Commerce Backend

A Node.js & Express backend for a full-featured e-commerce application. Provides RESTful APIs for products, users, orders, and payments. Uses MongoDB for data storage with authentication, authorization, and security features. Scalable and ready for deployment.


+-------------------------+------------------------------------------------+
| Feature                 | Description                                    |
+-------------------------+------------------------------------------------+
| User Authentication     | Registration and login with JWT, secure pwds  |
| Role-based Authorization| Admin and user roles for restricted access    |
| Product Management      | CRUD operations for products and categories  |
| Order Management        | Place, update, and track orders               |
| Payments                | Simulated or integration-ready payment system |
| Security                | Helmet, CORS, input validation, env variables|
| Deployment Ready        | Compatible with Render, Heroku, or cloud     |
+-------------------------+------------------------------------------------+

+----------------+--------------------------+
| Category       | Technologies             |
+----------------+--------------------------+
| Backend        | Node.js, Express         |
| Database       | MongoDB, Mongoose        |
| Authentication | JWT, bcrypt              |
| Security       | Helmet, CORS             |
| Environment    | dotenv                   |
+----------------+--------------------------+

api///
+-----------+-------------------------+-----------+
| Method    | Endpoint                | Category  |
+-----------+-------------------------+-----------+
| POST      | /signup                 | Auth      |
| GET       | /getprofile             | Auth      |
| POST      | /createcat              | Category  |
| GET       | /getproducts            | Products  |
| POST      | /createo                | Orders    |
+-----------+-------------------------+-----------+

...and many more endpoints available in the full backend project.
