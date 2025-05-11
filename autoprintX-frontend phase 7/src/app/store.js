

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import pageNumberReducer from './slices/pageNoSlice';
import printOptionReducer from './slices/printOptionSlice';
import cartSliceReducer from './slices/cartSlice';
import userReducer from './slices/userSlice'; // Added user reducer

// Combine your reducers
const rootReducer = combineReducers({
    pageNumber: pageNumberReducer,
    printOption: printOptionReducer,
    cart: cartSliceReducer,
    user: userReducer, // Include user slice
});

// Configure persist settings (whitelisting both 'cart' and 'user')
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'user'],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Create a persistor
export const persistor = persistStore(store);
