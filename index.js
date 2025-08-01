const express = require('express');
const connectDB = require('./db');
const booksRouter = require('./routes/books');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const PORT = 3000;

// Swagger/OpenAPI setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'A simple Express Books API'
        }
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use('/books', booksRouter);

connectDB()
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err.message);
    });


