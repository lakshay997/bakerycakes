// This is the reducer for all of the components in the application.

import { combineReducers } from 'redux'
import { ADD_TO_CART, REMOVE_CART_ITEM, UPDATE_QUANTITY, RESET_SHOP} from './../actions'

// This holds the inventory and the initial states of the cart and the total price. 
// In production, this would come from an AJAX call.

let initialState = { 
    inventory: [
        {
            id: 1,
            name: "Vanilla Cake",
            pictureURL: "https://media.bakingo.com/sq-choco-vanilla-cake0006chva-AA.jpg",
            price: 500
        },
        {
            id: 2,
            name: "Rainbow Cake",
            pictureURL: "https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/x17/rainbow-cake760x580.jpg?ext=.jpg",
            price: 700
        },
        {
            id: 3,
            name: "Rose Paradise Cake",
            pictureURL: "https://www.fnp.com/images/pr/x/v20221130174930/rose-paradise-chocolate-cake-1-kg_1.jpg",
            price: 800
        },
        {
            id: 4,
            name: "Shops Cake",
            pictureURL: "https://www.euttaranchal.com/tourism/photos/bakeries-in-dehradun-6102679.png",
            price: 1000
        },
        {
            id: 5,
            name: "Red Velvet Cake",
            pictureURL: "https://cdn.shopify.com/s/files/1/0521/3929/4884/products/EgglessRedVelvetCake2.jpg?v=1632141312",
            price: 900
        },
        {
            id: 6,
            name: "Trufle Cake",
            pictureURL: "https://thefirstyearblog.com/wp-content/uploads/2015/11/chocolate-chocolate-cake-1.png",
            price: 600
        },
        {
            id: 7,
            name: "Black Wedding Cake",
            pictureURL: "https://i.pinimg.com/736x/aa/7c/86/aa7c86c348c2a45dd081a3bf47e9352a.jpg",
            price: 800
        },
        {
            id: 8,
            name: "Chocolate Cake",
            pictureURL: "https://cdn.shopify.com/s/files/1/0521/3929/4884/products/DutchTruffleCake1_2kg1.jpg?v=1632145463",
            price: 750
        }
    ],
    cart: [],
    totalPrice: 0
}

const calculateTotalPrice = (cart) => {
    let totalPrice = 0
    totalPrice = cart.reduce((totalPrice, cartItem) => totalPrice + cartItem.price, 0)
    return totalPrice
}

// This would be called whenever delete button is clicked or when a user sets an item's quantity to none or 0.
const removeCartItem = (state, index) => {
    let cart = [
        ...state.cart.slice(0, index),
        ...state.cart.slice(index + 1)
    ]
    let totalPrice = calculateTotalPrice(cart)
    return {
        ...state,
        cart,
        totalPrice
    }
}

// This would update the quantity or call removeCartItem if quantity set is less than 1.
const updateQuantity = (state, item, quantity, index) => {
    let cart = [...state.cart]
    if (typeof quantity != 'undefined' && quantity > 0) {
        item.quantity = quantity
        item.price = item.quantity * item.unitPrice
        cart[index] = item
        let totalPrice = calculateTotalPrice(cart)
        return {
            ...state,
            cart,
            totalPrice
        }
    } else {
        return removeCartItem(state, index)
    }
}

const addToCart = (state, item) => {

    var foundItems = state.cart.filter(function (cartItem) {
        return cartItem.id === item.id;
    });

    if (foundItems.length > 0) {
        let newQuantity = Number(foundItems[0].quantity) + 1;
        return updateQuantity(state, foundItems[0], newQuantity)
    } else {
        const newItem = {
            id: item.id,
            quantity: 1,
            price: item.price,
            unitPrice: item.price,
            name: item.name
        };
    
        let cart = [...state.cart, newItem]
        let totalPrice = calculateTotalPrice(cart)
    
        return {
            ...state,
            cart,
            totalPrice
        }
    }
    
}


const shopReducer = (state=initialState, action) => {
  let cart;
  let totalPrice;  
  switch (action.type) {
    case ADD_TO_CART:
        return addToCart(state, action.item, -1)
    case REMOVE_CART_ITEM:
        return removeCartItem(state, action.index)
    case UPDATE_QUANTITY:
        cart = [...state.cart]
        return updateQuantity(state, cart[action.index], action.quantity, action.index)
    case RESET_SHOP:
        console.log("INSIDE RESET SHOP")
        return initialState
    default:
      return state    
  }  
}

const combinedReducer = combineReducers({
  shop: shopReducer
})

export default combinedReducer
