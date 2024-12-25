import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useToggleShowPassword } from "../../../common/customHooks";

export default function RegisterForm() {
    const { handler, isShow } = useToggleShowPassword();

    return (
        <form className="container">
            <h3>Register</h3>
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
                    <input type={isShow ? 'text' : 'password'} id="password" name="password" className="form-control" />
                    <div className="input-group-append">
                        <button onClick={handler} className="btn input-group-text">
                            { isShow ? <FaEyeSlash /> : <FaEye /> }
                        </button>
                    </div>
                </div>
                <small className="text-muted">Your password must be at least 8 characters long.</small>
            </div>
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="confirmPassword" id="confirmPassword" name="confirmPassword" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}