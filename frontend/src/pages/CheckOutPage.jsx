import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CheckOutPage = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const navigate = useNavigate()
    const { clearCart } = useCart()

    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        payment_method: 'COD',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        try {
            const response = await fetch(`${BASE_URL}/api/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })
            const data = await response.json()
            if (response.ok) {
                setMessage('Order placed successfully!')
                clearCart()
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } else {
                setMessage(data.error || 'Failed to place order')
            }
        } catch (error) {
            setMessage('An error occurred while placing the order')
        }
    }

    return (
        <div className='checkout-container p-4 max-w-md mx-auto bg-white rounded shadow mt-10'>
            <div className='text-center mb-6 text-2xl font-bold text-gray-800'>
                <h1 className='text-2xl font-bold text-gray-800 text-center '>Checkout</h1>

                <form onSubmit={handleSubmit} className='space-y-4 mt-6'>
                    {/* Form fields would go here */}
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required className='w-full p-1 border rounded' />

                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required className='w-full p-2 border rounded' />

                    <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className='w-full p-2 border rounded' />

                    <select name="payment_method" value={form.payment_method} onChange={handleChange} className='w-full p-2 border rounded'>
                        <option value="COD">Cash on Delivery</option>
                        <option value="Card">Credit/Debit Card</option>
                        <option value="Mobile_Banking">Mobile Banking</option>
                    </select>
                    <button type="submit" disabled={loading} className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>

                    {message && <p className='text-green-500 text-center mt-4'>{message}</p>}
                </form>
            </div>

        </div>
    )
}

export default CheckOutPage