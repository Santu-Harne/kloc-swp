import { Route } from 'react-router-dom'
import ProtectedRoute from '../middleware/ProtectedRoute';
import Login from "../components/Login";
import userRoutes from './userRoutes'
import competitiveAnalysisRoutes from '../routes/competitiveAnalysisRoutes'
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import coreCompetencyRoutes from '../routes/coreCompetencyRoutes'
import ExecutiveSummaryRoutes from './executivesummery';

const routes = (
  <>
    <Route exact path="/" element={<Login />} /> {/* Login Route */}
    <Route exact path="/login" element={<Login />} /> {/* Login Route */}
    <Route exact path="/auth/resetPassword/:token" element={<ForgotPassword />} /> {/* Login Route */}
    <Route exact path='/register' element={<Register />} />
    {userRoutes}
    {competitiveAnalysisRoutes}
    {coreCompetencyRoutes}
    {ExecutiveSummaryRoutes}
    {/* <Route exact element={<ProtectedRoute />}>
    </Route> */}
  </>
)

export default routes