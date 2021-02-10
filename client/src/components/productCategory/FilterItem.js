import React, { Fragment } from 'react'
import { connect } from "react-redux";
import { changeAttributes } from "../../actions/productCategory"

import "../../assets/css/Landing.css"

const FilterItem = ({ tagValues, changeAttributes, productCategory: { attributes } }) => {

    return (
        <Fragment>
            {tagValues.map((tagValue, index) => (
                <div key={index} className="flex justify-between items-center">
                    <label htmlFor={tagValue.id} className="text-sm flex items-center cursor-pointer my-1">
                        <div className="relative">
                            <input
                                id={tagValue.id}
                                type="checkbox"
                                name={tagValue.value}
                                className="hidden"
                                onChange={e => changeAttributes(attributes, {id: e.target.id, value: e.target.name})}
                                checked={attributes.some(attribute => attribute.id === tagValue.id.toString()) ? true : false}
                            />
                            <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                        </div>
                        <div className="ml-3 text-gray-700 font-medium">{tagValue.value}</div>
                    </label>
                    <p className="text-xs">{tagValue.amount || ""}</p>
                </div>
            ))}
        </Fragment>
    )
}

const mapStateToProps = state => ({
    productCategory: state.productCategory
})

export default connect(mapStateToProps, { changeAttributes })(FilterItem)
