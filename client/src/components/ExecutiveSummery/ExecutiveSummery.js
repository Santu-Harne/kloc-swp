// ExecutiveSummary.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestions } from "../../actions/ExecutiveSummary";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { TextField } from "@mui/material";
import { createClientResponse} from "../../actions/clienresponseAction";

function ExecutiveSummary() {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [clientInputValues, setClientInputValues] = useState({});
  const [klocInputValues, setKlocInputValues] = useState({});

  const sectionId = "section_0001";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuestions(sectionId));
  }, []);

  // Fetch the clientResponseData from the Redux store
  const clientResponseData = useSelector((state) => state.clientResponseData);

  // useEffect(() => {
  //   // Populate state with the data from Redux store
  //   // setSelectedQuestionIds(clientResponseData.QuestionId || []);
  //   setClientInputValues(clientResponseData.clientInput || {});
  //   setKlocInputValues(clientResponseData.klocInput || {});
  // }, [clientResponseData]);

  const questionData = useSelector((state) => state.executiveSummery);

  const questionheaders = questionData.sections.map((question) => {
    const colonIndex = question.questionText.split(":")[0];
    return colonIndex;
  });

  const questionText = questionData.sections.map((question) => {
    const questions = question.questionText.split(":")[1];
    return questions;
  });

  const exampleInput = questionData.sections.map((question) => {
    const inputs = question.exampleInput;
    return inputs;
  });

  const questionIds = questionData.sections.map((question) => {
    return question.questionId;
  });

  const handleRowClick = (questionId) => {
    // Toggle selection of questionId
    const isSelected = selectedQuestionIds.includes(questionId);
    const updatedSelection = isSelected
      ? selectedQuestionIds.filter((id) => id !== questionId)
      : [...selectedQuestionIds, questionId];

    setSelectedQuestionIds(updatedSelection);

    // Do whatever you need with the selected question Ids
    console.log("Selected Question Ids:", updatedSelection);
  };

  const handleClientInputChange = (value, index) => {
    const handleClientInputChange = (value, index) => {
      // Update the client input values using the functional update form
      setClientInputValues((prevValues) => ({
        ...prevValues,
        [questionIds[index]]: value,
      }));
    };
    
    const handleKlocInputChange = (value, index) => {
      // Update the kloc input values using the functional update form
      setKlocInputValues((prevValues) => ({
        ...prevValues,
        [questionIds[index]]: value,
      }));
    };;
  };
console.log(klocInputValues)
  const handleSaveClick = () => {
    // Create the payload using the collected data
    const payload = selectedQuestionIds.map((questionId) => ({
      questionId:questionId,
      Comments:'',
      clientInput: clientInputValues[questionId] || "",
      klocInput: klocInputValues[questionId] || 0,
      // Add other properties as needed
    }));

    // Dispatch the action with the payload
    dispatch(createClientResponse(payload));

    // Update the Redux store with the latest data
    
  };

  const userId = JSON.parse(localStorage.getItem("users")).userId;
  const userRole = JSON.parse(localStorage.getItem("users")).userRole;

  const headers = ["Headers", "Pointers", "Input", "ExampleInput", "klocInput"];

  return (
    <div className="competitive-analysis-container">
      <h1 className="heading">ExecutiveSummary</h1>
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead className="tableHead ">
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  className="tableCell tableHeadFixed"
                  style={{
                    width: "40px",
                    borderBottom: "2px solid black",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    backgroundColor: "lightgray",
                  }}
                >
                  <strong style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {header}
                  </strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {questionheaders.map((rowHeader, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(questionIds[index])}
                style={{ cursor: "pointer" }}
              >
                <TableCell
                  style={{
                    backgroundColor: "lightgray",
                    padding: "30px",
                    width: "40px",
                    borderBottom: "2px solid black",
                    borderRight: "2px solid black",
                  }}
                >
                  <strong style={{ fontSize: "16px" }}>{rowHeader}</strong>
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "500",
                    padding: "30px",
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  {questionText[index]}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "500",
                    padding: "30px",
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <TextField
                    value={clientInputValues[questionIds[index]] || ""}
                    onChange={(e) => handleClientInputChange(e.target.value, index)}
                    fullWidth
                  />
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "500",
                    padding: "30px",
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  {exampleInput[index]}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "500",
                    padding: "30px",
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <TextField
                    value={klocInputValues[questionIds[index]] || ""}
                    onChange={(e) =>handleClientInputChange(e.target.value)}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="text-center">
        <button className="save-btn" onClick={handleSaveClick}>
          Save
        </button>
      </div>
    </div>
  );
}

export default ExecutiveSummary;
