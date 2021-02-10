import React, { useEffect } from 'react'
import { connect } from "react-redux";
import { getPriceAlerts, deletePriceAlert, editPriceAlert } from "../../actions/priceAlert"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"



const PriceAlert = ({ getPriceAlerts, priceAlert, deletePriceAlert, editPriceAlert, history }) => {
    dayjs.extend(relativeTime)

    useEffect(() => {
        getPriceAlerts()
    }, [getPriceAlerts])

    const renderAttributes = (attributes) => {
        const values = attributes.map(attribute => {
            return attribute.value
        })
        return values.join(", ")
    }
    
    return (
        <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            {priceAlert.map(({ categoryChildDbId, categoryChild, attributes, _id, targetPrice, latestPrice, createdAt, updatedAt, }) => (
                <div key={_id} className="flex flex-row mt-2 shadow-md">
                    <div className="flex w-full items-center justify-between bg-white dark:bg-gray-800 px-8 py-6 border-l-4 border-green-500 dark:border-green-300">
                        <div className="flex-1 flex flex-col md:flex-row">

                            <div className="flex flex-col mb-4 ">
                                <span className="text-lg font-bold">{categoryChild}</span>

                                <div className="flex-1 flex flex-col mt-6 ">
                                    <div className="flex my-1 ">
                                        <svg className="w-5 h-5 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                            <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z" />
                                        </svg>
                                        <span className="w-full mx-2 text-sm text-gray-600 dark:text-gray-300 capitalize">{renderAttributes(attributes)}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex my-1 min-w-max">
                                            <svg className="h-5 w-5 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                                <path d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-1V1m-1 11h-5v5h5v-5z"></path>
                                            </svg>
                                            <span className="mx-2 text-sm text-gray-600 dark:text-gray-300 capitalize">Created: {dayjs(createdAt).format('DD.MM.YYYY HH:mm')}</span>
                                        </div>

                                        <div className="flex my-1 min-w-max">
                                            <svg className="h-5 w-5 fill-current dark:text-gray-300" viewBox="0 0 24 24">
                                                <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.92 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95M11 2c-1.95.2-3.8.96-5.32 2.21L7.1 5.63A8.195 8.195 0 0111 4V2M4.2 5.68C2.96 7.2 2.2 9.05 2 11h2c.19-1.42.75-2.77 1.63-3.9L4.2 5.68M6 8v2h3v1H8c-1.1 0-2 .9-2 2v3h5v-2H8v-1h1c1.11 0 2-.89 2-2v-1a2 2 0 00-2-2H6m6 0v5h3v3h2v-3h1v-2h-1V8h-2v3h-1V8h-2M2 13c.2 1.95.97 3.8 2.22 5.32l1.42-1.42A8.21 8.21 0 014 13H2m5.11 5.37l-1.43 1.42A10.04 10.04 0 0011 22v-2a8.063 8.063 0 01-3.89-1.63z"></path>
                                            </svg>
                                            <span className="mx-2 text-sm text-gray-600 dark:text-gray-300 capitalize">Last Update: {dayjs(updatedAt).fromNow()}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex w-full flex-col md:flex-row md:justify-end justify-start">
                                <div className="flex flex-col justify-center mx-5 min-w-max">
                                    <p className="font-semibold">Target Price: <span className="font-semibold text-blue-600">{targetPrice} €</span></p>

                                    <p className="font-semibold">Current Price: <span className={`${latestPrice && latestPrice <= targetPrice ? "text-green-600" : "text-red-600"} font-semibold`}>{latestPrice || "0"} €</span></p>
                                </div>

                                <div className="flex items-center mt-5 md:mt-0">

                                    <button onClick={() => editPriceAlert(_id, categoryChildDbId, targetPrice, attributes, history)} className="flex items-center focus:outline-none border rounded-full md:my-5 py-2 px-6 leading-none border-blue-600 dark:border-blue-600 select-none hover:bg-blue-600 hover:text-white dark-hover:text-gray-200">
                                        <svg className="h-5 w-5 fill-current mr-2 " viewBox="0 0 576 512">
                                            <path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path>
                                        </svg>
                                        <span>Edit</span>
                                    </button>

                                    <button onClick={() => deletePriceAlert(_id)} className="flex items-center ml-4 focus:outline-none border rounded-full md:my-5 py-2 px-6 leading-none border-red-600 dark:border-gray-600 select-none hover:bg-red-600 hover:text-white dark-hover:text-gray-200">
                                        <svg className="h-5 w-5 fill-current mr-2" viewBox="0 0 24 24">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}

const mapStateToProps = state => ({
    priceAlert: state.priceAlert.priceAlert,

})

export default connect(mapStateToProps, { getPriceAlerts, deletePriceAlert, editPriceAlert })(PriceAlert)
