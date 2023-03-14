import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

//초기 값의 타입정의
export type LoginState = {
  userLogin: boolean;
  email: string;
  password: string;
};

const initialState: LoginState = {
  userLogin: false,
  email: "",
  password: "",
};

export const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    fbLoginState: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.userLogin = true;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    fbJoinState: (state) => {},
    fbLogoutState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },

    fbDeleteUserState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
  },
});

export const { fbLoginState, fbJoinState, fbLogoutState, fbDeleteUserState } =
  userSlice.actions;

export default userSlice.reducer;
