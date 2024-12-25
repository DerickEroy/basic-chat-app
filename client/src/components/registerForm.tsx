import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useToggleShowPassword } from "../common/customHooks";
import { Link } from "@tanstack/react-router";

export default function RegisterForm() {
    const { handler, flag } = useToggleShowPassword();

    return (
        <form className="container">
            <h4>Register</h4>
            <div className="row">
                <div className="col-sm form-group">
                    <label htmlFor="fName">First name</label>
                    <input type="fName" id="fName" name="fName" placeholder="John" className="form-control" />
                </div>
                <div className="col-sm form-group">
                    <label htmlFor="lName">Last name</label>
                    <input type="lName" id="lName" name="lName" placeholder="Doe" className="form-control" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="example@mail.com" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                    <input type={flag ? 'text' : 'password'} id="password" name="password" className="form-control" />
                    <button onClick={handler} className="btn input-group-text border d-grid">
                        { flag ? <FaEyeSlash /> : <FaEye /> }
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="confirmPassword" id="confirmPassword" name="confirmPassword" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary w-100">Create</button>
            <small className="d-block text-center text-muted">Already have an account? <Link to='/login'>Log In.</Link></small>
        </form>
    )
}