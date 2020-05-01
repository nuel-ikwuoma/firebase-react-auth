import React, { Component } from "react"
import { compose } from "recompose"

import { withAuthorization } from "../Session";
// import { withAuthentication, withAuthorization } from "../Session"
import * as ROLES from "../../constants/roles"

import { withFirebase } from "../Firebase";

class AdminPage extends Component {
    constructor(props) {
        super(props)

        this.state  = {
            loading: false,
            users: [],
        }
    }

    componentDidMount() {
        this.setState({loading: true})
        this.props.firebase.users().on("value", snapshot => {
            const userObj = snapshot.val()

            const userList = Object.keys(userObj).map(key => ({
                ...userObj[key],
                uid: key
            }))
            this.setState({
                users: userList,
                loading: false
            })
        })
    }
    
    componentWillUnmount() {
        // to stop repeated updates on an unmounted component
        this.props.firebase.users().off()
    }

    render() {
        const { users, loading } = this.state
        return (
            <div>
                <h3>Admin page</h3>
                <p> Accessible to all signed in admin user</p>

                {loading && <div>loading...</div>}
                <UserList users={users} />
            </div>
        )
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                    <strong>ID: </strong>{user.uid} 
                </span>
                <span>
                    <strong>Email: </strong>{user.email} 
                </span>
                <span>
                    <strong>Username: </strong>{user.username}
                </span>
            </li>
        ))}
    </ul>
);

const condition = authUser => 
    authUser && !!authUser.roles[ROLES.ADMIN]



export default compose(
                withAuthorization(condition),
                withFirebase)(AdminPage)