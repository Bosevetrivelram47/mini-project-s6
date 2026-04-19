import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import userReducer from '@/features/users/userSlice';
import taskReducer from '@/features/tasks/taskSlice';
import assignmentReducer from '@/features/assignments/assignmentSlice';
import resolutionReducer from '@/features/resolutions/resolutionSlice';
import notificationReducer from '@/features/notifications/notificationSlice';
import navigationReducer from '@/features/navigation/navigationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    tasks: taskReducer,
    assignments: assignmentReducer,
    resolutions: resolutionReducer,
    notifications: notificationReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
