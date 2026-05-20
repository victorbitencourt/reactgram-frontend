import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

//publish user photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    //check for errors
    if (data.errors) {
      return ThunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  }
);

//delete a photo
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    //check for errors
    if (data.errors) {
      return ThunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//update a photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    //check for errors
    if (data.errors) {
      return ThunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//get photo
export const getPhoto = createAsyncThunk("photo/getphoto", async (id) => {
  const data = await photoService.getPhoto(id);

  return data;
});

//like a photo
export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.likePhoto(id, token);

    //check for errors
    if (data.errors) {
      return ThunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//add comment to a photo
export const commentPhoto = createAsyncThunk(
  "photo/comment",
  async (commentData, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.commentPhoto(
      { comment: commentData.comment },
      commentData.id,
      token
    );

    //check for errors
    if (data.errors) {
      return ThunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

//get all photos
export const getPhotos = createAsyncThunk(
  "photo/getall",
  async (_, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.getPhotos(token);

    return data;
  }
);

//search photo by title
export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, ThunkAPI) => {
    const token = ThunkAPI.getState().auth.user.token;

    const data = await photoService.searchPhotos(query, token);

    return data;
  }
);

export const photoSlice = createSlice({
  name: "publish",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso.";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }
        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(commentPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo.comments.push(action.payload.comment);
        state.message = action.payload.message;
      })
      .addCase(commentPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
