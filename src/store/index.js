import { configureStore } from "@reduxjs/toolkit"
import { api } from "./services/api"
import surveyFormReducer from "./slices/surveyFormSlice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    surveyForm: surveyFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
