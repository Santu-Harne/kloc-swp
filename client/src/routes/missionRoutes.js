import { Route } from "react-router-dom";
import Mission from "../components/MissionSection/mission";

const MissionRoutes=(
    <>
        <Route exact path='/mission' element={<Mission />} />
    </>
)
export default MissionRoutes