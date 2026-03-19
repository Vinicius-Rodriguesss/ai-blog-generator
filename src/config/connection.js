import mongoose from 'mongoose';

const connectDB = async () => {
 try {
  await mongoose.connect("mongodb+srv://admin:43128529@cluster-dev.qjzfsjf.mongodb.net/promptsDB?appName=Cluster-dev");
  console.log("✅ MongoDB conectado");
 } catch (error) {
  console.error("❌ Erro ao conectar:", error);
 }
};

export default connectDB;