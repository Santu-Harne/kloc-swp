import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {getAllCompetitiveAnalysis,createCompetitiveAnalysis} from '../../actions/competitiveAnalysisActions'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { TextField } from "@mui/material";
import '../../styles/CompetitiveAnalysis.scss'
const headerFields = [
  "competitiveName",
  "companyProfile",
  "keyCompetitiveAdvantage",
  "targetMarket",
  "marketingStrategy",
  "productsAndServices",
  "productPricing",
  "strengths",
  "weaknesses",
  "opportunities",
  "threats"
];

const initialData = [
  {
    competitiveName: "Your Business",
    ...Object.fromEntries(headerFields.slice(1).map((field) => [field, ""])),
  },
  {
    competitiveName: "Competition 1",
    ...Object.fromEntries(headerFields.slice(1).map((field) => [field, ""])),
  },
  {
    competitiveName: "Competition 2",
    ...Object.fromEntries(headerFields.slice(1).map((field) => [field, ""])),
  },
  {
    competitiveName: "Competition 3",
    ...Object.fromEntries(headerFields.slice(1).map((field) => [field, ""])),
  },
  {
    competitiveName: "Kloc Input",
    ...Object.fromEntries(headerFields.slice(1).map((field) => [field, ""])),
  },
];

function CreateCompetitiveAnalysis() {
    const [initialDataa,setInitialDataa]=useState(initialData)
    const [competitiveAnalysisData,setCompetitiveAnalysisData]=useState(initialData)
    const userId=(JSON.parse(localStorage.getItem('users'))).userId
    const userRole=(JSON.parse(localStorage.getItem('users'))).userRole
    const dispatch = useDispatch();
    const { competitiveAnalysis } = useSelector(state => state.competitiveAnalysisData)
    const [tableData, setTableData] = useState([
        {
          leftHeader1: 'Company Profile',
          leftHeader2: 'Key Competitive Advantage',
          rightHeader: 'Company Highlights',
        },
        {
          leftHeader1: 'Target Market',
          leftHeader2: 'Marketing Strategy',
          rightHeader : 'Marketing Information',
        },
        {
          leftHeader1: 'Products & Services',
          leftHeader2: 'Pricing',
          rightHeader : 'Product Information',
        },
        {
          leftHeader1: 'Strengths',
          leftHeader2: 'Weaknesses',
          leftHeader3: 'Opportunities',
          leftHeader4: 'Threats',
          rightHeader : 'SWOT Information',
        },
        // Add more rows as needed
      ]);
    useEffect(()=>{
        dispatch(getAllCompetitiveAnalysis(userId))
    },[])
    // Map the values from competitiveAnalysis to initialData
    useEffect(() => {
      if (competitiveAnalysis) {
        const updatedInitialData = initialData.map((item) => {
          const competitiveItem = competitiveAnalysis.find((cItem) => cItem.competitiveName === item.competitiveName);
          return competitiveItem ? { ...item, ...competitiveItem } : item;
        });
        console.log(updatedInitialData)
        setCompetitiveAnalysisData(updatedInitialData);
        setInitialDataa(JSON.parse(JSON.stringify(updatedInitialData)))
      }
    }, [competitiveAnalysis]);
    const keyMapping = {
      'Company Profile': 'companyProfile',
      'Key Competitive Advantage': 'keyCompetitiveAdvantage',
      'Target Market': 'targetMarket',
      'Marketing Strategy': 'marketingStrategy',
      'Products & Services': 'productsAndServices',
      'Pricing': 'productPricing',
      'Strengths': 'strengths',
      'Weaknesses': 'weaknesses',
      'Opportunities': 'opportunities',
      'Threats': 'threats',
    };
    const topHeaders=['Your Business','Competition 1','Competition 2','Competition 3','Kloc Input']
    const handleTextFieldChange = (value, leftHeader, competitiveName) => {
      // Handle changes in the TextField and update the state accordingly
      const updatedData=[...competitiveAnalysisData]
      const rowIndex = updatedData.findIndex((row) => competitiveName === row.competitiveName);
      // Map the left header to the corresponding key using the keyMapping
      const dataKey = keyMapping[leftHeader];

      // Update the specific cell with the changed value
      updatedData[rowIndex][dataKey] = value;
      // Update the state with the modified data
      setCompetitiveAnalysisData(updatedData)
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
      console.log(initialDataa)
      console.log(competitiveAnalysisData)
      const differences = competitiveAnalysisData.filter((item, index) => !deepEqual(item, initialDataa[index]));
      if (differences.length>0){
        try {
          const res = await dispatch(createCompetitiveAnalysis(differences));
          
          if (res.payload) {
            setCompetitiveAnalysisData(competitiveAnalysisData)
            toast.success(res.payload.msg);
          }
        } catch (error) {
          // Handle any errors during dispatch
          console.error("Error during dispatch:", error);
        }
      }
    };
    
  return (
    <div className="competitive-analysis-container">
        <h1 className="heading">COMPETITIVE ANALYSIS</h1>
        <TableContainer component={Paper} className="table-container">
          <Table className="table">
            <TableHead className="tableHead ">
              <TableRow >
                <TableCell className="tableCell  tableHeadFixed"/>
                <TableCell className="tableCell  tableHeadFixed"/>
                {topHeaders.map((header) => (
                  <TableCell className="tableCell  tableHeadFixed" key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="tableBody">
            {tableData.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {Object.keys(row).length <4 ? (
                    <React.Fragment>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader1}</TableCell>
                        <TableCell className="tableCell" rowSpan={2}>{row.rightHeader}</TableCell>
                        {/* Empty cells for top headers */}
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px',// Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader1]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader1, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader2}</TableCell>
                        {/* Empty cells for top headers */}
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px' // Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader2]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader2, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader1}</TableCell>
                        <TableCell className="tableCell" rowSpan={4}>{row.rightHeader}</TableCell>
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px' // Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader1]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader1, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell >
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader2}</TableCell>
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px' // Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader2]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader2, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader3}</TableCell>
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px' // Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader3]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader3, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="tableCell">{row.leftHeader4}</TableCell>
                        {topHeaders.map((header, headerIndex) => (
                          <TableCell className="tableCell" key={headerIndex}>
                          {/* Use TextField for editable cells */}
                          <TextField
                            sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none',width:'200px' // Set the font weight for the label
                                },
                              }}
                            value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader4]]}
                            onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader4, header)}
                            disabled={(userRole === "client" && header === "Kloc Input") || (userRole === "admin" && header !== "Kloc Input")}
                          />
                        </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center">
          <button  className='save-btn' onClick={handleSaveResponses}>Save</button>
        </div>
    </div>
  )
}

export default CreateCompetitiveAnalysis