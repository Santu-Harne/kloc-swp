import { Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute';
import Login from "../components/Login";
import clientRoutes from './clientRoutes'
import Register from '../components/Register';

const routes = (
  <>
    <Route exact path="/" element={<Login />} /> {/* Login Route */}
    <Route exact path="/login" element={<Login />} /> {/* Login Route */}
    <Route exact path='/register' element= {<Register/>} />
    {clientRoutes}
    {/* <Route exact element={<ProtectedRoute />}>
    </Route> */}
  </>
)

export default routes