import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { createSelector } from "@reduxjs/toolkit";

const adapter = createEntityAdapter({
  selectId: (participant) => participant.id,
});

const STORAGE = "event_participants";

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (eventId) => {
    await new Promise((res) => setTimeout(res, 500));

    const all = JSON.parse(localStorage.getItem(STORAGE)) || {};
    const list = all[eventId] || [];

    return list.map((p, index) => ({
      ...p,
      id: p.id ?? Date.now() + index,
    }));
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState: adapter.getInitialState({
    loading: false,
    error: null,
    search: "",
  }),
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    addParticipant(state, action) {
      const participant = {
        ...action.payload,
        id: Date.now(),
        registrationDate: new Date().toISOString().split("T")[0],
      };
      adapter.addOne(state, participant);
      const all = JSON.parse(localStorage.getItem(STORAGE)) || {};
      const eventId = participant.eventId;

      if (!all[eventId]) {
        all[eventId] = [];
      }

      all[eventId].push(participant);

      localStorage.setItem(STORAGE, JSON.stringify(all));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchParticipants.rejected, (state) => {
        state.loading = false;
        state.error = "Помилка завантаження";
        toast.error("Помилка завантаження учасників");
      });
  },
});

export const { setSearch, addParticipant } = participantsSlice.actions;

export const participantsSelectors = adapter.getSelectors(
  (state) => state.participants
);

export const selectFilteredParticipants = createSelector(
  [
    participantsSelectors.selectAll,
    (state) => state.participants.search,
    (state, eventId) => eventId,
  ],
  (all, search, eventId) => {
    const query = search.toLowerCase();

    return all.filter((p) => {
      const matchesEvent = p.eventId === Number(eventId);
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query);
      return matchesEvent && matchesSearch;
    });
  }
);
export default participantsSlice.reducer;
