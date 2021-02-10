import _ from "lodash"
import React, { useEffect, useState, Fragment } from 'react'
import { connect } from "react-redux";
import { getProducts, emptyProductState } from "../../actions/productCategory"
import { createPriceAlert, getPriceAlerts, updatePriceAlert } from "../../actions/priceAlert"

import ProductItem from "./ProductItem"
import FilterItem from "./FilterItem"

import Spinner from "../layout/Spinner"


const ProductCategory = ({
    productCategory: { updateId, updatePrice, categoryChildId, categoryChild, products, filters, loading, attributes },
    getProducts,
    emptyProductState,
    createPriceAlert,
    updatePriceAlert,
    getPriceAlerts,
    priceAlert,
    history,
    match }) => {

    // console.log(priceAlert)

    const [targetPrice, setTargetPrice] = useState(updatePrice ? updatePrice : 0)
    const [isOn, setIsOn] = useState([])


    useEffect(() => {
        return () => emptyProductState()
    }, [emptyProductState])

    useEffect(() => {
        getProducts(match.params.id, attributes)
        getPriceAlerts()
    }, [getProducts, attributes, match.params.id, getPriceAlerts])



    const accodrionSwtich = (e) => {
        if (isOn.indexOf(e.target.id) >= 0) {
            setIsOn(isOn.filter(item => item !== e.target.id))
        } else {
            setIsOn([...isOn, e.target.id])
        }
    }

    const updateCreateButton = () => {
        if (updateId) {
            return (
                <button onClick={() => updatePriceAlert(updateId, targetPrice, attributes, history)} className="border-2 border-blue-500 font-bold text-blue-500 px-2 py-2 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white mr-6">
                    Update
                </button>
            )
        } else {
            return (
                <button onClick={() => createPriceAlert({ categoryChildDbId: match.params.id, categoryChildId, categoryChild, targetPrice, attributes })} className={`${priceAlert.some(e => _.isEqual(e.attributes, attributes) && categoryChildId === e.categoryChildId) ? "bg-red-600" : "bg-gray-600"} uppercase p-3 flex items-center  text-blue-50 max-w-max shadow-sm hover:shadow-lg rounded-full w-12 h-12`}>
                    <svg width="64" height="64" viewBox="0 0 24 20" style={{ transform: "rotate(360deg)" }}><path fill="currentColor" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
            )
        }
    }

    const countSelectedAttributes = (tagValues) => {
        const newTagValues = tagValues.map(({ id }) => (id))
        const newAttributes = attributes.map(({ id }) => (id))
        const selectedAttributes = _.difference(newTagValues, newAttributes)
        return newTagValues.length - selectedAttributes.length
    }

    return loading ? <Spinner /> :
        <Fragment>
            <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center mx-3">
                    <h1 className="md:text-4xl font-bold leading-tight text-gray-900">{categoryChild}</h1>
                    <div className="flex items-center">
                        <div className="relative mr-1">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <input value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} id="targetPrice" type="number" name="targetPrice" className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-1 rounded-lg border border-gray-400 w-28 py-2 focus:outline-none focus:border-blue-400" placeholder="min. Euro" />
                        </div>
                        {updateCreateButton()}
                    </div>
                </div>

                <div className="flex flex-wrap  w-full h-screen">
                    <div className="md:w-3/12 w-full bg-white rounded p-3 shadow-lg">
                        {filters.map(filter => (
                            <div key={filter.index} className="rounded-sm">
                                <div className="border border-b-0 bg-gray-100 px-5 py-2">
                                    <div className="flex justify-between">
                                        <button onClick={(e) => accodrionSwtich(e)} id={filter.index} name={filter.filterTitle} className="text-sm text-gray-800 hover:text-blue-700 focus:outline-none" type="button">
                                            {filter.filterTitle}
                                        </button>
                                        {countSelectedAttributes(filter.tagValues) ? <p className="bg-gray-400 text-white px-2 rounded-full">{countSelectedAttributes(filter.tagValues)}</p> : ""}
                                    </div>
                                </div>
                                <div className={`${isOn.includes(filter.index.toString()) ? "" : "hidden"} overflow-auto ${filter.tagValues.length > 12 ? "h-64" : ""} border border-b-0 px-2 py-3 `}>
                                    <FilterItem key={filter.index} tagValues={filter.tagValues} />
                                </div>
                            </div>
                        ))}
                    </div >

                    <div className="md:w-9/12 w-full">
                        <div className="p-4 flex flex-wrap -mx-1 lg:-mx-4">
                            {products.map(product => (
                                <ProductItem key={product.index} product={product} />
                            ))}
                        </div>
                    </div>

                </div >
            </section >

        </Fragment >
}

const mapStateToProps = state => ({
    productCategory: state.productCategory,
    priceAlert: state.priceAlert.priceAlert,

})

export default connect(mapStateToProps, { getProducts, createPriceAlert, getPriceAlerts, emptyProductState, updatePriceAlert })(ProductCategory)
