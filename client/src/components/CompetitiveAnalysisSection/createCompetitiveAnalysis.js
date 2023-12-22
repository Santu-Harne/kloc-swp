import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {getAllCompetitiveAnalysis,createCompetitiveAnalysis} from '../../actions/competitiveAnalysisActions'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,TextField } from '@mui/material';
const initialData=[
  {
    "competitiveName":"Your Business",
    "companyProfile":"",
    "keyCompetitiveAdvantage":"",
    "targetMarket":"",
    "marketingStrategy":"",
    "productsAndServices":"",
    "productPricing":"",
    "strengths":"",
    "weaknesses":"",
    "opportuntities":"",
    "threats":""
  },
  {
    "competitiveName":"Competition 1",
    "companyProfile":"",
    "keyCompetitiveAdvantage":"",
    "targetMarket":"",
    "marketingStrategy":"",
    "productsAndServices":"",
    "productPricing":"",
    "strengths":"",
    "weaknesses":"",
    "opportuntities":"",
    "threats":""
  },
  {
    "competitiveName":"Competition 2",
    "companyProfile":"",
    "keyCompetitiveAdvantage":"",
    "targetMarket":"",
    "marketingStrategy":"",
    "productsAndServices":"",
    "productPricing":"",
    "strengths":"",
    "weaknesses":"",
    "opportuntities":"",
    "threats":""
  },
  {
    "competitiveName":"Competition 3",
    "companyProfile":"",
    "keyCompetitiveAdvantage":"",
    "targetMarket":"",
    "marketingStrategy":"",
    "productsAndServices":"",
    "productPricing":"",
    "strengths":"",
    "weaknesses":"",
    "opportuntities":"",
    "threats":""
  },
  {
    "competitiveName":"Kloc Input",
    "companyProfile":"",
    "keyCompetitiveAdvantage":"",
    "targetMarket":"",
    "marketingStrategy":"",
    "productsAndServices":"",
    "productPricing":"",
    "strengths":"",
    "weaknesses":"",
    "opportuntities":"",
    "threats":""
  }
]
function CreateCompetitiveAnalysis() {
    const [competitiveAnalysisData,setCompetitiveAnalysisData]=useState(initialData)
    const userId=(JSON.parse(localStorage.getItem('users')))?.userId
    const dispatch = useDispatch();
    const { competitiveAnalysis } = useSelector(state => state.data)
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
        setCompetitiveAnalysisData(updatedInitialData);
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
      setCompetitiveAnalysisData(updatedData);
    };
    const handleSaveResponses=async()=>{
      await dispatch(createCompetitiveAnalysis(competitiveAnalysisData))
      .then((res)=>{
        if (res.payload){
          toast.success(res.payload.msg)
          window.location.reload()
        }
      })
    }
    console.log(competitiveAnalysisData)
  return (
    <div className="competitive-analysis-container">
        <h1>COMPETITIVE ANALYSIS</h1>
        <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            {topHeaders.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {tableData.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {Object.keys(row).length <4 ? (
                <React.Fragment>
                  <TableRow>
                    <TableCell>{row.leftHeader1}</TableCell>
                    <TableCell rowSpan={2}>{row.rightHeader}</TableCell>
                    {/* Empty cells for top headers */}
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader1]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader1, header)}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>{row.leftHeader2}</TableCell>
                    {/* Empty cells for top headers */}
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader2]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader2, header)}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TableRow>
                    <TableCell>{row.leftHeader1}</TableCell>
                    <TableCell rowSpan={4}>{row.rightHeader}</TableCell>
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader1]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader1, header)}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>{row.leftHeader2}</TableCell>
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader2]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader2, header)}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>{row.leftHeader3}</TableCell>
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader3]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader3, header)}
                      />
                    </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>{row.leftHeader4}</TableCell>
                    {topHeaders.map((header, headerIndex) => (
                      <TableCell key={headerIndex}>
                      {/* Use TextField for editable cells */}
                      <TextField
                        sx={{'& input': {color:'#262A2D',fontWeight: '600',border:'none' // Set the font weight for the label
                            },
                          }}
                        value={competitiveAnalysisData[headerIndex][keyMapping[row.leftHeader4]]}
                        onChange={(e) => handleTextFieldChange(e.target.value, row.leftHeader4, header)}
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
          <button onClick={handleSaveResponses}>Save</button>
        </div>
    </div>
  )
}

export default CreateCompetitiveAnalysis