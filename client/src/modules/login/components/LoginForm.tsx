import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useToggleShowPassword } from "../../../common/customHooks";

export default function LoginForm() {
    const { handler, flag } = useToggleShowPassword();

    return (
        <form className="container">
            <h3>Log In</h3>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                    <input type={flag ? 'text' : 'password'} id="password" name="password" className="form-control" />
                    <div className="input-group-append">
                        <button onClick={handler} className="btn input-group-text">
                            { flag ? <FaEyeSlash /> : <FaEye /> }
                        </button>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Log In</button>
        </form>
    )
}