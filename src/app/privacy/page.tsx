import { Container, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { type Metadata } from "next";
import NextLink from "next/link";

const TEXT = [
    "1. Introduction",
    "Shyn (\"we\", \"us\", or \"our\") respects the privacy of our users (\"user\" or \"you\"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website factuality.vercel.app (the “Service”).",
    "2. Collection of Your Information",
    "We collect the following types of information:",
    "Personal Data: Personally identifiable information, such as your name and email address, that you voluntarily give to us when you choose to participate in various activities related to the Service.\n3. Use of Your Information",
    "The information we collect is used to:",
    "Provide, operate, and maintain our Service.\nImprove, personalize, and expand our Service.\nUnderstand and analyze how you use our Service.\nDevelop new products, services, features, and functionality.\n4. Disclosure of Your Information",
    "We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our Service, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.",
    "5. Security of Your Information",
    "We use administrative, technical, and physical security measures to help protect your personal information. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.",
    "6. Policy for Children",
    "We do not knowingly collect personally identifiable information from children under the age of 13. If we learn that we have collected personal information from a child under the age of 13, we will delete that information as quickly as possible.",
    "7. Changes to This Privacy Policy",
    "We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the “Last Updated” date of this Privacy Policy.",
    "8. Contact Us",
    "If you have any questions or comments about this Privacy Policy, please contact us at daniil.orel@nu.edu.kz."
];

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Shyn',
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
                <Heading size="5">Privacy Policy for Shyn</Heading>
                <Text color="gray" size="2" as="p">Last Updated: 22.01.2023 15:00</Text>
                {TEXT.map((text, i) => (
                    <Text key={i} size="3" as="p">{text}</Text>
                ))}
            </Flex>
        </Container>
    )
}