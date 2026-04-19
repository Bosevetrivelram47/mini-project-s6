import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentApi } from '@/api/assignmentApi';
import type { Assignment } from '@/types';

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = { assignments: [], loading: false, error: null };

export const fetchAssignments = createAsyncThunk('assignments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await assignmentApi.getAll();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
  }
});

export const assignTask = createAsyncThunk('assignments/assign',
  async (data: { taskId: number; assignedToUserId: number }, { rejectWithValue }) => {
    try {
      const res = await assignmentApi.assign(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to assign task');
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAssignments.fulfilled, (state, action) => { state.loading = false; state.assignments = action.payload; })
      .addCase(fetchAssignments.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(assignTask.fulfilled, (state, action) => { state.assignments.unshift(action.payload); });
  },
});

export const { clearError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
