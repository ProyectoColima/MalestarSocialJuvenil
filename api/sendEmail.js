const nodemailer = require('nodemailer');

export default async function (req, res) {
    if (req.method === 'POST') {
        const { nombre, email, mensaje } = req.body;

        // Configura el transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Cambia esto si usas otro proveedor
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        try {
            // Envía el correo electrónico
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: `Nuevo mensaje de ${nombre}`,
                text: mensaje,
                html: `<p><strong>Nombre:</strong> ${nombre}</p>
                       <p><strong>Correo:</strong> ${email}</p>
                       <p><strong>Mensaje:</strong> ${mensaje}</p>`,
            });

            // Responde con éxito
            res.status(200).json({ success: true });
        } catch (error) {
            // Maneja errores y responde con un mensaje adecuado
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ success: false, error: 'Error al enviar el correo' });
        }
    } else {
        // Si el método no es POST, responde con un error 405
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ success: false, message: `Método ${req.method} no permitido` });
    }
}
