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
  },
});

export const { toggleLike } = eventsSlice.actions;
export default eventsSlice.reducer;
