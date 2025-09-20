# Email Setup Guide for Booking Form

This document explains how to set up email functionality for the booking forms using Resend with React Email. When a user submits a booking form, all their input data will be sent to your designated email in a beautifully formatted template.

## Setup Steps

### 1. Create a Resend Account

1. Go to [Resend.com](https://resend.com) and sign up for an account
2. The free tier allows 100 emails per day, which should be sufficient for most cases

### 2. Get Your API Key

1. After creating your account, go to the API Keys page
2. Create a new API key (or use the default one)
3. Copy the API key (it starts with `re_`)

### 3. Important Free Tier Limitation

When using Resend's free tier:
1. You can **only send emails to the email address that owns the Resend account**
2. For production use, you'll need to verify a domain at [resend.com/domains](https://resend.com/domains)
3. After verifying a domain, you can change the `from` address to use your domain and send to any recipient

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following email configuration:

```
# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
```

Replace the placeholder value with your actual Resend API key.

### 5. Restart Your Development Server

After setting up the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Understanding the Implementation

This project uses two main packages for email functionality:

1. **Resend** (`resend`): A modern email API that makes it easy to send emails
2. **React Email** (`@react-email/components`, `@react-email/render`): A library for building responsive email templates with React components

The email template is defined in `src/emails/BookingConfirmation.tsx` and uses React Email components to create a professional-looking email template. When a booking form is submitted, the React Email template is rendered to HTML and sent via the Resend API.

## Testing the Email Functionality

1. Fill out any of the booking forms with test data
2. Click the "Book Appointment" button
3. Check the email account that owns the Resend account for the booking details

## Customizing Email Templates

You can customize the email template by editing `src/emails/BookingConfirmation.tsx`. This file uses React Email components to define the email layout and styling.

Some of the components used:
- `<Html>`: The root element
- `<Body>`: The email body
- `<Container>`: A container for content
- `<Section>`: A section of content
- `<Heading>`: A heading element
- `<Text>`: A text element

You can change colors, fonts, spacing, and layout by modifying the component props and styles.

## Troubleshooting

If you're not receiving emails:

1. Check your spam folder
2. Verify that your Resend API key is correct in `.env.local`
3. Check the browser console and server logs for any errors
4. Verify your Resend account is active and within the free tier limits
5. **Make sure you're checking the email that owns the Resend account**

### Common Error Messages

#### "API key invalid" or "Authentication Failed"
- Check that your Resend API key is correct
- Make sure the API key has the right permissions (should be able to send emails)

#### "You can only send testing emails to your own email address"
- This is normal for the free tier - you can only send to the email that owns the Resend account
- For sending to other recipients, you need to verify a domain

## Security Considerations

- Keep your `.env.local` file secure and never commit it to version control
- Consider rotating your Resend API key periodically
- The implementation uses a server-side API route, which keeps your API keys secure

## Moving to Production

For production use:

1. Verify a domain in the Resend dashboard
2. Update the `from` email address in your code to use your verified domain
3. After domain verification, you can send to any recipient email address

## Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)

## Next Steps

For more advanced email features, consider:

1. Setting up a custom domain for sending emails via Resend
2. Adding email templates with your brand's styling
3. Implementing email confirmation to the customer
4. Adding calendar invites to the emails 