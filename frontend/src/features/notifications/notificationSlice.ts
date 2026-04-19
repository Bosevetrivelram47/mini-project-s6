import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi } from '@/api/notificationApi';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = { notifications: [], unreadCount: 0, loading: false, error: null };

export const fetchMyNotifications = createAsyncThunk('notifications/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await notificationApi.getMy();
    return res.data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
  }
});

export const fetchUnreadCount = createAsyncThunk('notifications/unreadCount', async (_, { rejectWithValue }) => {
  try {
    const res = await notificationApi.getUnreadCount();
    return res.data.data.unreadCount;
  } catch {
    return rejectWithValue('Failed to get count');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await notificationApi.markAsRead(id);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to mark read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await notificationApi.markAllAsRead();
    return true;
  } catch {
    return rejectWithValue('Failed to mark all read');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => { state.unreadCount = action.payload as number; })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex(n => n.id === action.payload.id);
        if (idx !== -1) { state.notifications[idx] = action.payload; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
