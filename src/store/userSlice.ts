import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";

//fb 로그인 관련
export type FBUserType = {
  email: string;
  password: string;
};

//회원가입
export const fbJoinFB = createAsyncThunk(
  "user/join",
  async (tempUser: FBUserType) => {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          tempUser.email,
          tempUser.password
        );
      const user = userCredential.user;
      console.log("회원가입", user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode : ", errorCode);
      console.log("errorMessage : ", errorMessage);
    }
  }
);

// 로그인
export const fbLoginFB = createAsyncThunk(
  "user/login",
  async (tempUser: FBUserType) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        tempUser.email,
        tempUser.password
      );
      const user = userCredential.user;
      console.log("로그인", user);
      // payload 전송
      return tempUser;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errorCode : ", errorCode);
      console.log("errorMessage : ", errorMessage);
    }
  }
);

// 로그아웃
export const fbLogoutFB = createAsyncThunk("user/logout", async () => {
  try {
    await auth.signOut();
  } catch (err: any) {
    console.log("Logout Failure");
  }
});

// 회원삭제
export const fbDeleteUserFB = createAsyncThunk("user/delete", async () => {
  try {
    await deleteUser(auth.currentUser as User);
  } catch (error) {
    console.log("회원 탈퇴 실패");
  }
});

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
    fbJoinState: (state) => {
      state.userLogin = false;
      state.email = "";
      state.password = "";
    },
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
  extraReducers: (builder) => {
    builder
      .addCase(fbJoinFB.pending, (state, action) => {})
      .addCase(fbJoinFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbJoinFB.rejected, (state, action) => {})
      .addCase(fbLoginFB.pending, (state, action) => {})
      .addCase(fbLoginFB.fulfilled, (state, action) => {
        state.userLogin = true;
        const { email, password } = action.payload as FBUserType;
        state.email = email;
        state.password = password;
      })
      .addCase(fbLoginFB.rejected, (state, action) => {})
      .addCase(fbLogoutFB.pending, (state, action) => {})
      .addCase(fbLogoutFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbLogoutFB.rejected, (state, action) => {})
      .addCase(fbDeleteUserFB.pending, (state, action) => {})
      .addCase(fbDeleteUserFB.fulfilled, (state, action) => {
        state.userLogin = false;
        state.email = "";
        state.password = "";
      })
      .addCase(fbDeleteUserFB.rejected, (state, action) => {});
  },
});

export const { fbLoginState, fbJoinState, fbLogoutState, fbDeleteUserState } =
  userSlice.actions;

export default userSlice.reducer;
