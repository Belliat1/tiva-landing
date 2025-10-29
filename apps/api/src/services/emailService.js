import nodemailer from 'nodemailer';
import config from '../config.js';

// Configurar el transporter de email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // Puedes cambiar por otro servicio
    auth: {
      user: process.env.EMAIL_USER || 'tiva.store.app@gmail.com',
      pass: process.env.EMAIL_PASS || 'tu_app_password_aqui'
    }
  });
};

// Plantilla de email para reset de contraseña
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5175'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tiva.store.app@gmail.com',
      to: email,
      subject: '🔐 Restablecer tu contraseña - Tiva Store',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer Contraseña</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #84cc16, #65a30d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #84cc16; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #65a30d; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #fecaca; color: #92400e; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ Tiva Store</h1>
              <p>Restablecer tu contraseña</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Tiva Store.</p>
              
              <p>Si solicitaste este cambio, haz clic en el botón de abajo para crear una nueva contraseña:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">🔐 Restablecer Contraseña</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                  <li>Este enlace expira en 1 hora</li>
                  <li>Solo puedes usarlo una vez</li>
                  <li>Si no solicitaste este cambio, ignora este email</li>
                </ul>
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace;">
                ${resetUrl}
              </p>
              
              <p>¿Necesitas ayuda? Contáctanos en <a href="mailto:support@tivastore.com">support@tivastore.com</a></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Tiva Store. Todos los derechos reservados.</p>
              <p>Este email fue enviado automáticamente, por favor no respondas.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de reset enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error enviando email de reset:', error);
    throw new Error('Error al enviar el email de restablecimiento');
  }
};

// Plantilla de email de confirmación de cuenta
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'tiva.store.app@gmail.com',
      to: email,
      subject: '🎉 ¡Bienvenido a Tiva Store!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Tiva Store</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #84cc16, #65a30d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #84cc16; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background: #65a30d; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #84cc16; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ Tiva Store</h1>
              <p>¡Bienvenido a tu nueva tienda online!</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              
              <p>¡Felicitaciones! Tu cuenta en Tiva Store ha sido creada exitosamente.</p>
              
              <p>Ahora puedes:</p>
              
              <div class="feature">
                <strong>📦 Gestionar Productos</strong><br>
                Agrega, edita y organiza tu catálogo de productos
              </div>
              
              <div class="feature">
                <strong>🛒 Recibir Pedidos</strong><br>
                Los clientes pueden comprar directamente por WhatsApp
              </div>
              
              <div class="feature">
                <strong>📊 Ver Analytics</strong><br>
                Analiza tus ventas y el rendimiento de tu tienda
              </div>
              
              <div class="feature">
                <strong>🔗 Crear Catálogo Público</strong><br>
                Genera enlaces únicos para que tus clientes compren
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard" class="button">
                  🚀 Ir a mi Dashboard
                </a>
              </div>
              
              <p>¿Necesitas ayuda para empezar? Revisa nuestra guía de inicio rápido o contáctanos.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Tiva Store. Todos los derechos reservados.</p>
              <p>Este email fue enviado automáticamente, por favor no respondas.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    throw new Error('Error al enviar el email de bienvenida');
  }
};

// Función para probar la conexión de email
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Conexión de email configurada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error);
    return false;
  }
};
