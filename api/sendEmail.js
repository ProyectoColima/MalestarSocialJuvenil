export default async function (req, res) {
    if (req.method === 'POST') {
        const { nombre, email, mensaje } = req.body;

        // Configuración de nodemailer y envío del correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Cambia a tu servicio de correo si no es Gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: `Nuevo mensaje de contacto de ${nombre}`,
                text: mensaje,
                html: `<p><strong>Nombre:</strong> ${nombre}</p>
                       <p><strong>Correo:</strong> ${email}</p>
                       <p><strong>Mensaje:</strong> ${mensaje}</p>`,
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error al enviar el correo' });
        }
    } else {
        // Respuesta para métodos no permitidos
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
