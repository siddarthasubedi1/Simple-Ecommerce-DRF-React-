import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Navbar = () => {
    const { cartItems } = useCart()
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
    return (
        <div>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">Siddartha Cart</Link>
                    <Link to="/cart" className="relative inline-flex items-center text-gray-700 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar