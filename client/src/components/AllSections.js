import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSections } from '../actions/sectionActions';
import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import analysisIcon from "../assets/images/analysis icon.svg";
import Clock from "../assets/images/Clock icon.svg";
import ConsumerUnderstanding from "../assets/images/Consumer Understanding icon.svg";
import corePurpose  from "../assets/images/core purpose icon.svg";
import coreValue  from "../assets/images/core value icon.svg";
import ExecutiveSummary  from "../assets/images/Executive summary icon.svg";
import Mission from "../assets/images/mission icon.svg";
import VisionBoard from "../assets/images/vision board icon.svg";
import Dashboard from './Header/Dashboard';

const AllSections = () => {
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state?.section || {});

  useEffect(() => {
    dispatch(getAllSections());
  }, [dispatch]);

  const getIconBySection = (sectionName) => {
    switch (sectionName) {
      case 'Mission':
        return <img
        src={Mission}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Vision Board':
        return <img
        src={VisionBoard}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Consumer Understanding':
        return <img
        src={ConsumerUnderstanding}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Services':
        return <img
        src={corePurpose}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Competition':
        return <img
        src={coreValue}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Executive Summary':
        return <img
        src={ExecutiveSummary}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      case 'Core Competency':
        return <img
        src={analysisIcon}
        alt="logo"
        className="logo"
        //onClick={handleLogout}
      />;
      // Add more cases as needed
      default:
        return null;
    }
  };

  return (
    <div>
        <Dashboard/>
        <div className='container'>
            <div className='row'>
                <div className='col-md-6'>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>        
         <Card style={{ width: '80%', margin: 16, display: 'flex', alignItems: 'center' }}>
            <CardContent style={{ flex: 1, display: 'flex', alignItems: 'center',flexDirection:"column" }} >
            <CardActions>
              <IconButton>
                  <img src={coreValue} alt="Clock icon" className="icon" />
                </IconButton>
              </CardActions>
                <Typography>Analyzed</Typography>
            </CardContent>
            </Card>
            <Card style={{ width: '80%', margin: 16, display: 'flex', alignItems: 'center',flexDirection:"row" }}>
            <CardContent style={{ flex: 1, display: 'flex', alignItems: 'center',flexDirection:"column" }}>
            <CardActions>
              <IconButton>
                  <img src={corePurpose} alt="Clock icon" className="icon" />
                </IconButton>
              </CardActions>
                <Typography>in Progress</Typography>
            </CardContent>
            </Card>
            <Card style={{ width: '80%', margin: 16, display: 'flex', alignItems: 'center',flexDirection:"row" }}>
            <CardContent style={{ flex: 1, display: 'flex', alignItems: 'center',flexDirection:"column" }}>
            <CardActions>
              <IconButton>
                  <img src={Mission} alt="Clock icon" className="icon" />
                </IconButton>
              </CardActions>
                <Typography>Complete</Typography>
            </CardContent>
            </Card>
        </div>
     </div>
     </div>
            </div>       
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {sections &&
          sections.map((section, index) => (
            <Card key={index} style={{ width: '80%', margin: 16, display: 'flex', alignItems: 'center' }}>
              <CardContent style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginRight: 16 }}>
                  {getIconBySection(section?.sectionName)}
                </Typography>
                <Typography variant="h6">{section?.sectionName}</Typography>
              </CardContent>
              <CardActions>
              <IconButton>
                  <img src={Clock} alt="Clock icon" className="icon" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </div>
      </div>
    
  );
};

export default AllSections;
