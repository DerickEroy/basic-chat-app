import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useButtonToggleFlag } from "../common/customHooks";
import { Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const [isPasswordNotConfirmed, setIsPasswordNotConfirmed] = useState(false);
  const { handler, flag } = useButtonToggleFlag();

  function submitHandler(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      setIsPasswordNotConfirmed(true);
      return;
    }
  }

  return (
    <form onSubmit={submitHandler} className="container">
      <h4>Register</h4>
      <div className="row">
        <div className="col-sm form-group">
          <label htmlFor="fName">First name</label>
          <input
            type="fName"
            id="fName"
            name="fName"
            placeholder="John"
            className="form-control"
            required
          />
        </div>
        <div className="col-sm form-group">
          <label htmlFor="lName">Last name</label>
          <input
            type="lName"
            id="lName"
            name="lName"
            placeholder="Doe"
            className="form-control"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@mail.com"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            type={flag ? "text" : "password"}
            id="password"
            name="password"
            className="form-control"
            required
          />
          <button
            onClick={handler}
            className="btn input-group-text border d-grid"
          >
            {flag ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`form-control ${isPasswordNotConfirmed && "is-invalid"}`}
          required
        />
        <small className="invalid-feedback">Password does not match.</small>
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Create
      </button>
      <small className="d-block text-center text-muted">
        Already have an account? <Link to="/login">Log In.</Link>
      </small>
    </form>
  );
}
