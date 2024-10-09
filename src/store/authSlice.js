import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        role: null,
        name: null
    },
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.role = action.payload?.role;
            state.name = action.payload?.name;
            localStorage.setItem("user", JSON.stringify({ role: action.payload?.role, name: action.payload?.name }));
        },
        logout(state) {
            state.isAuthenticated = false;
            state.role = null;
            state.name = null;
            localStorage.removeItem("user");
        },
        setUser(state, action) {
            state.role = action.payload?.role;
            state.name = action.payload?.name;

        }
    },
})

export const { login, logout,setUser } = authSlice.actions;
export default authSlice.reducer;