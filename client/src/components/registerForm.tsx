import { SubmitHandler, useForm } from "react-hook-form";
import { useButtonToggleFlag } from "../common/customHooks";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "@tanstack/react-router";
import { RegisterForm as TRegisterForm } from "../libs/zod/inferredTypes";
import { registerFormSchema } from "../libs/zod/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const { handler, flag } = useButtonToggleFlag();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerFormSchema),
  });

  const submitHandler: SubmitHandler<TRegisterForm> = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      throw new Error("Email already in use");
    } catch {
      setError("root", { message: "Failed to create an account" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="container"
      noValidate
    >
      <h4>Register</h4>
      {errors.root && (
        <small className="text-danger">{errors.root?.message}</small>
      )}
      <div className="row">
        <div className="col-sm form-group">
          <label htmlFor="fName">First name</label>
          <input
            {...register("fName")}
            type="text"
            id="fName"
            placeholder="John"
            className={`form-control ${errors.fName && "is-invalid"}`}
          />
          <small className="invalid-feedback">{errors.fName?.message}</small>
        </div>
        <div className="col-sm form-group">
          <label htmlFor="lName">Last name</label>
          <input
            {...register("lName")}
            type="text"
            placeholder="Doe"
            className={`form-control ${errors.lName && "is-invalid"}`}
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
          className={`form-control ${errors.email && "is-invalid"}`}
        />
        <small className="invalid-feedback">{errors.email?.message}</small>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            {...register("password")}
            type={flag ? "text" : "password"}
            id="password"
            className={`form-control ${errors.password && "is-invalid"}`}
          />
          <button
            onClick={handler}
            className="btn input-group-text border d-grid"
          >
            {flag ? <FaEyeSlash /> : <FaEye />}
          </button>
          <small className="invalid-feedback">{errors.password?.message}</small>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          className={`form-control ${errors.confirmPassword && "is-invalid"}`}
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
