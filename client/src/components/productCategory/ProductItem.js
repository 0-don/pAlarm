import React, { Fragment } from 'react'
// import { Link } from "react-router-dom"

const ProductItem = ({ product: { productTitle, img, description, price } }) => {

    return (
        <Fragment>
            {/* sm:w-1/2 md:w-1/2   */}
            <div className="my-1 px-1 lg:my-4 lg:px-4 lg:w-1/4 w-1/2">
                <article className="overflow-hidden rounded-lg shadow-lg">
                    <img alt="Placeholder" className="block mx-auto p-5" src={img} />
                    <header className="h-24 min-h-full flex items-center justify-between leading-tight p-2 md:p-4">
                        <h1 className="text-sm">{productTitle.length > 80 ? `${productTitle.substring(0, 80)}...` : productTitle}</h1>
                    </header>

                    <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                        <p className="ml-2 text-sm text-red-600">{price}</p>
                    </footer>
                </article>
            </div>
        </Fragment>
    )
}


export default ProductItem
