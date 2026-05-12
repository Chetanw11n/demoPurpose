// //auth Slice
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { decodeJwt,  register } from '../../services/AuthService';
// import {login } from '../../axios/auth_api';

// export const loginUser = createAsyncThunk(
//   '/auth/login',
//   async (credentials, thunkAPI) => {
//     try {

//       const response = await login({phone: credentials.phone, password: credentials.password});
//       console.log(response);

//       const data = decodeJwt(response.data.token);
//       if (!data) throw new Error('Invalid token received from server');
//       const payload = {
//         token: response.data.token,
//         user: {
//           id: data.id,
//           role: data.role
//         }

//       };
//             console.log(payload);
//             localStorage.setItem('token', payload.token);
//             localStorage.setItem('user', JSON.stringify(payload.user));

//       return payload;

//     } catch (error) {
//       console.log(error);

//       const message = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// export const registerUser = createAsyncThunk(
//   '/citizen/auth/signup',
//   async (credentials, thunkAPI) => {
//     try {
//       console.log(credentials);

//       const response = await register(credentials);
//       if (response.status !== 200) throw new Error(response.data.message);

//       const token = response.data.data.token;

//       const data = decodeJwt(token);
//       if (!data) throw new Error('Invalid token received from server');
//       console.log(response, data);

//       const payload = {
//         token: token,
//         user: {
//           name: data.name,
//           email: data.email,
//           role: data.role,
//           status : 'ACTIVE'
//         }
//       };


//       return payload;

//     } catch (error) {
//       const message = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );


// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     token: localStorage.getItem('token') || null,
//     isAuthenticated: !!localStorage.getItem('token'),
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//     setRegistrationData: (state, action) => {
//       state.user = action.payload;
//     },
//     setUserRole: (state, action) => {
//       if (state.user) {
//         state.user.role = action.payload;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => { state.loading = true; })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         localStorage.setItem('token', action.payload.token);
//         localStorage.setItem('user', JSON.stringify(action.payload.user));
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;

//         localStorage.setItem('token', action.payload.token);
//         localStorage.setItem('user', JSON.stringify(action.payload.user));
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout, setRegistrationData, setUserRole } = authSlice.actions;
// export default authSlice.reducer;


//auth Slice
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decodeJwt,  register } from '../../services/AuthService';
import {login, signup } from '../../axios/auth_api';
 
export const loginUser = createAsyncThunk(
  '/auth/login',
  async (credentials, thunkAPI) => {
    try {
 
      const response = await login({phone: credentials.phone, password: credentials.password});
      console.log(response);
 
      const data = decodeJwt(response.data.token);
      if (!data) throw new Error('Invalid token received from server');
     
      // Extract citizenId or userId from token
      const userId = data.id || data.sub || data.userId || data.citizenId;
     
      const payload = {
        token: response.data.token,
        user: {
          id: userId,
          role: data.role,
          phone: credentials.phone
        }
 
      };
 
      return payload;
 
    } catch (error) {
      console.log(error);
 
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
 
export const registerUser = createAsyncThunk(
  '/citizen/auth/signup',
  async (credentials, thunkAPI) => {
    try {
      console.log(credentials);
 
      const response = await signup(credentials);
      if (response.status !== 200 && response.status !== 201) throw new Error(response.data.message);
 
      // Signup successful - user created
      const payload = {
        message: 'Signup successful!',
        email: credentials.email,
        status: response.data.status || 'ACTIVE'
      };
 
      return payload;
 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
 
 
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('citizenId');
      localStorage.removeItem('phone');
    },
    setRegistrationData: (state, action) => {
      state.user = action.payload;
    },
    setUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('citizenId', action.payload.user.id);
        localStorage.setItem('phone', action.payload.user.phone);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Don't authenticate yet - user is in PENDING status
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
 
export const { logout, setRegistrationData, setUserRole } = authSlice.actions;
export default authSlice.reducer;
 