import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
export const CartProvider = ({ children }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState(0)

    // fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/cart`)
            if (!response.ok) {
                throw new Error('Failed to fetch cart items')
            }
            const data = await response.json()
            setCartItems(data.items || [])
            setTotal(data.total || 0)
        } catch (error) {
            console.error('Error fetching cart items:', error)
        }
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    // Add item to cart
    const addToCart = async (product) => {
        try {
            await fetch(`${BACKEND_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: product.id,

                }),
            })
            await fetchCartItems() // Refresh cart items after adding

        } catch (error) {
            console.error('Error adding to cart:', error)
        }

    }

    const removeFromCart = async (itemID) => {
        try {
            await fetch(`${BACKEND_URL}/api/cart/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: itemID
                }),
            })
            await fetchCartItems() // Refresh cart items after removal
        } catch (error) {
            console.error('Error removing from cart:', error)
        }
    }

    // update quantity
    const updateQuantity = async (itemID, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemID)
        } else {
            try {
                await fetch(`${BACKEND_URL}/api/cart/update/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        item_id: itemID,
                        quantity
                    }),
                })
                await fetchCartItems() // Refresh cart items after update
            } catch (error) {
                console.error('Error updating cart quantity:', error)
            }
        }
    }

    const clearCart = async () => {
        // try {
        //     await fetch(`${BACKEND_URL}/api/cart/clear`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     })
        //     await fetchCartItems() // Refresh cart items after clearing
        // } catch (error) {
        //     console.error('Error clearing cart:', error)
        // }
        setCartItems([])
        setTotal(0)
    }

    return (
        <CartContext.Provider value={{ cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext)