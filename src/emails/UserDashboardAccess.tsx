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
  Link,
  Button,
} from "@react-email/components";
import React from "react";

// Define the props interface for our UserDashboardAccess component
interface UserDashboardAccessProps {
  userName: string;
  userEmail: string;
  dashboardLink: string;
  workbookTitles: string[];
  adminName?: string;
}

// Color variables matching the admin dashboard design
const colors = {
  primary: "#0B4073",
  secondary: "#1a5490", 
  accent: "#7094B7",
  background: "#f8fafc",
  cardBg: "#ffffff",
  text: "#333333",
  lightText: "#666666",
  border: "#e2e8f0",
  success: "#4CAF50",
};

export const UserDashboardAccess = ({
  userName,
  userEmail,
  dashboardLink,
  workbookTitles,
  adminName = "Falling Upward Team",
}: UserDashboardAccessProps) => {
  const previewText = `Your Falling Upward workbooks are ready - Access your dashboard`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header Section */}
          <Section style={headerStyle}>
            <Heading style={logoStyle}>Falling Upward</Heading>
            <Text style={headerSubtitleStyle}>Personal Growth & Development</Text>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            <Heading style={mainHeadingStyle}>
              Welcome to Your Personal Dashboard! 🌟
            </Heading>
            
            <Text style={greetingStyle}>
              Hello {userName},
            </Text>
            
            <Text style={paragraphStyle}>
              Great news! Your personal workbooks have been prepared and are ready for you to begin your journey of growth and self-discovery.
            </Text>

            {/* Workbooks Section */}
            <Section style={workbooksSection}>
              <Heading style={sectionHeadingStyle}>Your Assigned Workbooks:</Heading>
              {workbookTitles.map((title, index) => (
                <Text key={index} style={workbookItemStyle}>
                  📚 {title}
                </Text>
              ))}
            </Section>

            {/* Access Button */}
            <Section style={buttonSectionStyle}>
              <Button href={dashboardLink} style={buttonStyle}>
                Access Your Dashboard
              </Button>
            </Section>

            <Text style={paragraphStyle}>
              <strong>What to expect:</strong>
            </Text>
            <Text style={listItemStyle}>
              • Complete your workbooks at your own pace
            </Text>
            <Text style={listItemStyle}>
              • Save your progress as you go
            </Text>
            <Text style={listItemStyle}>
              • Submit when you're ready for review
            </Text>
            <Text style={listItemStyle}>
              • Receive personalized feedback
            </Text>

            <Hr style={dividerStyle} />

            <Text style={importantNoteStyle}>
              <strong>Important:</strong> This is a secure, one-time access link. Please bookmark it or save this email for future reference.
            </Text>

            <Text style={paragraphStyle}>
              If you have any questions or need assistance, please don't hesitate to reach out to us.
            </Text>

            <Text style={signatureStyle}>
              Best regards,<br />
              {adminName}<br />
              <span style={companyStyle}>Falling Upward</span>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              This email was sent to {userEmail}. This is an automated message from your Falling Upward dashboard.
            </Text>
            <Text style={footerTextStyle}>
              © 2024 Falling Upward. All rights reserved.
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
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: colors.cardBg,
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
};

const headerStyle = {
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  padding: "40px 30px",
  textAlign: "center" as const,
};

const logoStyle = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  letterSpacing: "-0.5px",
};

const headerSubtitleStyle = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "16px",
  margin: "0",
  fontWeight: "500",
};

const contentStyle = {
  padding: "40px 30px",
};

const mainHeadingStyle = {
  color: colors.primary,
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
  lineHeight: "1.3",
};

const greetingStyle = {
  color: colors.text,
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const paragraphStyle = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const workbooksSection = {
  backgroundColor: colors.background,
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  border: `2px solid ${colors.border}`,
};

const sectionHeadingStyle = {
  color: colors.primary,
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const workbookItemStyle = {
  color: colors.text,
  fontSize: "16px",
  margin: "8px 0",
  fontWeight: "500",
};

const buttonSectionStyle = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  padding: "16px 32px",
  textDecoration: "none",
  display: "inline-block",
  boxShadow: "0 4px 12px rgba(11, 64, 115, 0.3)",
  transition: "all 0.3s ease",
};

const listItemStyle = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "8px 0",
  paddingLeft: "8px",
};

const dividerStyle = {
  border: "none",
  borderTop: `2px solid ${colors.border}`,
  margin: "32px 0",
};

const importantNoteStyle = {
  backgroundColor: "#fff3cd",
  border: "1px solid #ffeaa7",
  borderRadius: "8px",
  color: "#856404",
  fontSize: "15px",
  lineHeight: "1.5",
  margin: "24px 0",
  padding: "16px",
};

const signatureStyle = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "32px 0 0 0",
};

const companyStyle = {
  color: colors.primary,
  fontWeight: "600",
};

const footerStyle = {
  backgroundColor: colors.background,
  padding: "24px 30px",
  textAlign: "center" as const,
  borderTop: `1px solid ${colors.border}`,
};

const footerTextStyle = {
  color: colors.lightText,
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "8px 0",
};

export default UserDashboardAccess;
