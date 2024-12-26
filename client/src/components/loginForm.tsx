import axios from "../libs/axios";
import { isAxiosError } from "axios";
import { ParsedAppError } from "../common/utils";
import { loginFormSchema } from "../libs/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { NonFunctionKeys } from "utility-types";
import type { LoginForm as TLoginForm } from "../common/types";

export default function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const submitHandler = useMutation({
    mutationFn: (data: TLoginForm) =>
      axios.post("http://localhost:4000/users/login", data),
    onSuccess: (res) => {
      if (res.status === 200) {
        navigate({ to: res.data.redirectUrl });
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response) {
          const appError = new ParsedAppError(error.response.data);

          const fields: NonFunctionKeys<TLoginForm>[] = ["email", "password"];

          fields.forEach((field) => {
            const cause = appError.getPropertyCause(field);

            if (cause) {
              setError(field, { message: cause.message });
            }
          });
        } else {
          throw new Error("Response data is missing.");
        }
      } else {
        setError("root", { message: "Failed to log in account." });
      }
    },
  });

  return (
    <form
      onSubmit={handleSubmit(
        async (data) => await submitHandler.mutateAsync(data)
      )}
      className="container"
      noValidate
      data-testid="form"
    >
      <h4>Log In</h4>
      {errors.root ? (
        <small className="text-danger">{errors.root?.message}</small>
      ) : null}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
        />
        <small className="invalid-feedback">{errors.email?.message}</small>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            {...register("password")}
            type="password"
            id="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <small className="invalid-feedback">{errors.password?.message}</small>
        </div>
        <small>
          <Link>Forgot password?</Link>
        </small>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isSubmitting}
      >
        Log In
      </button>
      <small className="d-block text-center text-muted">
        Don't have an account? <Link to="/register">Create an account.</Link>
      </small>
    </form>
  );
}
