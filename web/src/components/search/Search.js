import React, { Fragment } from 'react'
import { connect } from "react-redux";
import { useHistory } from "react-router-dom"
import { searchUpdate } from "../../actions/search"
import Spinner from "../layout/Spinner"

const Search = ({ searchCategories, url, searchUpdate, loading }) => {
    let history = useHistory();

    const searchClick = (searchTitle, url, searchLink) => {
        if (searchLink) {
            history.push(`/product-category/${searchLink}`)
        } else {
            searchUpdate(searchTitle, url, history)
        }
    }

    return loading ? <Spinner /> :
        <Fragment>
            <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex flex-wrap -m-2">
                    {!searchCategories ? "" : searchCategories.map(({ searchTitle, searchImg, searchAmount, searchInputValue, searchLink }) => (
                        <div key={searchTitle} onClick={() => searchClick(searchTitle, url, searchLink)} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                            <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={searchImg} />
                                <div className="flex-grow">
                                    <h2 className="text-gray-900 title-font font-medium">{searchTitle}</h2>
                                    <p className="text-gray-500">{searchAmount}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Fragment>
    
}

const mapStateToProps = ({ search }) => ({
    searchCategories: search.searchCategories,
    url: search.url,
    loading: search.loading
})

export default connect(mapStateToProps, { searchUpdate })(Search)