import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
//icons
import { backIcon } from '../assets/icons'


const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/product/${id}/`)
                if (!response.ok) throw new Error('Failed to fetch product')
                const data = await response.json()
                setProduct(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!product) return <p>Product not found</p>

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8">
                    {backIcon}
                    Back to Products
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
                        {/* Product Image */}
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={`http://localhost:8000${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 capitalize">{product.name}</h1>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-indigo-600">Rs {product.price}</span>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => addToCart(product)} className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
                                    Add to Cart
                                </button>
                                <button className="flex-1 border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-200">
                                    Save for Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails