import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// use relative url for nginx proxy, or environment variable for development
const baseUrl = import.meta.env.VITE_API_URL || "/api"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ["Survey"],
  endpoints: (builder) => ({
    // auth endpoints
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body
      }),
    }),

    // survey endpoints
    listSurveys: builder.query({
      query: () => "/surveys",
      providesTags: ["Survey"]
    }),

    getSurveyById: builder.query({
      query: (surveyId) => `/surveys/${surveyId}`,
      providesTags: (result, error, surveyId) => [{ type: "Survey", id: surveyId }]
    }),

    createSurvey: builder.mutation({
      query: (body) => ({
        url: "/surveys",
        method: "POST",
        body
      }),
      invalidatesTags: ["Survey"]
    }),

    updateSurvey: builder.mutation({
      query: ({ surveyId, ...body }) => ({
        url: `/surveys/${surveyId}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (result, error, { surveyId }) => [{ type: "Survey", id: surveyId }, "Survey"]
    }),

    copySurvey: builder.mutation({
      query: (surveyId) => ({
        url: `/surveys/${surveyId}/copy`,
        method: "POST"
      }),
      invalidatesTags: ["Survey"]
    }),

    sendSurvey: builder.mutation({
      query: (surveyId) => ({
        url: `/surveys/${surveyId}/send`,
        method: "POST"
      }),
      invalidatesTags: (result, error, surveyId) => [{ type: "Survey", id: surveyId }, "Survey"]
    }),

    getSurveyResults: builder.query({
      query: (surveyId) => `/surveys/${surveyId}/results`,
      providesTags: (result, error, surveyId) => [{ type: "Survey", id: surveyId }]
    }),

    deleteSurvey: builder.mutation({
      query: (surveyId) => ({
        url: `/surveys/${surveyId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Survey"]
    }),

    // public endpoints (for participants)
    getSurveyByToken: builder.query({
      query: (participantToken) => `/public/surveys/${participantToken}`
    }),

    submitResponses: builder.mutation({
      query: ({ participantToken, responses }) => ({
        url: `/public/surveys/${participantToken}/responses`,
        method: "POST",
        body: { responses }
      }),
    }),
  }),
})

export const {
  // auth
  useLoginMutation,
  // surveys
  useListSurveysQuery,
  useGetSurveyByIdQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useCopySurveyMutation,
  useSendSurveyMutation,
  useGetSurveyResultsQuery,
  useDeleteSurveyMutation,
  // public
  useGetSurveyByTokenQuery,
  useSubmitResponsesMutation,
} = api
