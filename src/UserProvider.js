import React, { useState, useEffect, createContext } from "react";
import { auth } from "./service/firebase"


export const UserContext = createContext({})

const UserProvider = ({ children }) => {
    const [user, setuser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user !== null) {
                const { displayName, uid } = user;
                setuser({
                    displayName,
                    uid,
                });
            } else {
                setuser(null);
            }
        })
    }, [])
    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    )
}

export default UserProvider;