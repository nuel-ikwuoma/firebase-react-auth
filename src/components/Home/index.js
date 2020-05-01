import React from "react"
import { withAuthorization } from "../Session"

const HomePage = () => (
    <div>
        <h3>Welcome to our homepage</h3>
        <p>Hi if you see this page, you are authorized</p>
    </div>
)

const condition = authUser => !!authUser

export default withAuthorization(condition)(HomePage)