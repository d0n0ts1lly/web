import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import participantsReducer from "./participantsSlice";
import themeReducer from "./themeSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    participants: participantsReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
