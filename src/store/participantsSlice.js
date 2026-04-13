import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const adapter = createEntityAdapter({
  selectId: (participant) => participant.id,
});

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (eventId) => {
    const response = await fetch(
      `${API_URL}/api/participants?eventId=${eventId}`
    );
    if (!response.ok) throw new Error("Помилка завантаження");

    const data = await response.json();

    return data.map((p) => ({
      ...p,
      name: p.fullName,
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
      adapter.addOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error("Не вдалося завантажити учасників з сервера");
      });
  },
});

export const { setSearch, addParticipant } = participantsSlice.actions;

export const participantsSelectors = adapter.getSelectors(
  (state) => state.participants
);

export const selectFilteredParticipants = createSelector(
  [participantsSelectors.selectAll, (state) => state.participants.search],
  (all, search) => {
    const query = search.toLowerCase();
    return all.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query)
    );
  }
);

export default participantsSlice.reducer;
