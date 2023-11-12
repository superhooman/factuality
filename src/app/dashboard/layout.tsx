import { Container } from "@radix-ui/themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Container px="4" size="2">{children}</Container>;
}
