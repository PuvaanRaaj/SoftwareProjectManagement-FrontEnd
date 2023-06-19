import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalAction/globalAction";

// Initial state
const initialState = {
  categories: [],
  category: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

// Create category action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { name, file } = payload;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${baseURL}/categories`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch categories action
export const fetchCategoriesAction = createAsyncThunk(
  "category/fetchAll",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/categories`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete category action
export const deleteCategoryAction = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${baseURL}/categories/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update category action
export const updateCategoryAction = createAsyncThunk(
  "category/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const { id, name } = payload;

    const token = getState()?.users?.userAuth?.userInfo?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(
        `${baseURL}/categories/${id}`,
        { name },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
        state.isAdded = true;
      })
      .addCase(createCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.category = null;
        state.isAdded = false;
        state.error = action.payload;
      })
      .addCase(fetchCategoriesAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAction.rejected, (state, action) => {
        state.loading = false;
        state.categories = null;
        state.error = action.payload;
      })
      .addCase(resetErrAction.pending, (state, action) => {
        state.error = null;
      })
      .addCase(resetSuccessAction.pending, (state, action) => {
        state.isAdded = false;
        state.isUpdated = false; // Add this line to reset the isUpdated flag
      })
      .addCase(deleteCategoryAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(deleteCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategoryAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
        state.isUpdated = true;
      })
      .addCase(updateCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Reducer
const categoryReducer = categorySlice.reducer;

export default categoryReducer;
