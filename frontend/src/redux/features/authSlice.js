// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService"; // Adjust path if necessary
import axios from "axios"; // Needed to set auth header

// --- Initial State ---
// Attempt to load user and token from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));
const token = localStorage.getItem("token");

const initialState = {
	user: user ? user : null,
	token: token ? token : null,
	isAuthenticated: token ? true : false,
	status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

// --- Async Thunks ---

// Register User Thunk
export const registerUser = createAsyncThunk(
	"auth/registerUser",
	async (userData, { rejectWithValue }) => {
		try {
			// We only register here. Login will be dispatched separately if needed.
			const response = await authService.register(userData);
			// We don't automatically log in here, just return the success message.
			// The component can decide to dispatch loginUser afterwards.
			return response; // Should return { message: 'User created successfully.' }
		} catch (error) {
			// authService should throw an error with a message
			return rejectWithValue(
				error.message || "Registration failed"
			);
		}
	}
);

// Login User Thunk
export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (credentials, { rejectWithValue }) => {
		try {
			const data = await authService.login(credentials);
			// The service now handles setting the token in localStorage and axios headers
			return data; // Expected: { user: {...}, token: '...' }
		} catch (error) {
			return rejectWithValue(error.message || "Login failed");
		}
	}
);

// Google Login Thunk
export const googleLoginHandler = createAsyncThunk(
	"auth/googleLogin",
	async (tokenData, { rejectWithValue }) => {
		// Assuming tokenData is { idToken: '...' }
		try {
			// This backend call should return { user: {...}, token: '...' } on success
			const response = await axios.post(
				`${
					authService.API_URL ||
					"http://localhost:3000"
				}/auth/google`,
				tokenData
			);

			// Manually handle setting token and user like in login service
			if (response.data.token) {
				localStorage.setItem(
					"token",
					response.data.token
				);
				authService.setAuthToken(response.data.token); // Ensure axios header is set
			}
			if (response.data.user) {
				localStorage.setItem(
					"currentUser",
					JSON.stringify(response.data.user)
				);
			}
			return response.data; // Expected: { user: {...}, token: '...' }
		} catch (error) {
			const message =
				error.response?.data?.error ||
				error.message ||
				"Google Login failed";
			return rejectWithValue(message);
		}
	}
);

// --- Slice Definition ---
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Synchronous action to log out
		logout: (state) => {
			localStorage.removeItem("token");
			localStorage.removeItem("currentUser");
			authService.setAuthToken(null); // Clear axios header
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.status = "idle";
			state.error = null;
			console.log("Redux logout executed");
		},
		// Synchronous action to clear errors
		clearError: (state) => {
			state.error = null;
		},
		// Potentially add reducers to update user profile info synchronously if needed
	},
	extraReducers: (builder) => {
		builder
			// --- Register User ---
			.addCase(registerUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Registration successful, but not logged in yet.
				// Optionally show a success message from action.payload.message
				console.log(
					"Registration succeeded:",
					action.payload.message
				);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload; // Error message from rejectWithValue
			})

			// --- Login User ---
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				console.log(
					"AuthSlice: loginUser.fulfilled -- START"
				);
				console.log(
					"AuthSlice: Received Payload:",
					JSON.stringify(action.payload, null, 2)
				); // Log the full payload clearly

				if (
					action.payload &&
					action.payload.user &&
					action.payload.token
				) {
					console.log(
						"AuthSlice: Payload is valid. Updating state..."
					);
					console.log(
						"AuthSlice: state.user BEFORE:",
						state.user
					);

					state.user = action.payload.user; // THE CRITICAL LINE
					state.token = action.payload.token;
					state.isAuthenticated = true;
					state.status = "succeeded";
					state.error = null; // Clear error on success

					console.log(
						"AuthSlice: state.user AFTER:",
						state.user
					); // Check immediately after setting
					console.log(
						"AuthSlice: Full state AFTER update:",
						JSON.stringify(state, null, 2)
					); // Log the entire slice state

					// Handle localStorage/Axios header consistency (ensure it matches the state)
					try {
						localStorage.setItem(
							"currentUser",
							JSON.stringify(
								action.payload
									.user
							)
						);
						localStorage.setItem(
							"token",
							action.payload.token
						);
						authService.setAuthToken(
							action.payload.token
						);
						console.log(
							"AuthSlice: Updated localStorage and Axios header."
						);
					} catch (e) {
						console.error(
							"AuthSlice: Error updating localStorage",
							e
						);
						// Decide how to handle this - maybe revert state?
					}
				} else {
					console.error(
						"AuthSlice ERROR: Fulfilled payload missing user or token!",
						action.payload
					);
					state.status = "failed";
					state.error =
						"Login response missing user data or token.";
					state.isAuthenticated = false;
					state.user = null;
					state.token = null;
					localStorage.removeItem("token");
					localStorage.removeItem("currentUser");
					authService.setAuthToken(null);
				}
				console.log(
					"AuthSlice: loginUser.fulfilled -- END"
				);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			})

			// --- Google Login ---
			.addCase(googleLoginHandler.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(
				googleLoginHandler.fulfilled,
				(state, action) => {
					state.status = "succeeded";
					state.user = action.payload.user;
					state.token = action.payload.token;
					state.isAuthenticated = true;
					// LocalStorage/Header setting handled within the thunk
				}
			)
			.addCase(
				googleLoginHandler.rejected,
				(state, action) => {
					state.status = "failed";
					state.error = action.payload;
					state.isAuthenticated = false;
					state.user = null;
					state.token = null;
				}
			);
	},
});

// --- Exports ---
export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
