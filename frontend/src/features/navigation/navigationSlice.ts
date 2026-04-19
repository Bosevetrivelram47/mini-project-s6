import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { navigationApi } from '@/api/navigationApi';
import type { NavigationLog } from '@/types';

interface NavigationState {
  logs: NavigationLog[];
  loading: boolean;
  error: string | null;
}

const initialState: NavigationState = { logs: [], loading: false, error: null };

export const fetchNavigationLogs = createAsyncThunk('navigation/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await navigationApi.getAll();
    return res.data.data.content;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch logs');
  }
});

export const logNavigation = createAsyncThunk('navigation/log',
  async (data: { userId: number; page: string; url: string; timeSpentSeconds: number }, { rejectWithValue }) => {
    try {
      const res = await navigationApi.log(data);
      return res.data.data;
    } catch {
      return rejectWithValue('Failed to log navigation');
    }
  }
);

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavigationLogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNavigationLogs.fulfilled, (state, action) => { state.loading = false; state.logs = action.payload; })
      .addCase(fetchNavigationLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearError } = navigationSlice.actions;
export default navigationSlice.reducer;
