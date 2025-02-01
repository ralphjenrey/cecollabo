import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { database } from "../services/firebase";
import { get, ref } from "firebase/database";


export const fetchAuthState = createAsyncThunk("auth/fetchAuthState", async (_, { rejectWithValue }) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return rejectWithValue("No user found");
        }
        const token = user.token;
        const userRef = ref(database, `Users/${user.name}/token`);
        const userSnapshot = await get(userRef);
        if (!userSnapshot.exists()) {
            return rejectWithValue("User not found");
        }
        if (token != userSnapshot.val()) {
            return rejectWithValue("Invalid token");
        }
    
      return {
        isAuthenticated: true,
        role: user.role,
        name: user.name,
        token: token,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to verify token");
    }
  });

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        role: null,
        name: null,
        token:null
    },
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.role = action.payload?.role;
            state.name = action.payload?.name;
            state.token = action.payload?.token;
            localStorage.setItem("user", JSON.stringify({ role: action.payload?.role, name: action.payload?.name, token: action.payload?.token }));
        },
        logout(state) {
            state.isAuthenticated = false;
            state.role = null;
            state.name = null;
            state.token = null;
            localStorage.removeItem("user");
        },
        setUser(state, action) {
            state.role = action.payload?.role;
            state.name = action.payload?.name;
            state.token = action.payload?.token;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAuthState.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.token = action.payload.token;
        })
        .addCase(fetchAuthState.rejected, (state, action) => {
            state.isAuthenticated = false;
        });
    }
})

export const { login, logout,setUser } = authSlice.actions;
export default authSlice.reducer;