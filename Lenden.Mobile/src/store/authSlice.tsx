import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../services";
import { UserEntity } from "../types/UserEntity";

interface UserState {
  userId: number;
  email: string;
  role: "user" | "admin";
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: 0,
  email: "",
  role: "user",
  loading: false,
  error: null,
};

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const response = await axiosInstance.get(`/AuthApi/me`);
  return response.data as UserState;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = 0;
      state.email = "";
      state.role = "user";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.loading = false;
        state.error = null;
        Object.assign(state, action.payload);
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
