import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_PASSWORD,
  },
});

export const emailService = {
  async sendEventConfirmation(userEmail: string, eventTitle: string, userName: string) {
    const mailOptions = {
      from: process.env.ETHEREAL_EMAIL,
      to: userEmail,
      subject: `Event Registration Confirmation - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Event Registration Confirmed!</h2>
          <p>Hello ${userName},</p>
          <p>You have successfully registered for <strong>${eventTitle}</strong>.</p>
          <p>We're excited to have you join us!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;">Need to make changes? Visit your event dashboard to manage your registration.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  async sendEventCreation(organizerEmail: string, eventTitle: string) {
    const mailOptions = {
      from: process.env.ETHEREAL_EMAIL,
      to: organizerEmail,
      subject: `Event Created Successfully - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Event Has Been Created!</h2>
          <p>Congratulations! Your event <strong>${eventTitle}</strong> has been successfully created.</p>
          <p>You can now share the event link with potential attendees and manage registrations through your dashboard.</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  },
};