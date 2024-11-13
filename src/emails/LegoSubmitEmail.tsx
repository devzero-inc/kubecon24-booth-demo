import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface LegoSubmitEmailProps {
  name: string;
}

export const LegoSubmitEmail = ({
  name,
}: LegoSubmitEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DevZero @ KubeCon 2024!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to DevZero @ KubeCon 2024!</Heading>
          <Text style={text}>
            Hello {name},
          </Text>
          <Text style={text}>
            Thank you for submitting your image to receive your very own personalized LEGO minifigure.
            We're excited to have met you at KubeCon 2024!
          </Text>
          <Text style={text}>
            We'll be in touch with more information about when you'll receive your LEGO minifigure soon.
          </Text>
          <Text style={text}>
            Best regards,<br />
            The DevZero Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
} as const;

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
} as const;

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
} as const;

const text = {
  color: '#1d1c1d',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '16px 0',
} as const;

const list = {
  margin: '16px 0',
  padding: '0',
} as const;

const listItem = {
  margin: '8px 0',
  fontSize: '18px',
  lineHeight: '28px',
} as const;

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
} as const;

export default LegoSubmitEmail;