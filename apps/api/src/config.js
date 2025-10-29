export default {
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://f25823463_db_user:T719PoVtmbnPOyC8@clustertiva.seztn9k.mongodb.net/TivaStore?retryWrites=true&w=majority&appName=ClusterTiva",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkeytiva",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "dbkpipizy",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "376188943244162",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "lNcpMUKZllgbpuM7ZUZz82cxqWo",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000"
};
