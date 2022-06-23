/*
    Copyright (c) 2022 IBM Corp.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AUTHENTICATE_API, AUTH_ENABLED } from "../../config"
import { client } from '../../api/client'

const initialState = {
    username: '',
    token: '',
    loading: false,
    errorMessage: '',
    isAuthenticated: !AUTH_ENABLED,
}

const BASE_URL = process.env.REACT_APP_API_URL

const auth_url = `${BASE_URL}/${AUTHENTICATE_API}`

export const getAuthenticated = createAsyncThunk('workspaces/getAuthenticated', async (params) => {
    const { data } = await client.post(auth_url, params)

    localStorage.setItem("username", data.username || "")

    if(data.token){
        localStorage.setItem("token", data.token)
    }
    return data
})



export const authenticateSlice = createSlice({
    name: 'authenticate',
    initialState,
    reducers: {
        clearState: () => initialState
    },
    extraReducers: {
        [getAuthenticated.pending]: (state) => {
            state.loading = true
        },
        [getAuthenticated.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.token = payload.token
            state.isAuthenticated = true
        },
        [getAuthenticated.rejected]: (state, { error }) => {
            state.errorMessage = error.message
            state.loading = false
            state.isAuthenticated = false
        },
    },
})

export const {
    clearState
} = authenticateSlice.actions

export const authenticateReducer = authenticateSlice.reducer