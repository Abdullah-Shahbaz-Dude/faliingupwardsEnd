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
  Img,
} from "@react-email/components";
import React from "react";

// Define the props interface for WorkbookSubmission component
interface WorkbookSubmissionProps {
  userName: string;
  userEmail: string;
  workbookTitle: string;
  workbookDescription: string;
  questionsAnswered: number;
  totalQuestions: number;
  submissionDate: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

// Color variables (matching existing brand)
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

export const WorkbookSubmission = ({
  userName,
  userEmail,
  workbookTitle,
  workbookDescription,
  questionsAnswered,
  totalQuestions,
  submissionDate,
  questions,
}: WorkbookSubmissionProps) => {
  const previewText = `${userName} submitted "${workbookTitle}" workbook - ${questionsAnswered}/${totalQuestions} questions answered`;

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
            <Heading style={headingStyle}>Workbook Submission Received</Heading>

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
                New workbook submission - ready for review
              </Text>
            </Section>

            {/* User Information Card */}
            <Section style={cardStyle}>
              <Heading as="h3" style={cardTitleStyle}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                  width="18"
                  height="18"
                  alt="User"
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                User Information
              </Heading>
              <Hr style={cardDividerStyle} />
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Name:</td>
                    <td style={tableValueStyle}>{userName}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Email:</td>
                    <td style={tableValueStyle}>
                      <Link href={`mailto:${userEmail}`} style={linkStyle}>
                        {userEmail}
                      </Link>
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Submission Date:</td>
                    <td style={tableValueStyle}>{submissionDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Workbook Information Card */}
            <Section style={cardStyle}>
              <Heading as="h3" style={cardTitleStyle}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/2702/2702154.png"
                  width="18"
                  height="18"
                  alt="Workbook"
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                Workbook Details
              </Heading>
              <Hr style={cardDividerStyle} />
              <table style={tableStyle}>
                <tbody>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Title:</td>
                    <td style={{...tableValueStyle, fontWeight: "bold", color: colors.primary}}>
                      {workbookTitle}
                    </td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Description:</td>
                    <td style={tableValueStyle}>{workbookDescription}</td>
                  </tr>
                  <tr style={tableRowStyle}>
                    <td style={tableLabelStyle}>Questions Answered:</td>
                    <td style={{...tableValueStyle, fontWeight: "bold"}}>
                      {questionsAnswered} of {totalQuestions} questions
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Questions and Answers */}
            <Section style={cardStyle}>
              <Heading as="h3" style={cardTitleStyle}>
                <Img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828940.png"
                  width="18"
                  height="18"
                  alt="Questions"
                  style={{ marginRight: "10px", verticalAlign: "middle" }}
                />
                Questions & Answers
              </Heading>
              <Hr style={cardDividerStyle} />
              
              {questions.map((qa, index) => (
                <div key={index} style={questionBlockStyle}>
                  <Text style={questionStyle}>
                    <strong>Q{index + 1}:</strong> {qa.question}
                  </Text>
                  <Text style={answerStyle}>
                    <strong>Answer:</strong> {qa.answer || <em style={{color: colors.lightText}}>No answer provided</em>}
                  </Text>
                  {index < questions.length - 1 && <Hr style={questionDividerStyle} />}
                </div>
              ))}
            </Section>

            {/* Actions Section */}
            <Section style={actionsStyle}>
              <Link
                href={`mailto:${userEmail}?subject=RE: ${workbookTitle} Workbook Submission&body=Hello ${userName},%0D%0A%0D%0AThank you for submitting your "${workbookTitle}" workbook. I have reviewed your responses and wanted to provide some feedback.%0D%0A%0D%0A`}
                style={primaryButtonStyle}
              >
                Respond to User
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              This is an automated notification from Falling Upward. A user has
              submitted their workbook for review.
            </Text>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Falling Upward. All rights reserved.
            </Text>
            <Text style={footerLinksStyle}>
              <Link href="https://fallingupward.co.uk" style={footerLinkStyle}>
                Website
              </Link>{" "}
              •{" "}
              <Link
                href="https://fallingupward.co.uk/privacy-policy"
                style={footerLinkStyle}
              >
                Privacy Policy
              </Link>{" "}
              •{" "}
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

const linkStyle = {
  color: colors.primary,
  textDecoration: "none",
};

const questionBlockStyle = {
  marginBottom: "20px",
};

const questionStyle = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: colors.primary,
  margin: "0 0 8px 0",
  fontWeight: "600",
};

const answerStyle = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: colors.text,
  margin: "0",
  paddingLeft: "0px",
  backgroundColor: "#f8f9fa",
  padding: "12px",
  borderRadius: "4px",
  border: `1px solid ${colors.accent}`,
};

const questionDividerStyle = {
  borderTop: `1px solid ${colors.accent}`,
  margin: "20px 0 0 0",
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

export default WorkbookSubmission;
