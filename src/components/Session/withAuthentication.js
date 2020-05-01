import React from "react"
import AuthUserContext from "./context"
import { withFirebase } from "../Firebase"

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props)

            this.state = {
                authUser: JSON.parse(localStorage.getItem("authuser"))
            }
        }
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    localStorage.setItem("authuser", JSON.stringify(authUser))  // localStorage to persist auth user
                    this.setState({ authUser })
                },
                () => {
                    localStorage.removeItem("authuser")     // rm when user is no more authenticated
                    this.setState({ authUser: null})
                }
            )
        }
        componentWillUnmount() {
            // remove listener when component unmounts, to avoid memory leaks
            this.listener()
        }
        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(WithAuthentication)
}

export default withAuthentication
