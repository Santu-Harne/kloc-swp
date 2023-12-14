import { Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute';
import Login from "../components/Login";
import userRoutes from './userRoutes'
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';

const routes = (
  <>
    <Route exact path="/" element={<Login />} /> {/* Login Route */}
    <Route exact path="/login" element={<Login />} /> {/* Login Route */}
    <Route exact path="/auth/resetPassword/:token" element={<ForgotPassword />} /> {/* Login Route */}
    <Route exact path='/register' element={<Register />} />
    {userRoutes}
    {/* <Route exact element={<ProtectedRoute />}>
    </Route> */}
  </>
)

export default routes