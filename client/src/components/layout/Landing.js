import React, { Fragment } from 'react'
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import background from "../../img/header.png"
import "../../assets/css/Landing.css"


export const Landing = () => {

    return (
        <Fragment>
            <section className="leading-normal tracking-normal text-indigo-400 bg-cover" style={{ backgroundImage: `url(${background})`, position: "relative", height: "100vh" }}>
                <div className="landing-inner">
                    <div className="mx-auto max-w-lg flex flex-col w-full justify-center lg:items-start overflow-y-hidden">
                        <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                            Willkommen bei<span> </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">Preisalarm</span>
                        </h1>
                        <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left">Stelle dir ein Preiswecker für ganze Produktkategorien</p>
                        <div className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                            <label className="block text-blue-300 py-2 font-bold mb-2" htmlFor="emailaddress">
                                Registrieren oder Einloggen
                            </label>
                            <div className="flex items-center justify-between pt-4">
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                    type="button">
                                    Registrieren
                                </Link>
                                <Link
                                    to="/login"
                                    className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                                    type="button">
                                    Einloggen
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment >
    )
}



export default connect()(Landing)