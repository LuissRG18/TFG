const mongoose = require('mongoose');

// Caché de conexión para reutilizarla entre invocaciones serverless
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect((process.env.MONGODB_URI || '').trim())
      .then((m) => {
        console.log(`✅ MongoDB conectado: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Error al conectar MongoDB:', error.message);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;

