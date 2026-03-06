import pool from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "Correo no encontrado" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(
      "UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperar contraseña",
      html: `
        <p>Haz clic aquí para cambiar tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return Response.json({ message: "Correo enviado correctamente" });

  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Error enviando el correo" },
      { status: 500 }
    );
  }
}