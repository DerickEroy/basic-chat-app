import axios from "../libs/axios";
import { useForm } from "react-hook-form";
import { ParsedAppError } from "../common/utils";
import { userRegisterRequestSchema } from "../libs/zod";
import { useLocalStorage } from "../common/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { UserRegisterRequest } from "../types/requests";
import type { AuthResponse } from "../types/responses";
import type { AxiosError } from "axios";

export default function RegisterForm() {
  const [, setJwt] = useLocalStorage("jwt", "");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterRequest>({
    resolver: zodResolver(userRegisterRequestSchema),
  });

  const submitHandler = useMutation({
    mutationFn: (data: UserRegisterRequest) =>
      axios.post<AuthResponse>("/users/register", data),
    onSuccess: (res) => {
      setJwt(res.data.jwt);
      navigate({ to: res.data.redirectUrl });
    },
    onError: (error: AxiosError) => {
      const appError = ParsedAppError.parse(
        error.response?.data,
        "An error occurred while registering."
      );

      const fields: (keyof UserRegisterRequest)[] = [
        "fName",
        "lName",
        "email",
        "password",
      ];

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
      <h4>Register</h4>
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
