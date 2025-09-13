import dotenv from 'dotenv';
dotenv.config();

const appConfig = {
    app: {
        port: process.env.PORT || 5000,
        apiUrl: process.env.API_URL || '/api/v1',
    },
    db: {
        dbName: process.env.DB_NAME,
        dbPort: process.env.DB_PORT,
        dbUrl: process.env.NODE_ENV === "production" ? process.env.DB_ATLAS_URL : process.env.DB_URL,
    }
};

export default appConfig;