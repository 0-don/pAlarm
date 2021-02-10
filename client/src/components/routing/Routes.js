import React, { Fragment } from 'react'
import { Route, Switch } from "react-router-dom"

import PrivateRoute from "../routing/PrivateRoute"

import Register from "../auth/Register";
import Login from "../auth/Login";

import Category from "../category/Category"
import productCategory from "../productCategory/ProductCategory"
import PriceAlert from "../priceAlert/PriceAlert"

import NotFound from "../layout/NotFound"
import Alert from "../layout/Alert";

import Search from "../search/Search"

const Routes = () => {
    return (
        <Fragment>
            <div className="mt-20">
                <Alert />
                <Switch>
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/categories" component={Category} />
                    <PrivateRoute exact path="/product-category/:id" component={productCategory} />
                    <PrivateRoute exact path="/price-alert" component={PriceAlert} />
                    <PrivateRoute exact path="/search" component={Search} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Fragment>
    )
}



export default Routes


