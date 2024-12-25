import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../components/registerForm";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  return <RegisterForm />;
}
