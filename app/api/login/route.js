import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1️⃣ Buscar usuario por correo
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    // 2️⃣ Si no existe el usuario
    if (rows.length === 0) {
      return Response.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = rows[0];

    // 3️⃣ Verificar contraseña
    if (user.password !== password) {
      return Response.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // 4️⃣ Si todo es correcto
    return Response.json({ message: "Login exitoso" });

  } catch (error) {
    return Response.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}