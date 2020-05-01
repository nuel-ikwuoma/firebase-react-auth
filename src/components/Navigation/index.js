import React  from "react";
import { Link } from "react-router-dom"
import SignOutButton from "../SignOut"
import { AuthUserContext } from "../Session";

import * as ROUTES from "../../constants/routes"
import * as ROLES from "../../constants/roles"
import styles from "./Navigation.module.css"

const AUTH_ROUTES = [ROUTES.LANDING, ROUTES.HOME, ROUTES.ACCOUNT]
const ADMIN_ROUTES = [ROUTES.ADMIN]
const PUB_ROUTES = [ROUTES.LANDING, ROUTES.SIGN_IN]

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser => 
            authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
    </AuthUserContext.Consumer>
    )

// N**B:: 'authUser' is now a merge from authdb and realtime-user db
// renders navigation for user with auth and/or admin priviledges
const NavigationAuth = ({ authUser }) => (
    <div className={styles['nav']}>
        <ul className={styles['nav-list']}>
            {AUTH_ROUTES
                .map(route => (
                    <li className={`${styles['nav-list-item']} ${styles['nav-list']}`} key={route}>
                        <Link to={route}> {`${route}`.slice(1).toLowerCase() || 'landing'} </Link>
                    </li>
                )
            )}
            {!!authUser.roles[ROLES.ADMIN] && (
                ADMIN_ROUTES.map(route => (
                    <li className={`${styles['nav-list-item']} ${styles['nav-list']}`} key={route}>
                        <Link to={route}>{`${route}`.slice(1)}</Link>
                    </li>
                ))
            )}
            <li>
                <SignOutButton />
            </li>
        </ul>
    </div>
        
)

const NavigationNonAuth = () => (
    <div className={styles['nav']}>
        <ul>
            {PUB_ROUTES.map(route => (
                <li className={`${styles['nav-list-item']} ${styles['nav-list']}`} key={route}>
                    <Link to={route}>{`${route}`.slice(1).toLowerCase() || 'landing'}</Link>
                </li>
            ))}
        </ul>
    </div>
)

export default Navigation