import { Route } from "react-router-dom";
import CreateCompetitiveAnalysis from "../components/CompetitiveAnalysisSection/createCompetitiveAnalysis";

const CompetitiveAnalysisRoutes=(
    <>
        <Route exact path='/competitive_analysis' element={<CreateCompetitiveAnalysis />} />
    </>
)
export default CompetitiveAnalysisRoutes