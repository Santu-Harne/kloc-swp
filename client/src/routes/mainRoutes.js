import { Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute';
import Login from "../components/Login";
import clientRoutes from './clientRoutes'

const routes = (
  <>
    <Route exact path="/" element={<Login />} /> {/* Login Route */}
    <Route exact path="/login" element={<Login />} /> {/* Login Route */}
    {clientRoutes}
    {/* <Route exact element={<ProtectedRoute />}>
    </Route> */}
  </>
)

export default routes