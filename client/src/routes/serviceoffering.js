import { Route } from "react-router-dom";
import GetAllQuestions from "../components/ExecutiveSummery/ExecutiveSummery";

import ServiceOffering from "../components/ServiceOffering/ServiceOffering";


const ServiceOfferingRoutes=(
    <>
      <Route path="/service_offering"  element = {<ServiceOffering/>}/>
    </>
)
export default  ServiceOfferingRoutes