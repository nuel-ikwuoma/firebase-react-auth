import app from "firebase/app"
import "firebase/auth"
import "firebase/database"

// read firebase config from .env file
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID
};

export default class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig)

        this.auth = app.auth();
        this.db = app.database();

        this.googleProvider = new app.auth.GoogleAuthProvider()
        this.facebookProvider = new app.auth.FacebookAuthProvider()
    }

    /** Firebase Authentication API */
    doCreateUserWithEmailAndPassword = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password)
    }

    doSignInWithEmailAndPassword = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    doSignOut = () => this.auth.signOut()

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)

    doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider)

    /** Firebase realtime database API */
    user = (uid) => this.db.ref(`users/${uid}`)
    users = () => this.db.ref('users')

    /** Merge auth and db user */
    onAuthUserListener = (next, fallback) => {
        return this.auth.onAuthStateChanged(authUser => {
            if(authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val()
                        if(!dbUser.roles) {
                            dbUser.roles = {}
                        }
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser
                        }
                        
                        // 'authUser' is now a merge from auth-db and realtime db
                        next(authUser)
                    })
            }else {
                fallback()
            }
        })
    }

    // never tested this code
    // product = (pid) => this.db.ref(`products/${pid}`)
}