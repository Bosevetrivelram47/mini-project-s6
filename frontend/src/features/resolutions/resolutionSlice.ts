import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resolutionApi } from '@/api/resolutionApi';
import type { Resolution } from '@/types';

interface ResolutionState {
  resolutions: Resolution[];
  loading: boolean;
  error: string | null;
}

const initialState: ResolutionState = { resolutions: [], loading: false, error: null };

export const fetchResolutions = createAsyncThunk('resolutions/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await resolutionApi.getAll();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch resolutions');
  }
});

export const resolveTask = createAsyncThunk('resolutions/resolve',
  async (data: { taskId: number; remarks?: string }, { rejectWithValue }) => {
    try {
      const res = await resolutionApi.resolve(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve task');
    }
  }
);

const resolutionSlice = createSlice({
  name: 'resolutions',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResolutions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchResolutions.fulfilled, (state, action) => { state.loading = false; state.resolutions = action.payload; })
      .addCase(fetchResolutions.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(resolveTask.fulfilled, (state, action) => { state.resolutions.unshift(action.payload); });
  },
});

export const { clearError } = resolutionSlice.actions;
export default resolutionSlice.reducer;
