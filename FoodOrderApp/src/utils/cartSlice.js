import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState : {
        items : []
    },
    reducers : {
        addItem : (state , action) => {
            state.items.push(action.payload);
        },
        removeItem : (state) => {
            state.items.pop();
        },
        // originalState : {items : ["biryani"]}
        clearCart : (state) => {
            // RTK says - either you mutate the existing state or return a new state

            // state.items.length = 0; // original state = [];

            return {items : []} // this object will be replaced inside original state = {items = []};
        },
    },
})
export const {addItem , removeItem , clearCart} = cartSlice.actions;
export default cartSlice.reducer;