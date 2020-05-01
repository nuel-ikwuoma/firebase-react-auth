import React, { Component } from "react"
import { compose } from "recompose"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"

import  * as ROUTES from "../../constants/routes"

import { SignUpLink } from "../SignUp"
import { PasswordForgetLink } from "../PasswordForget"

const SignInPage = () => (
    <div>
        <h1>Sign in</h1>
        <SignInForm />
        <SignInGoogle />
        <SignInFacebook />
        <SignUpLink />
        <PasswordForgetLink />
    </div>
)

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
}

class SignInFormBase extends Component {
    constructor(props) {
        super(props)

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = event => {
        event.preventDefault()
        const { email, password } = this.state
        
        this.props.firebase
        .doSignInWithEmailAndPassword(email, password)
            .then((e) => {
                console.log("sign-in success")
                this.setState({ ...INITIAL_STATE })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                console.log(error)
                this.setState({ error })
            })
    }

    onChange = event => {
        this.setState({ [event.target.name ]: event.target.value})
    }

    render() {
        const { email, password, error } = this.state
        const isInvalid = password === "" || email === ""

        return(
            <form onSubmit={this.onSubmit} >
                <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={this.onChange}
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.onChange}
                    placeholder="password"
                    autoComplete="off"
                />
                <button disabled={isInvalid}>
                    Sign In
                </button>

                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props)

        this.state = { error: null}
    }

    onSubmit = (event) => {
        event.preventDefault()

        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                const { displayName: username, email } = socialAuthUser.user
                // create a user in firebase realtime db
                if(socialAuthUser.additionalUserInfo.isNewUser){
                    console.log("google auth user", socialAuthUser)
                    return this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .set({
                            username,
                            email,
                            roles: {},
                        })
                }
            })
            .then(() => {
                this.setState({ error: null })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    render() {
        const { error } = this.state

        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Signin with google</button>

                {error && <p>{error.message}</p>}
            </form>
        )
    }
}


class SignInFacebookBase extends Component {
    constructor(props) {
        super(props)

        this.state = { error: null}
    }

    onSubmit = (event) => {
        event.preventDefault()

        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                // create fb-user in firebase realtime db
                console.log(socialAuthUser)
                return this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .set({
                            username: socialAuthUser.additionalUserInfo.profile.name,
                            email: socialAuthUser.additionalUserInfo.profile.email,
                            roles: {},
                        });
            })
            .then(() => {
                this.setState({ error: null})
                this.props.history.push(ROUTES.HOME)
            })
            .then(() => {
                this.setState({ error: null })
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    render() {
        const { error } = this.state

        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Signin with facebook</button>

                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignInGoogle = compose(withFirebase, withRouter)(SignInGoogleBase)

const SignInFacebook = compose(withFirebase, withRouter)(SignInFacebookBase)

const SignInForm = compose(withFirebase, withRouter)(SignInFormBase)

export default SignInPage
export { SignInForm, SignInGoogle, SignInFacebook }