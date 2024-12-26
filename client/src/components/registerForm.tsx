import axios from "../libs/axios";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { ParsedAppError } from "../common/utils";
import { registerFormSchema } from "../libs/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type {
  RegisterFormWithConfirmPassword,
  RegisterForm as TRegisterForm,
} from "../common/types";

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm & { confirmPassword: string }>({
    resolver: zodResolver(registerFormSchema),
  });

  const submitHandler = useMutation({
    mutationFn: (data: TRegisterForm) =>
      axios.post("http://localhost:4000/users/register", data),
    onSuccess: (res) => {
      if (res.status === 201) {
        navigate({ to: res.data.redirectUrl });
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response) {
          const appError = new ParsedAppError(error.response.data);

          const fields: (keyof RegisterFormWithConfirmPassword)[] = [
            "fName",
            "lName",
            "email",
            "password",
            "confirmPassword",
          ];

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
        setError("root", { message: "Failed to create an account." });
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
      <h4>Register</h4>
      {errors.root ? (
        <small className="text-danger">{errors.root?.message}</small>
      ) : null}
      <div className="row">
        <div className="col-sm form-group">
          <label htmlFor="fName">First name</label>
          <input
            {...register("fName")}
            type="text"
            id="fName"
            placeholder="John"
            className={`form-control ${errors.fName ? "is-invalid" : ""}`}
          />
          <small className="invalid-feedback">{errors.fName?.message}</small>
        </div>
        <div className="col-sm form-group">
          <label htmlFor="lName">Last name</label>
          <input
            {...register("lName")}
            type="text"
            id="lName"
            placeholder="Doe"
            className={`form-control ${errors.lName ? "is-invalid" : ""}`}
          />
          <small className="invalid-feedback">{errors.lName?.message}</small>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="example@mail.com"
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
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
        />
        <small className="invalid-feedback">
          {errors.confirmPassword?.message}
        </small>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isSubmitting}
      >
        Create
      </button>
      <small className="d-block text-center text-muted">
        Already have an account? <Link to="/login">Log In.</Link>
      </small>
    </form>
  );
}
