import { Route } from "react-router-dom";
import CreateCoreCompetencies from "../components/CoreCompetenciesSection/CreateCoreCompetencies";

const coreCompetencyRoutes=(
    <>
        <Route exact path='/core_competencies' element={<CreateCoreCompetencies />} />
    </>
)
export default coreCompetencyRoutes