import { Route } from "react-router-dom";
import GetAllQuestions from "../components/ExecutiveSummery/ExecutiveSummery";
import ExecutiveSummary from "../components/ExecutiveSummery/ExecutiveSummery";


const ExecutiveSummaryRoutes=(
    <>
      <Route path="/executive"  element = {<ExecutiveSummary/>}/>
    </>
)
export default ExecutiveSummaryRoutes