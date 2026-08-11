import AuthLayout from "../components/AuthLayout";
import SignupForm from "../components/SignupForm";

function SignupPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Create your account to start chatting."
    >
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;