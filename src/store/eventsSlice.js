import { createSlice } from "@reduxjs/toolkit";
import eventsData from "../data/events.json";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: eventsData,
    liked: JSON.parse(localStorage.getItem("fav_events")) || [],
  },
  reducers: {
    toggleLike(state, action) {
      const id = action.payload;

      if (state.liked.includes(id)) {
        state.liked = state.liked.filter((x) => x !== id);
      } else {
        state.liked.push(id);
      }

      localStorage.setItem("fav_events", JSON.stringify(state.liked));
    },
    addImportedEvents(state, action) {
      const newEvents = action.payload.filter(
        (newEvent) => !state.list.some((e) => e.title === newEvent.title)
      );
      state.list = [...newEvents, ...state.list];
    },
  },
});

export const { toggleLike, addImportedEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
