import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}