import React from 'react'
import { Link } from "react-router-dom"

const CategoryItem = ({ category: { _id, category, categoryChildren }, isOn, setIsOn }) => {

    return (
        <div>
            <div className="tab w-full overflow-hidden border-t" onClick={() => isOn === _id ? setIsOn("") : setIsOn(_id)}>
                <input className="absolute opacity-0" id={_id} type="radio" name="tabs2" checked={isOn === _id ? true : false} readOnly />
                <label className="block p-5 leading-normal cursor-pointer" htmlFor="tab-single-one">{category}</label>
                <div className="tab-content overflow-hidden border-l-2 bg-gray-100 border-indigo-500 leading-normal">
                    <div className="flex flex-wrap ml-1">
                        {
                            categoryChildren.map(({ categoryChild, _id }) => (
                                <Link to={`product-category/${_id}`} key={_id} className="py-1 lg:w-1/4 w-1/2 text-sm text-blue-700 hover:underline">{categoryChild}</Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CategoryItem
