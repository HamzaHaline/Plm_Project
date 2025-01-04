      import React from 'react';
import { Switch, Route } from 'react-router-dom'
//import App from './App';
import DashBoard from './components/dashboard/DashBoard';
// import AdminIngredients from './components/admin/AdminIngredients';
import Orders from './components/orders/Orders';
import Storage from './components/storage/Storage';
import Vendors from './components/vendors/Vendors';
import AddVendorForm from './components/vendors/AddVendorForm';
import Product from './components/product/Product';
import Login from './components/login/LoginPage';
import Register from './components/login/RegisterPage';
import AdminUserPage from './components/admin/users/userPage'
import ViewDetailsForm from './components/admin/ViewDetailsForm';
import Log from './components/log/Log';
import Formula from './components/formulas/Formula.js';
import ShoppingCart from './components/shoppingCart/shoppingCart';
import ProductionReview from './components/formulas/productionReview.js';
import FormulaDetails from './components/formulas/formulaDetails.js';
import PageNotFound from './components/error/PageNotFound';
import ProductDetails from './components/product/productDetails';
//import Report from './components/report/report.js';
import FinancialMain from './components/report/financial/FinancialMain';
import FreshnessMain from './components/report/freshness/FreshnessMain';
import TrackingMain from './components/report/tracking/TrackingMain';
import DistributionNetwork from './components/distributorNetwork/distributorNetwork.js';
import ProductionLine from './components/productionLine/ProductionLine.js';
import ProductionLineDetails from './components/productionLine/ProductionLineDetails.js';
import MainIngredientView from './components/admin/mainIngredientView';
import MainCartView from './components/shoppingCart/MainCartView.js';
// import ShoppingCartAndOrders from './components/shoppingCart/mainPage';
import PendingOrderView from './components/shoppingCart/pendingOrder/PendingOrderTable'



const Routes = () => (
      <div>
	      <Switch>
            <Route exact path="/" component={MainIngredientView} />
            <Route path="/dashboard" component={DashBoard} />
            <Route path="/admin-ingredients" component={MainIngredientView} />
            <Route path="/ingredient-details" component={ViewDetailsForm} />
            <Route path="/orders" component={Orders} />
            <Route path="/storage" component={Storage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/vendors" component={Vendors} />
            <Route path="/addVendorForm" component={AddVendorForm} />
            <Route path="/cart" component={MainCartView} />
            <Route path="/pending-orders" component={PendingOrderView} />
            <Route path="/report-financial" component={FinancialMain} />
            <Route path='/report-freshness' component={FreshnessMain} />
            <Route path='/report-tracking' component={TrackingMain} />
            <Route path="/log" component={Log} />
            <Route path="/formula" component={Formula} />
            <Route path="/pagenotfound" component={PageNotFound} />
            <Route path="/production-review" component={ProductionReview}/>
            <Route path="/formula-details" component={FormulaDetails}/>
            <Route path="/admin-users" component={AdminUserPage} />
            <Route path="/product" component={Product} />
            <Route path="/product-details" component={ProductDetails} />
            <Route path="/distribution-network" component={DistributionNetwork} />
            <Route path="/production-line" component={ProductionLine} />
            <Route path='/production-line-details' component = {ProductionLineDetails} />

		</Switch>
      </div>
);

export default Routes;
