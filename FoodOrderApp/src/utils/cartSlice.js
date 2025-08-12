import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState : {
        items : []
    },
    reducers : {
        addItem : (state , action) => {
            const item = action.payload;
            const existingItem = state.items.find(i => i?.card?.info?.id === item?.card?.info?.id);
            if(existingItem){
                existingItem.quantity += 1;
            }else{
                state.items.push({...item , quantity : 1});
            }
        },
        removeItem : (state , action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item?.card?.info?.id === id);
            if(existingItem){
                existingItem.quantity -= 1;
                if(existingItem.quantity <= 0){
                    state.items = state.items.filter(item => item?.card?.info?.id !== id);
                }
            }
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