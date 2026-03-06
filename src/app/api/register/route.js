import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Verificar si el correo ya existe
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return Response.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Insertar nuevo usuario
    await pool.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)",
      [email, password]
    );

    return Response.json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    return Response.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}