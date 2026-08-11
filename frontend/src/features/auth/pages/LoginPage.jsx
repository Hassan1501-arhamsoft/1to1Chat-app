import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue chatting."
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;