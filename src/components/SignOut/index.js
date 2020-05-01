import React from "react"
import { withFirebase } from '../Firebase'
import { compose } from "recompose"
// import * as ROUTES from "../../constants/routes"
// const SignOutPage = () => (
//     <div>
//         SignOutPage
//     </div>
// )

// class SignOutButton extends Component (
//     <button type="button" onClick={firebase.doSignOut}>
//         Sign Out
//     </button>
// )

const SignOutButton = ({firebase}) => (
    <div>
        <button onClick={() => {
                firebase.doSignOut()
                .then(() => {
                    console.log("sign out success")
                })
                .catch(err => prompt(`${err.message}: Signout error`))
                
        }}>
            Sign Out
        </button>
    </div>
) 

export default compose(withFirebase)(SignOutButton)
