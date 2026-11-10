import ResetPasswordForm from "./ResetPasswordForm";

export function generateStaticParams() {
  return [{ token: "demo-token" }];
}

export const dynamicParams = false;

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <ResetPasswordForm token={params.token} />;
}
