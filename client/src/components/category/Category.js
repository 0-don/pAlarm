import React, { useEffect, useState, Fragment } from 'react'
import { connect } from "react-redux";
import { getCategories } from "../../actions/category"

import Spinner from "../layout/Spinner"
import CategoryItem from "./CategoryItem"

import "../../assets/css/Category.css"

const Category = ({ getCategories, category: { category, loading } }) => {
    const [isOn, setIsOn] = useState("")

    useEffect(() => {
        getCategories()
    }, [getCategories])

    return loading ? <Spinner /> :
        <Fragment>
            <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-5">Categories</h1>
                <div className="shadow-md">
                    {category.map(category => (
                        <CategoryItem key={category._id} category={category} isOn={isOn} setIsOn={setIsOn} />
                    ))}
                </div>
            </section>
        </Fragment>
}

const mapStateToProps = state => ({
    category: state.category
})

export default connect(mapStateToProps, { getCategories })(Category)
