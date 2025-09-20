import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Img,
  Link,
} from "@react-email/components";
import React from "react";
import { formatValue } from "@/utils/formatting";

// Define the props interface for our BookingConfirmation component
interface BookingConfirmationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  consultationType: string;
  additionalFields?: Record<string, any>;
  message?: string;
}

// Color variables
const colors = {
  primary: "#0B4073",
  secondary: "#7094B7",
  accent: "#D6E2EA",
  background: "#f9fafb",
  cardBg: "#ffffff",
  text: "#333333",
  lightText: "#666666",
  border: "#e2e8f0",
  success: "#4CAF50",
};

export const BookingConfirmation = ({
  customerName,
  customerEmail,
  customerPhone,
  consultationType,
  additionalFields = {},
  message = "Thank you for your booking request. We will review your information and get back to you shortly to confirm your appointment.",
}: BookingConfirmationProps) => {
  const previewText = `New Booking Request from ${customerName} - ${consultationType}`;

  // Use our utility function for formatting values
  const formatFieldValue = formatValue;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header with Logo */}
          <Section style={headerStyle}>
            <Img
              src="https://fallingupward.co/favicon.png"
              alt="Falling Upward Logo"
              width="180"
              height="auto"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Main Content */}
          <Section style={mainContentStyle}>
            <Heading style={headingStyle}>New Booking Request</Heading>

            {/* Status Banner */}
            <Section style={statusBannerStyle}>
              <Text style={statusTextStyle}>
                <Img
                  src="https://fallingupward.co/favicon.png"
                  width="16"
                  height="16"
                  alt="Success"
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    verticalAlign: "middle",
                  }}
                />
                New booking received - awaiting confirmation
              </Text>
            </Section>

            {/* Customer Information Card */}
            <Section style={cardStyle}>
              <Heading as="h3" style={cardTitleStyle}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                  width="18"
                  height="18"
                  alt="User"
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                Customer Information
              </Heading>
              <Hr style={cardDividerStyle} />
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Name:</td>
                    <td style={tableValueStyle}>{customerName}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Email:</td>
                    <td style={tableValueStyle}>
                      <Link href={`mailto:${customerEmail}`} style={linkStyle}>
                        {customerEmail}
                      </Link>
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Phone:</td>
                    <td style={tableValueStyle}>
                      <Link href={`tel:${customerPhone}`} style={linkStyle}>
                        {customerPhone}
                      </Link>
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Service:</td>
                    <td
                      style={{
                        ...tableValueStyle,
                        fontWeight: "bold",
                        color: colors.primary,
                      }}
                    >
                      {consultationType}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Additional Fields Section (if any) */}
            {Object.keys(additionalFields).length > 0 && (
              <Section style={cardStyle}>
                <Heading as="h3" style={cardTitleStyle}>
                  <Img
                    src="https://cdn-icons-png.flaticon.com/512/4301/4301702.png"
                    width="18"
                    height="18"
                    alt="Details"
                    style={{ marginRight: "10px", verticalAlign: "middle" }}
                  />
                  Additional Details
                </Heading>
                <Hr style={cardDividerStyle} />
                <table style={tableStyle}>
                  <tbody>
                    {Object.entries(additionalFields).map(([key, value]) => {
                      // Format key for display
                      const formattedKey = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace(/([a-z])([A-Z])/g, "$1 $2");

                      const formattedValue = formatFieldValue(value);

                      return (
                        <tr key={key} style={tableRowStyle}>
                          <td style={tableLabelStyle}>{formattedKey}:</td>
                          <td style={tableValueStyle}>{formattedValue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Message Section */}
            <Section style={cardStyle}>
              <Heading as="h3" style={cardTitleStyle}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/1237/1237946.png"
                  width="18"
                  height="18"
                  alt="Message"
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                Additional Message
              </Heading>
              <Hr style={cardDividerStyle} />
              <Text style={messageStyle}>{message}</Text>
            </Section>

            {/* Actions Section */}
            <Section style={actionsStyle}>
              <Link
                href={`mailto:${customerEmail}?subject=RE: ${consultationType} Booking Confirmation&body=Hello ${customerName},%0D%0A%0D%0AI'm writing regarding your ${consultationType} booking request.%0D%0A%0D%0A`}
                style={primaryButtonStyle}
              >
                Respond to Customer
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              This is an automated message from Falling Upward. Please do not
              reply directly to this email.
            </Text>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Falling Upward. All rights reserved.
            </Text>
            <Text style={footerLinksStyle}>
              <Link href="https://fallingupward.co.uk" style={footerLinkStyle}>
                Website
              </Link>{" "}
              •
              <Link
                href="https://fallingupward.co.uk/privacy-policy"
                style={footerLinkStyle}
              >
                Privacy Policy
              </Link>{" "}
              •
              <Link
                href="https://fallingupward.co.uk/contact"
                style={footerLinkStyle}
              >
                Contact Us
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const bodyStyle = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "0",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const headerStyle = {
  backgroundColor: colors.cardBg,
  padding: "24px",
  borderRadius: "12px 12px 0 0",
  textAlign: "center" as const,
  borderBottom: `1px solid ${colors.accent}`,
};

const mainContentStyle = {
  backgroundColor: colors.cardBg,
  borderRadius: "0 0 12px 12px",
  padding: "24px 30px 30px",
  marginBottom: "20px",
};

const headingStyle = {
  color: colors.primary,
  fontSize: "26px",
  fontWeight: "bold",
  margin: "12px 0 26px",
  textAlign: "center" as const,
};

const statusBannerStyle = {
  backgroundColor: "#e6f7ee",
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "24px",
  textAlign: "center" as const,
  border: "1px solid #c3e6d1",
};

const statusTextStyle = {
  color: colors.success,
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const cardStyle = {
  border: `1px solid ${colors.accent}`,
  borderRadius: "8px",
  padding: "22px 24px",
  marginBottom: "24px",
  backgroundColor: colors.cardBg,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

const cardTitleStyle = {
  color: colors.primary,
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
  display: "flex",
  alignItems: "center",
};

const cardDividerStyle = {
  borderTop: `1px solid ${colors.accent}`,
  margin: "12px 0 18px",
};

// Table styles for better alignment
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const tableRowStyle = {
  borderBottom: `1px solid ${colors.accent}`,
};

const tableLabelStyle = {
  color: colors.lightText,
  fontSize: "14px",
  padding: "10px 0",
  width: "150px",
  textAlign: "left" as const,
  verticalAlign: "top" as const,
  fontWeight: "500",
};

const tableValueStyle = {
  color: colors.text,
  fontSize: "15px",
  padding: "10px 0",
  fontWeight: "500",
  textAlign: "left" as const,
  verticalAlign: "top" as const,
  lineHeight: "1.5",
};

// Legacy styles kept for backward compatibility
const rowStyle = {
  marginBottom: "12px",
};

const labelColumnStyle = {
  width: "150px",
  verticalAlign: "top" as const,
};

const valueColumnStyle = {
  width: "100%",
};

const labelStyle = {
  color: colors.lightText,
  fontSize: "14px",
  margin: "5px 0",
  paddingRight: "12px",
  fontWeight: "500",
};

const valueStyle = {
  color: colors.text,
  fontSize: "15px",
  fontWeight: "500",
  margin: "5px 0",
  lineHeight: "1.5",
};

const linkStyle = {
  color: colors.primary,
  textDecoration: "none",
};

const messageStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: colors.text,
  margin: "12px 0",
  padding: "0",
};

const actionsStyle = {
  textAlign: "center" as const,
  marginTop: "30px",
  marginBottom: "20px",
};

const primaryButtonStyle = {
  backgroundColor: colors.primary,
  borderRadius: "6px",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
  display: "inline-block",
};

const footerStyle = {
  textAlign: "center" as const,
  padding: "0 24px 24px",
};

const footerTextStyle = {
  color: colors.lightText,
  fontSize: "13px",
  margin: "4px 0",
};

const footerLinksStyle = {
  margin: "15px 0 0",
  color: colors.lightText,
  fontSize: "13px",
};

const footerLinkStyle = {
  color: colors.primary,
  textDecoration: "none",
  margin: "0 5px",
};

export default BookingConfirmation;
