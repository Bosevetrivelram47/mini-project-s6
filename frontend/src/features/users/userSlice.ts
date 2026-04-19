import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '@/api/userApi';
import type { User } from '@/types';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = { users: [], loading: false, error: null };

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await userApi.getAll();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const createUser = createAsyncThunk('users/create',
  async (data: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const res = await userApi.create(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const toggleUserStatus = createAsyncThunk('users/toggleStatus',
  async ({ id, active }: { id: number; active: boolean }, { rejectWithValue }) => {
    try {
      const res = active ? await userApi.activate(id) : await userApi.deactivate(id);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createUser.fulfilled, (state, action) => { state.users.unshift(action.payload); })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
