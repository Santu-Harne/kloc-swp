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
import { createClientResponse, getAllClientResponses } from "../../actions/clienresponseAction";
import toast from 'react-hot-toast';

function  ServiceOffering() {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [clientInputValues, setClientInputValues] = useState({});
  const [klocInputValues, setKlocInputValues] = useState({});

  const sectionId = "section_0005";
  const userRole=(JSON.parse(localStorage.getItem('users'))).userRole

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuestions(sectionId));
  }, []);

  // Fetch the clientResponseData from the Redux store
  const clientResponseData = useSelector((state) => state.clientresponse);
  console.log(clientResponseData);

  useEffect(() => {
    dispatch(getAllClientResponses());
  }, []);

  const questionData = useSelector((state) => state.executiveSummery);
console.log(questionData)
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
    const isSelected = selectedQuestionIds.includes(questionId);
    const updatedSelection = isSelected
      ? selectedQuestionIds.filter((id) => id !== questionId)
      : [...selectedQuestionIds, questionId];

    setSelectedQuestionIds(updatedSelection);

    console.log("Selected Question Ids:", updatedSelection);
  };

  const handleClientInputChange = (value, questionId) => {
    setClientInputValues((prevValues) => ({
      ...prevValues,
      [questionId]: value,
    }));
  };

  const handleKlocInputChange = (value, questionId) => {
    setKlocInputValues((prevValues) => ({
      ...prevValues,
      [questionId]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedClientResponseData = selectedQuestionIds.map((questionId) => {
      const existingClientResponse = clientResponseData?.clientresponses?.find(
        (response) => response.questionId === questionId
      );
  
      const clientInput =
        clientInputValues[questionId] !== undefined
          ? clientInputValues[questionId]
          : existingClientResponse?.clientInput;
  
      const klocInput =
        klocInputValues[questionId] !== undefined
          ? klocInputValues[questionId]
          : existingClientResponse?.klocInput;
  
      // Only include fields that are non-empty
      const nonEmptyFields = {
        questionId: questionId,
        Comments: "",
      };
  
      if (clientInput !== undefined && clientInput !== "") {
        nonEmptyFields.clientInput = clientInput;
      }
  
      if (klocInput !== undefined && klocInput !== "") {
        nonEmptyFields.klocInput = klocInput;
      }
  
      return nonEmptyFields;
    });
  
    console.log(updatedClientResponseData);
  
    try {
      // Check if there are non-empty fields to update
      if (updatedClientResponseData.some((data) => Object.keys(data).length > 2)) {
        const res = await dispatch(createClientResponse(updatedClientResponseData));
  
        if (res.payload) {
          // Update the state or perform any additional actions
          // based on the response from the API
          toast.success(res.payload.msg);
          console.log(res.payload)
        }
      } else {
   
      }
    } catch (error) {
      // Handle any errors during dispatch
      console.error("Error during dispatch:", error);
      toast.error(error.message);
    }
  };
  
  

  const headers = ["Probes", "Input", "ExampleInput", "klocInput"];

  return (
    <div className="competitive-analysis-container">
      <h1 className="heading" style={{textAlign:'center'}}>ServiceOffering</h1>
      <TableContainer component={Paper} className="table-container">
        <Table className="table">
          <TableHead className="tableHead">
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
            {questionData.sections.map((question, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(questionIds[index])}
                style={{ cursor: "pointer" }}
              >
                <TableCell
                  style={{
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderTop: "2px solid black",
                    borderRight: "2px solid black",
                    backgroundColor: "lightgray",
                  }}
                >
                  {question.questionText.split(":")[0]}
                </TableCell>
                <TableCell
                  style={{
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                 
                  <TextField
                    value={
                      clientInputValues[questionIds[index]] !== undefined
                        ? clientInputValues[questionIds[index]]
                        : clientResponseData?.clientresponses?.find(
                            (response) => response?.questionId === questionIds[index]
                          )?.clientInput || ""
                    }
                    onChange={(e) => handleClientInputChange(e.target.value, questionIds[index])}
                    fullWidth
                    disabled={!(userRole === "client" ) || (userRole === "admin")}
                  />
                </TableCell>
                <TableCell
                  style={{
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  {exampleInput[index]}
                </TableCell>
                <TableCell
                  style={{
                    width: "40px",
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <TextField
                    value={
                      klocInputValues[questionIds[index]] !== undefined
                        ? klocInputValues[questionIds[index]]
                        : clientResponseData?.clientresponses?.find(
                            (response) => response?.questionId === questionIds[index]
                          )?.klocInput || ""
                    }
                    onChange={(e) => handleKlocInputChange(e.target.value, questionIds[index])}
                    fullWidth
                    disabled={(userRole === "client" || !userRole === "admin")}

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

export default ServiceOffering;
