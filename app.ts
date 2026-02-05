import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./src/config/firebase.config";
import transporter from "./src/config/nodemailer.config";
import accessRouter from "./src/routes/access.route";
import documentsRouter from "./src/routes/documents.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/access", accessRouter);
app.use("/api/documents", documentsRouter);

const PORT = process.env.PORT || 3000;

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error conectando con Gmail:", error);
  } else {
    console.log("✅ Nodemailer conectado correctamente a Gmail");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
