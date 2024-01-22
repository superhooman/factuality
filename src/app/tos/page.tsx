import { Container, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { type Metadata } from "next";
import NextLink from "next/link";

const TEXT = [
    "1. Acceptance of Terms",
    "By accessing and using Shyn factuality.vercel.app (\"the Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, please do not use the Service.",
    "2. Description of Service",
    "The Service is an online platform designed to store only the email addresses and names of its users. No other personal information is collected or stored.",
    "3. Privacy Policy",
    "Your use of the Service is also governed by our Privacy Policy, which details how we collect, use, and protect your information.",
    "4. User Obligations",
    "You must provide accurate and complete information when creating an account.\nYou agree not to use the Service for any illegal or unauthorized purpose.\nYou are responsible for maintaining the confidentiality of your account and password.\n5. Data Usage",
    "The information collected (emails and names) is used solely for the purpose of the Service’s functionality. We do not sell, trade, or otherwise transfer your personal information to outside parties.",
    "6. User Content",
    "You are solely responsible for the content that you submit, post, or display on or through the Service.",
    "7. Service Modifications",
    "We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.",
    "8. Termination",
    "We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.",
    "9. Limitation of Liability",
    "In no event shall Shyn, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.",
    "10. Governing Law",
    "These Terms shall be governed and construed in accordance with the laws of Kazakhstan, without regard to its conflict of law provisions.",
    "11. Changes to Terms",
    "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on the Service.",
    "12. Contact Us",
    "If you have any questions about these Terms, please contact us at daniil.orel@nu.edu.kz."
];

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for Shyn',
}

export default function Page() {
    return (
        <Container size="2">
            <Flex align="start" direction="column" gap="3" py="8">
                <Link asChild color="gray" size="1">
                    <NextLink href="/">
                        Go Back
                    </NextLink>
                </Link>
                <Heading size="5">Terms of Service for Shyn</Heading>
                <Text color="gray" size="2" as="p">Last Updated: 22.01.2023 15:00</Text>
                {TEXT.map((text, i) => (
                    <Text key={i} size="3" as="p">{text}</Text>
                ))}
            </Flex>
        </Container>
    )
}