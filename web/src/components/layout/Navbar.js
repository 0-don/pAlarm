import React, { Fragment, useState, useEffect } from 'react'
import { Link,useHistory } from "react-router-dom"
import { connect } from "react-redux";

import { logout, loadUser } from "../../actions/auth"
import { search } from "../../actions/search"

import logo from "../../img/clocks.png"

const Navbar = ({ logout, search, loadUser, auth: { isAuthenticated, user } }) => {

    useEffect(() => {
        loadUser();
    }, [loadUser])

    let history = useHistory();
    const [menuIcon, setmenuIcon] = useState(false)
    const [profileIcon, setProfileIcon] = useState(false)
    const [searchText, setSearchText] = useState("")

    const authLinksDesktop = (
        <Link to="/" onClick={() => { setmenuIcon(false); setProfileIcon(false); logout() }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</Link>
    )

    const guestLinksDesktop = (
        <Fragment>
            <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Register</Link>
            <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Login</Link>
        </Fragment>
    )
    const authLinksMobile = (
        <Link to="/" onClick={() => { setmenuIcon(false); setProfileIcon(false); logout() }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Logout</Link>
    )

    const guestLinksMobile = (
        <Fragment>
            <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700" role="menuitem">Register</Link>
            <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700" role="menuitem">Login</Link>
        </Fragment>
    )

    return (
        <Fragment>
            <nav className="fixed z-10 w-full top-0 bg-gray-800">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="flex items-center px-2 lg:px-0">
                            <div className="flex-shrink-0">
                                <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/"><img className="block lg:hidden h-8 w-auto" src={logo} alt="Workflow" /></Link>
                                <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/"><img className="hidden lg:block h-8 w-auto" src={logo} alt="Workflow" /></Link>
                            </div>
                            <div className="hidden lg:block lg:ml-6">
                                <div className="flex space-x-4">
                                    <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                    <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/categories" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Categories</Link>
                                    <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/price-alert" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Price Alert</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <form onSubmit={e => { e.preventDefault(); search(searchText, history); setSearchText("") }}>
                                    <label forhtml="search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input value={searchText} onChange={e => setSearchText(e.target.value)} id="search" name="search" className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm" placeholder="Search" type="search" />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div onClick={() => setmenuIcon(!menuIcon)} className="flex lg:hidden">
                            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className={`${menuIcon ? "hidden" : ""} block h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg className={`${menuIcon ? "" : "hidden"} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="hidden lg:block lg:ml-4">
                            <div className="flex items-center">
                                <button className="flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                    <span className="sr-only">View notifications</span>

                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>
                                <div className="ml-4 relative flex-shrink-0">
                                    <div>
                                        <button onClick={() => setProfileIcon(!profileIcon)} className="bg-gray-800 rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                                            <span className="sr-only">Open user menu</span>
                                            <img className="h-8 w-8 rounded-full" src="https://picsum.photos/200" alt="" />
                                        </button>
                                    </div>
                                    <div className={`${profileIcon ? "" : "hidden"} origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                        {isAuthenticated ? authLinksDesktop : guestLinksDesktop}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${menuIcon ? "" : "hidden"} lg:hidden`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/categories" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Categories</Link>
                        <Link onClick={() => { setmenuIcon(false); setProfileIcon(false) }} to="/price-alert" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Price Alert</Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src="https://picsum.photos/200" alt="" />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{user?.name || ""}</div>
                                <div className="text-sm font-medium text-gray-400">{user?.email || ""}</div>
                            </div>
                            <button className="ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">View notifications</span>

                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            {isAuthenticated ? authLinksMobile : guestLinksMobile}
                        </div>
                    </div>
                </div>
            </nav>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout, loadUser, search })(Navbar)
