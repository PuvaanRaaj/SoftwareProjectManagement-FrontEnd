import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalAction/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initalsState
const initialState = {
  brands: [],
  brand: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create brand action
export const createBrandAction = createAsyncThunk(
  "brand/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //Images
      const { data } = await axios.post(
        `${baseURL}/brands`,
        {
          name,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//Delete
export const deleteBrandAction = createAsyncThunk(
  "brand/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${baseURL}/brands/${id}`, config);
      return id;  // Return the deleted brand's id
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
// Update

// Update category action
export const updateBrandAction = createAsyncThunk(
  "brand/update",
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
        `${baseURL}/brands/${id}`,
        { name },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
  );

//fetch brands action
export const fetchBrandsAction = createAsyncThunk(
  "brands/fetch All",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/brands`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//slice
const brandsSlice = createSlice({
  name: "brands",
  initialState,
  extraReducers: (builder) => {
    //create
    builder.addCase(createBrandAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBrandAction.fulfilled, (state, action) => {
      state.loading = false;
      state.brand = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createBrandAction.rejected, (state, action) => {
      state.loading = false;
      state.brand = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    //fetch all
    builder.addCase(fetchBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.brands = action.payload;
      
    });
    builder.addCase(fetchBrandsAction.rejected, (state, action) => {
      state.loading = false;
      state.brands = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
    //reset success action
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });

    // Delete brand
      builder.addCase(deleteBrandAction.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(deleteBrandAction.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted brand from the state
        state.brands = state.brands.filter(brand => brand._id !== action.payload);
        state.isDelete = true;
      });
      builder.addCase(deleteBrandAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
        //
        builder.addCase(updateBrandAction.pending, (state) => {
        state.loading = true;
      })
      builder .addCase(updateBrandAction.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
        state.isUpdated = true;
      })
      builder.addCase(updateBrandAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

//generate the reducer
const brandsReducer = brandsSlice.reducer;

export default brandsReducer;
