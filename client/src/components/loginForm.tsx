import axios from "../libs/axios";
import { ParsedAppError } from "../common/utils";
import { userLoginRequestSchema } from "../libs/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLocalStorage } from "../common/hooks";
import type { UserLoginRequest } from "../types/requests";
import type { AuthResponse } from "../types/responses";
import type { AxiosError } from "axios";

export default function LoginForm() {
  const [, setJwt] = useLocalStorage("jwt", "");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginRequest>({
    resolver: zodResolver(userLoginRequestSchema),
  });

  const submitHandler = useMutation({
    mutationFn: (data: UserLoginRequest) =>
      axios.post<AuthResponse>("http://localhost:4000/users/login", data),
    onSuccess: (res) => {
      setJwt(res.data.jwt);
      navigate({ to: res.data.redirectUrl });
    },
    onError: (error: AxiosError) => {
      const appError = ParsedAppError.parse(
        error.response?.data,
        "An error occurred while logging in."
      );

      const fields: (keyof UserLoginRequest)[] = ["email", "password"];

      fields.forEach((field) => {
        const cause = appError.getPropertyCause(field);

        if (cause) {
          setError(field, { message: cause.message });
        }
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => submitHandler.mutate(data))}
      className="container"
      noValidate
      data-testid="form"
    >
      <h4>Log In</h4>
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
