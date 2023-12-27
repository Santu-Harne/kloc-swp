import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAllQuestions } from "../../actions/questionActions";
import { getAllClientResponses,createClientResponse} from "../../actions/clienresponseAction";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { TextField } from "@mui/material";
import '../../styles/Mission.scss'

const headerFields = [
    "questionId",
    "clientInput",
    "klocInput"
  ];

function Mission(){
    const sectionId="section_0003"
    const [initialDataa, setInitialData] = useState([]);
    const [missionData,setMissionData]=useState([])
    const userId=(JSON.parse(localStorage.getItem('users'))).userId
    const userRole=(JSON.parse(localStorage.getItem('users'))).userRole
    const dispatch = useDispatch();
    const {questions}=useSelector(state=>state.questionData)

    useEffect(()=>{
        const fetchData = async () => {
            try {
              // Fetch questions and client responses concurrently
              const questionsPromise = dispatch(getAllQuestions(sectionId));
              const clientResponsesPromise = dispatch(getAllClientResponses());
      
              // Wait for both promises to resolve
              const [questionsData, clientResponsesData] = await Promise.all([questionsPromise, clientResponsesPromise]);
      
              // Merge data based on questionId
              const mergedData = questionsData.payload.map(question => {
                const matchingResponse = clientResponsesData.payload.find(response => response.questionId === question.questionId);
                return {
                  questionId: question.questionId,
                  exampleInput: question.exampleInput,
                  clientInput: matchingResponse ? matchingResponse.clientInput : "",
                  klocInput: matchingResponse ? matchingResponse.klocInput : "",
                  questionHeader:question.questionText.slice(0,question.questionText.indexOf('@')),
                  questionText:question.questionText.slice(question.questionText.indexOf('@')+1,)
                };
              });
              // Update the state with the merged data
              setMissionData(mergedData);
              setInitialData(JSON.parse(JSON.stringify(mergedData)))
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    },[dispatch,sectionId])
    console.log(initialDataa,missionData)
    const handleTextFieldChange = (value, questionId, header) => {
        // Update the missionData state based on the user input
        setMissionData((prevData) => {
          const updatedData = prevData.map((mission) =>
            mission.questionId === questionId
              ? { ...mission, [header]: value }
              : mission
          );
      
          // Log the updated data for debugging
          console.log('Updated Data:', updatedData);
      
          return updatedData;
        });
      };
    

    const keyMapping={
        "Input":"clientInput",
        "Example Input":"exampleInput",
        "Kloc Input":"klocInput"
      }

    const topHeaders=["Pointer","Input","Example Input","Kloc Input"]
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

    const handleSaveResponses=async()=>{
        // Identify differences between initialData and missionData
        console.log(initialDataa,missionData)
        const differences = missionData.filter((item, index) => !deepEqual(item, initialDataa[index]));
      console.log(differences)
      const responsesToSave = missionData.map((mission) => ({
        questionId: mission.questionId,
        clientInput: mission.clientInput,
        klocInput: mission.klocInput,
      }));
      if (differences.length>0){
        try {
            const res = await dispatch(createClientResponse(responsesToSave));
            if (res.payload) {
              setMissionData(missionData)
              setInitialData(missionData)
              toast.success("Mission Data Responses Saved Successfully");
            }
          } catch (error) {
            // Handle any errors during dispatch
            console.error("Error during dispatch:", error);
          }
      }
    }

    return(
        <div className="mission-container">
        <h1 className="heading">MISSION</h1>
        <TableContainer component={Paper} className="table-container">
          <Table className="table">
            <TableHead className="tableHead ">
              <TableRow >
                <TableCell className="tableCell"/>
                {topHeaders.map((header) => (
                  <TableCell className="tableCell" key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="tableBody">
              {missionData.map((mission,index)=>(
                <TableRow>
                    <TableCell className="tableCell">{mission.questionHeader}</TableCell>
                    <TableCell className="tableCell">{mission.questionText}</TableCell>
                    {topHeaders.slice(1).map((header) => (
              <TableCell key={header} className="tableCell">
                {header === 'Input' || header === 'Kloc Input' ? (
                  <TextField
                    sx={{
                      '& input': {
                        color: '#262A2D',
                        fontWeight: '600',
                        border: 'none',
                        width: '200px',
                      },
                    }}
                    value={mission[keyMapping[header]] || ''}
                    onChange={(e) =>
                      handleTextFieldChange(e.target.value, mission.questionId, keyMapping[header])
                    }
                    disabled={
                      (userRole === 'client' && header === 'Kloc Input') ||
                      (userRole === 'admin' && header !== 'Kloc Input')
                    }
                  />
                ) : (
                  // Render something else for headers where TextField is not needed
                  // For Example Input, you can render the content directly without TextField
                  mission[keyMapping[header]]
                )}
              </TableCell>
            ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center">
          <button onClick={handleSaveResponses}  className='save-btn' >Save</button>
        </div>
    </div>
    )
}
export default Mission