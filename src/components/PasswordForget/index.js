import React, { Component } from "react"
import { Link } from "react-router-dom"

import { withFirebase } from "../Firebase"
import * as ROUTES from "../../constants/routes"

const PasswordForgetPage = () => (
    <div>
        <h1>Forgot Password</h1>
        <PasswordForgetForm />
    </div>
)

const INITIAL_STATE = {
    email: "",
    error: null,
}

class PaswordForgetFormBase extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ...INITIAL_STATE
        }
    }

    onSubmit = e => {
        e.preventDefault()

        const { email } = this.state
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE })
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {email, error} = this.state
        const isInvalid = email === ""

        return (
            <form onSubmit={this.onSubmit}>
                <input 
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <button disabled={isInvalid} type="submit">
                    Reset Password
                </button>

                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
)

const PasswordForgetForm = withFirebase(PaswordForgetFormBase)

export default PasswordForgetPage
export {PasswordForgetForm, PasswordForgetLink}