import axios from 'axios';

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.FROM_EMAIL || 'noreply@tourera.com';
    const senderName = process.env.BREVO_SENDER_NAME || process.env.FROM_NAME || 'Tourera Support';

    if (!apiKey) {
      console.warn('BREVO_API_KEY is missing. Email skipped but logged:');
      console.warn('To:', to);
      console.warn('Subject:', subject);
      console.warn('HTML:', htmlContent);
      return { success: true, message: 'Simulated email sent' };
    }

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Email sending error:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};