import app from "./app";
import transporter from "./config/nodemailer.config";

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
