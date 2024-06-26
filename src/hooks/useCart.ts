import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/database'
import type { Guitar, CartItem } from '../types/types'

export const useCart = () => {

    const initialCart = ()  : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;


    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar) {

        const itemExist = cart.findIndex(guitar => guitar.id === item.id)

        if (itemExist >= 0) {
            if (cart[itemExist].quantity >= MAX_ITEMS) return
            //Aumentar cantidad sin mutar el state original
            const updatedCart = [...cart];
            updatedCart[itemExist].quantity++;
            setCart(updatedCart)
        } else {
            const newItem :  CartItem = { ...item, quantity : 1} 
            setCart([...cart, newItem])
        }

        // saveLocalStorage();
    }


    function removeFromCart(id : Guitar['id']) {
        // console.log('Eliminando', id)
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id : Guitar['id']) {
        console.log('incrementando', id)
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

    // function saveLocalStorage() {
    //   localStorage.setItem('cart', JSON.stringify(cart))
    // }

    
    //State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal =  useMemo(() => cart.reduce( (total, item) => total + ( item.quantity * item.price), 0), [cart]);


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}