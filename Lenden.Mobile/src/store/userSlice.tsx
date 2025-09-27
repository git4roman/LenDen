import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserEntity } from "../types/UserEntity";
import { axiosInstance } from "../services";
import { RootState } from "./store";

interface UserState extends UserEntity {
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: 0,
  googleId: "",
  email: "",
  fullName: "",
  givenName: null,
  pictureUrl: "",
  emailVerified: false,
  createdAt: "",
  isActive: true,
  role: "user",
  userGroups: [],
  loading: false,
  error: null,
};

export const fetchUserFromAuth = createAsyncThunk(
  "user/fetchUserFromAuth",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const userId = state.auth.userId;
    const response = await axiosInstance.get(`/UserApi/${userId}`);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      // Return the initial state to reset all user-related data
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserFromAuth.fulfilled,
        (state, action: PayloadAction<UserEntity>) => {
          state.loading = false;
          state.error = null;
          // Update the state with the fetched user data
          Object.assign(state, action.payload);
        }
      )
      .addCase(fetchUserFromAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
        // Optionally, reset the user data on rejection
        Object.assign(state, initialState);
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
