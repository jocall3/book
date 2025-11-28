```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  timestamp: string;
}

export interface UserProgress {
  currentPage: number;
  quizResults: QuizResult[];
}

export const userProgressApi = createApi({
  reducerPath: 'userProgressApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    getUserProgress: builder.query<UserProgress, void>({
      query: () => '/user-progress',
      transformResponse: (response: any) => {
        // Adapt the response based on your API's format
        return {
          currentPage: response.currentPage || 1, // Default to page 1
          quizResults: response.quizResults || [],
        };
      },
    }),
    updateUserProgress: builder.mutation<void, { currentPage?: number; quizResult?: QuizResult }>({
      query: (body) => ({
        url: '/user-progress',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useGetUserProgressQuery, useUpdateUserProgressMutation } = userProgressApi;
```
