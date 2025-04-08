import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // Empty reducer for now
    dummy: (state = {}, action) => state
  }
});

export default store;