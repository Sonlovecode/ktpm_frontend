import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : { user: null, token: "" };
    });

    // Cập nhật headers Axios và localStorage khi auth thay đổi
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common["Authorization"] = auth.token;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }

        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
