import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '@/api/taskApi';
import type { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = { tasks: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await taskApi.getAll();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create',
  async (data: { title: string; description?: string; priority?: string; dueDate?: string }, { rejectWithValue }) => {
    try {
      const res = await taskApi.create(data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const res = await taskApi.updateStatus(id, status);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.unshift(action.payload); })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
