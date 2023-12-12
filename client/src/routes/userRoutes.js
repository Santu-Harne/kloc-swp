import { Route } from "react-router-dom";
import AllUsers from "../components/AllUsers";

const userRoutes = (
  <>
    {/* client Module Routes */}
    <Route exact path="/all_users" element={<AllUsers />} />
  </>
)
export default userRoutes