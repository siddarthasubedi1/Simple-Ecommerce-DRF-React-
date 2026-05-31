import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
const ProductList = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [products, setProducts] = useState([])
    const [categorys, setCategory] = useState([])
    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:8000/api/product/')
            .then(response => response.json())
            .then(data => {
                setProducts(data)
                setError(null)
            })
            .catch(error => {
                console.error('Error fetching products:', error)
                setError('Failed to load products')
            })
            .finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        fetch('http://localhost:8000/api/category/')
            .then(response => response.json())
            .then(data => setCategory(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-indigo-600">Store</h1>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <header className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Our Products
                    </h2>
                    <p className="text-lg text-gray-600">Discover our latest collection of premium products</p>
                </header>

                {/* Error State */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-semibold">⚠️ {error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/product/${item.id}`}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1"
                                    >
                                        {/* Image Container */}
                                        <div className="h-56 overflow-hidden bg-gray-200 relative">
                                            <img
                                                src={`http://localhost:8000${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                New
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-indigo-600 capitalize">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-2xl font-bold text-indigo-600">
                                                    Rs {item.price}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-500 text-xl">No products found.</p>
                                </div>
                            )}
                        </div>

                        {/* Categories Section */}
                        {categorys.length > 0 && (
                            <div className="mt-16 pt-12 border-t border-gray-200">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categorys.map((category) => (
                                        <div
                                            key={category.id}
                                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                        >
                                            <h3 className="text-xl font-bold text-gray-900 text-indigo-600 hover:text-indigo-700">
                                                {category.name}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductList