import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useButtonToggleFlag } from "../common/customHooks";
import { Link } from "@tanstack/react-router";

export default function LoginForm() {
    const { handler, flag } = useButtonToggleFlag();

    return (
        <form className="container">
            <h4>Log In</h4>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                    <input type={flag ? 'text' : 'password'} id="password" name="password" className="form-control" />
                    <button onClick={handler} className="btn input-group-text border d-grid">
                        { flag ? <FaEyeSlash /> : <FaEye /> }
                    </button>
                </div>
                <small><Link>Forgot password?</Link></small>
            </div>
            <button type="submit" className="btn btn-primary w-100">Log In</button>
            <small className="d-block text-center text-muted">Don't have an account? <Link to='/register'>Create an account.</Link></small>
        </form>
    )
}