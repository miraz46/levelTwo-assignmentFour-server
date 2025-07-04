import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT || 6000,
    database_url: process.env.DATABASE_URL,
}