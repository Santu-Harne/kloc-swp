import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {getAllCoreCompetencyNames,getAllCoreCompetencies,createCoreCompetencies} from '../../actions/coreCompetenciesActions'
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { TextField } from "@mui/material";
import '../../styles/CoreCompetencies.scss'

const headerFields = [
  "coreCompetencyNameId",
  "description",
  "importance",
  "defensability",
  "klocInput"
];
function CreateCoreCompetencies() {
  const [initialDataa, setInitialData] = useState([]);
    const [coreCompetenciesData,setCoreCompetenciesData]=useState([])
    const userId=(JSON.parse(localStorage.getItem('users'))).userId
    const userRole=(JSON.parse(localStorage.getItem('users'))).userRole
    const dispatch = useDispatch();
    const {coreCompetencyNames,coreCompetencies}=useSelector(state=>state.coreCompetenciesData)

    useEffect(()=>{
      dispatch(getAllCoreCompetencyNames())
      dispatch(getAllCoreCompetencies())
  },[dispatch])
  const keyMapping={
    "Description":"description",
    "Importance":"importance",
    "Defensability":"defensability",
    "Kloc Input":"klocInput"
  }

  const coreCompetencyNameData=coreCompetencyNames?.map(item=>[item.coreCompetencyNameId,item.coreCompetencyName])
   // Initialize the state with initial data
   useEffect(() => {
    if (coreCompetencies.length>0){
      const initialData = coreCompetencyNameData?.map(row => {
        const coreCompetency = coreCompetencies?.find(comp => comp.coreCompetencyName.coreCompetencyNameId === row[0] );
        const rowData = {
          coreCompetencyNameId: row[0],
          description: coreCompetency ? coreCompetency.description : '',
          importance: coreCompetency ? coreCompetency.importance : '',
          defensability: coreCompetency ? coreCompetency.defensability : '',
          klocInput: coreCompetency ? coreCompetency.klocInput : '',
        };
        return rowData;
      });
      setCoreCompetenciesData(initialData);
      setInitialData(JSON.parse(JSON.stringify(initialData)))
    }else{
      const initialData = coreCompetencyNameData.map(row => {
        const rowData = { coreCompetencyNameId: row[0]};
        headerFields.slice(1).forEach(header => {
          rowData[header] = ''; // Set an empty string as the initial value
        });
        return rowData;
      });
      setCoreCompetenciesData(initialData);
      setInitialData(JSON.parse(JSON.stringify(initialData)))
    }
  }, [coreCompetencies]);
  let topHeaders=['Competencies','Description','Importance','Defensability','Kloc Input']

  const handleTextFieldChange = (value, coreCompetencyNameId, header) => {
    // Handle changes in the TextField and update the state accordingly
    const updatedData = [...coreCompetenciesData];
    const rowIndex = updatedData.findIndex((row) => coreCompetencyNameId === row.coreCompetencyNameId);
  
    // Update the specific cell with the changed value
    updatedData[rowIndex][header] = value;
  
    // Update the state with the modified data
    setCoreCompetenciesData(updatedData);
  };
  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }
  const handleSaveResponses = async () => {
    const differences = coreCompetenciesData.filter((item, index) => !deepEqual(item, initialDataa[index]));
    
    if (differences.length>0){
      try {
        const res = await dispatch(createCoreCompetencies(differences));
        
        if (res.payload) {
          setCoreCompetenciesData(coreCompetenciesData)
          toast.success("Core Competencies Data Responses Saved Successfully");
        }
      } catch (error) {
        // Handle any errors during dispatch
        console.error("Error during dispatch:", error);
      }
    }
  };
  return (
    <div className="core-competency-mapping-container">
      <div >
        <h2 className='main-heading'>CORE COMPETENCY & COMPETITIVE ADVANTAGE MAPPING</h2>
        <div className='core-competency-content-container'>
          <p className='core-competency-matter'>
            Core competencies are the defining products, services, skills, and capabilities that give a business advantages over its competitors. They are the competitive advantages that no competitor can reasonably offer or replicate.
          </p>
          <ol className='list-container'>
            <li>Collective learning within the business</li>
            <li>Ability to integrate skills and technologies</li>
            <li>Ability to deliver superior products and services</li>
          </ol>
          <h3 className='side-heading'>VRO model: to evaluate if the Core Competencies will offer a long-term competitive advantage:</h3>
          <div className="small-table-container">
            <table className="vro-table">
              <thead>
                <tr>
                  <th>Valuable</th>
                  <th>Rare</th>
                  <th>Organisation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>It has to be of value to the consumer</td>
                  <td>Hard for competition to imitate or would need significant Time/Resource/Money to imitate</td>
                  <td>Company to be organized to implement/leverage it at scale</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className='side-heading'>Steps to evaluate Core Competencies:</h3>
          <ol className='list-container'>
            <li>Look at your customers and clients.</li>
            <li>Turn to your company's mission statement.</li>
            <li>Discuss your core competencies with your team.</li>
          </ol>
        </div>
      </div>
      <TableContainer component={Paper} >
          <Table className="table">
            <TableHead className="tableHead">
              <TableRow >
                {topHeaders.map((header) => (
                  <TableCell className="tableCell" key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="tableBody">
              {coreCompetencyNameData.map((row,index)=>(
                <React.Fragment key={index}>
                  <TableRow>
                    {/* Empty cells for top headers */}
                    <TableCell className="tableCell">{row[1]}</TableCell>
                    {topHeaders.slice(1,).map((header, headerIndex) => (
                      <TableCell className="tableCell" key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px',// Set the font weight for the label
                            },
                          }}
                        value={coreCompetenciesData[index]?.[keyMapping[header]] || ''}
                        onChange={(e) => handleTextFieldChange(e.target.value, row[0], keyMapping[header])}
                        disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center">
          <button className='save-btn' onClick={handleSaveResponses}>Save</button>
        </div>
    </div>
  )
}

export default CreateCoreCompetencies