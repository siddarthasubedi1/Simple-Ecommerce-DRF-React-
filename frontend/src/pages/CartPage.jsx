import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const CartPage = () => {

    const { cartItems, total, updateQuantity, removeFromCart } = useCart()
    // const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const itemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    const formatPrice = (value) => Number(value || 0).toFixed(2)
    const placeholderImage = 'https://via.placeholder.com/400x400?text=Product'
    console.log('cartItems:', cartItems)
    console.log('total:', total)

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <Link to="/">
                            <FontAwesomeIcon icon={faAngleLeft} />
                            Home</Link>
                        <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
                        <p className="mt-1 text-sm text-slate-600">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                        <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Add products from the store to see them here.
                        </p>
                        <Link
                            to="/"
                            className="mt-6 inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const quantity = Number(item.quantity || 0)

                                return (
                                    <article
                                        key={item.id}
                                        className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                                    >


                                        <div className="grid gap-4 p-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center sm:p-5">


                                            {/* fetch product image */}
                                            <div className="h-24 w-full overflow-hidden rounded-md bg-slate-100">
                                                <img
                                                    src={item.product_image ? `${BACKEND_URL}${item.product_image}` : placeholderImage}
                                                    alt={item.product_name}
                                                    className="h-full w-full object-cover"
                                                />

                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold capitalize text-slate-900">
                                                        {item.product_name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {item.product_description || 'Selected item in your cart.'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-slate-500">Price</p>
                                                        <p className="text-xl font-semibold text-slate-900">
                                                            Rs.{formatPrice(item.product_price)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 bg-white">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="h-10 w-10 text-lg font-medium text-slate-700 transition hover:bg-slate-100"
                                                                aria-label={`Decrease quantity of ${item.product_name}`}
                                                            >
                                                                −
                                                            </button>
                                                            <span className="min-w-10 px-3 text-center text-sm font-medium text-slate-900">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="h-10 w-10 text-lg font-medium text-slate-700 transition hover:bg-slate-100"
                                                                aria-label={`Increase quantity of ${item.product_name}`}
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="inline-flex h-10 items-center justify-center rounded-md border border-rose-200 px-4 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Subtotal</p>
                                    <p className="text-2xl font-semibold text-slate-900">Rs.{formatPrice(total)}</p>
                                </div>
                                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage