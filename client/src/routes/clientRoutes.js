import { Route } from "react-router-dom";
import Client from "../components/Client";

const clientRoutes = (
  <>
    {/* client Module Routes */}
    <Route exact path="/all_clients" element={<Client />} />
  </>
)
export default clientRoutes