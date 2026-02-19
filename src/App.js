import './App.css'
import {Switch, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Shops from './pages/Shops/Shops'
import ShopItemDetails from './pages/ShopItemDetails/ShopItemDetails'
import NotFound from './pages/NotFound/NotFound'

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/shops" component={Shops} />
    <Route exact path="/shops/:id" component={ShopItemDetails} />
    <Route path="/not-found" component={NotFound} />
  </Switch>
)

export default App
