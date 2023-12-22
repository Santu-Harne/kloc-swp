import { Route } from "react-router-dom";
import AllUsers from "../components/AllUsers";
import AllSections from "../components/AllSections";

const userRoutes = (
  <>
    {/* user Module Routes */}
    <Route exact path="/all_users" element={<AllUsers />} />
    <Route exact path="/all_sections" element={<AllSections/>}/>
  </>
)
export default userRoutes