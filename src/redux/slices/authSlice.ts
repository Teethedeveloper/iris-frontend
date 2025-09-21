import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export interface User {
  id: string;
  fullName: string;
  email: string;
  isAgency: string;
  company?: string;
  profilePicture?: string;
  introduction?: string;
  bio?: string;
  profilePic?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

// Async thunk for login
interface LoginResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (data, thunkAPI) => {
  try {
  const res = await api.post("auth/login", data); // match backend
    return res.data;
  } catch (err) {
    let message = "Something went wrong";
    if (err && typeof err === "object") {
      // Check for Axios error shape
      if (
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
  typeof (err.response as { data?: unknown }).data === "object"
      ) {
        message = (err.response as { data?: { message?: string } }).data?.message || message;
      } else if ("message" in err && typeof (err as { message?: unknown }).message === "string") {
        message = (err as { message: string }).message;
      }
    }
    // Optionally log error for diagnostics (only in browser dev mode)
    if (import.meta.env && import.meta.env.MODE === "development") {
      console.error("Login error:", err);
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
