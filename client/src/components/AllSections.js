// AllSections.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSections } from '../actions/sectionActions';

const AllSections = () => {
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state?.section || {}); // Provide a default empty object

  useEffect(() => {
    dispatch(getAllSections());
  }, [dispatch]);

  return (
    <div>
      <h1>Sections Data</h1>
      <ul>
        {sections &&
          sections.map((section, index) => {
            return <li key={index}>{section?.sectionName}</li>;
          })}
      </ul>
    </div>
  );
};

export default AllSections;
