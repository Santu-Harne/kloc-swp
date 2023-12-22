const assert = require('assert')
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')

const coreCompetencyController={
    createCoreCompentencyName:async(req,res)=>{
        try{
            const reqBody = req.body
            if (!reqBody || !reqBody.hasOwnProperty('coreCompetencyName') || reqBody['coreCompetencyName'].trim()===''){
                res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Required Fields Are Missing' });
                return;
            }
            // Check if the competencyName already exists
            const existingCompetency = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM coreCompetencyName_table WHERE coreCompetencyName = ?', [reqBody.coreCompetencyName], (err, results) => {
                if (err) {
                reject(err);
                } else {
                resolve(results[0]);
                }
            });
            });

            if (existingCompetency) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency name already exists' });
            return;
            }
            const newId = await idGenerator('coreCompetencyName', 'coreCompetencyName_table')
            const coreCompetencyNameData = { ...reqBody, coreCompetencyNameId: newId}
            const query = 'INSERT INTO coreCompetencyName_table SET ?';
            db.query(query, coreCompetencyNameData, (err, response) => {
                if (err){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                    return 
                }
                res.status(StatusCodes.OK).json({ msg: 'Core Competency Name Data Created Successfully', data: coreCompetencyNameData })
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencyNames:async(req,res)=>{
        try{
            const query=`SELECT * FROM coreCompetencyName_table`
            db.query(query,async(getErr,getRes)=>{
                if (getErr){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:getErr});
                    return 
                }
                res.status(StatusCodes.OK).json({msg:'All Core Competency Names Data Retrieved Successfully',data:getRes})
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(`SELECT coreCompetencyNameId FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Name Data Not Found' });
                    return;
                }
                const query=`SELECT * FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`
                db.query(query,coreCompetencyNameId,async(getError,getResponse)=>{
                    if (getError){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:getError});
                        return 
                    }
                    res.status(StatusCodes.OK).json({msg:'Core Competency Name Data Retrieved Successfully',data:getResponse})
                    return
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    updateCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            const updatedData=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedData).length === 0;
            db.query(`SELECT coreCompetencyNameId FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Name Not Found' });
                    return;
                }
                if (isUpdatedBodyEmpty){
                    res.status(StatusCodes.OK).json({ msg: 'Core Competency Name Data Updated successfully', data: updatedData });
                    return
                }else{
                    // Check if the competencyName already exists
                    const existingCompetency = await new Promise((resolve, reject) => {
                        db.query('SELECT * FROM coreCompetencyName_table WHERE coreCompetencyName = ?', [updatedData.coreCompetencyName], (err, results) => {
                            if (err) {
                            reject(err);
                            } else {
                            resolve(results[0]);
                            }
                        });
                        });
            
                        if (existingCompetency) {
                        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency name already exists' });
                        return;
                        }
                    const query=`UPDATE coreCompetencyName_table SET ? WHERE coreCompetencyNameId=?`
                    db.query(query,[updatedData,coreCompetencyNameId],async(updateErr,updateRes)=>{
                        if (updateErr) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: updateErr });
                            return;
                        }

                        res.status(StatusCodes.OK).json({ msg: 'Core Competency Name Data Updated successfully', data: updatedData });
                        return
                    })
                }
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return 
        }
    },
    deleteCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(`SELECT coreCompetencyNameId FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Name Not Found' });
                    return;
                }
                const query=`DELETE FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`
                db.query(query,coreCompetencyNameId,async(deleteErr,deleteRes)=>{
                    if (deleteErr) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: deleteErr });
                        return;
                    }
                    res.status(StatusCodes.OK).json({msg:"Core Competency Name Data Deleted Successfully"})
                    return
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    createCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetenciesData=req.body
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Client Not Found' });
                    return;
                }
                if (!coreCompetenciesData || coreCompetenciesData.length === 0 || Object.keys(coreCompetenciesData).length===0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Request body must contain at least one core competencies entry.' });
                    return;
                }else{
                    let count = 0;
                    let errCount=0
                    for (let i = 0; i < coreCompetenciesData.length; i++) {
                        try {
                            const { coreCompetencyNameId, description, importance, defensibility, klocInput } = coreCompetenciesData[i];
                            const cRes = await new Promise((resolve, reject) => {
                                db.query(`SELECT * FROM corecompetencies_table WHERE coreCompetencyNameId=? AND userId=?`, [coreCompetencyNameId,userId], (cErr, cRes) => {
                                    if (cErr) {
                                        reject(cErr);
                                    } else {
                                        resolve(cRes);
                                    }
                                });
                            });
                            let newId;
                            if (cRes.length === 0) {
                                newId = await idGenerator('coreCompetencies', 'coreCompetencies_table');
                            } else {
                                newId = cRes[0].coreCompetenciesId;
                            }
                            const query = `
                                INSERT INTO coreCompetencies_table (coreCompetenciesId, userId, coreCompetencyNameId, description, importance, defensibility, klocInput)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE
                                    description = VALUES(description),
                                    importance = VALUES(importance),
                                    defensibility = VALUES(defensibility),
                                    klocInput = VALUES(klocInput);
                                `;
                            const values = [newId, userId, coreCompetencyNameId, description, importance, defensibility, klocInput];
                            const response = await new Promise((resolve, reject) => {
                            db.query(query, values, (err, response) => {
                                if (err) {
                                errCount += 1;
                                reject(err);
                                } else {
                                count += 1;
                                resolve(response);
                                }
                            });
                            });
                        } catch (error) {
                            console.error('Error in loop:', error);
                            errCount += 1;
                        }
                    }
                    if (count===coreCompetenciesData.length){
                        return res.status(StatusCodes.OK).json({ msg: 'Core Competencies Data Created Successfully', data: coreCompetenciesData });
                    }else{
                       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
                    }
                }   
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getAllCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            db.query(`SELECT userId FROM coreCompetencies_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Client Not Found' });
                    return;
                }
                const query = `
                    SELECT * 
                    FROM coreCompetencies_table
                    JOIN user_table ON user_table.userId=coreCompetencies_table.userId
                    JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
                    WHERE coreCompetencies_table.userId = ? 
                    ORDER BY coreCompetencies_table.coreCompetenciesId`;
                    db.query(query, [userId], async (err, compRes) => {
                        if (err){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err});
                            return 
                        }
                        let arr=[]
                        for (let i=0;i<compRes.length;i++){
                            const data={
                                coreCompetenciesId:compRes[i]?.coreCompetenciesId,
                                description:compRes[i]?.description,
                                importance:compRes[i]?.importance,
                                defensability:compRes[i]?.defensability,
                                klocInput:compRes[i]?.klocInput,
                                coreCompetencyName:{
                                    coreCompetencyNameId:compRes[i]?.coreCompetencyNameId,
                                    coreCompetencyName:compRes[i]?.coreCompetencyName,
                                    coreCompetencyDescription:compRes[i]?.coreCompetencyDescription
                                },
                                user:{
                                    userId:compRes[i]?.userId,
                                    userName:compRes[i]?.userName,
                                    userEmail:compRes[i]?.userEmail,
                                    userMobileNo:compRes[i]?.userMobileNo,
                                    userAltMobileNo:compRes[i]?.userAltMobileNo,
                                    userCompany:compRes[i]?.userCompany,
                                    userCountry:compRes[i]?.userCountry,
                                    userAddress:compRes[i]?.userAddress,
                                    userRole:compRes[i]?.userRole,
                                    userDesignation:compRes[i]?.userDesignation,
                                    userDepartment:compRes[i]?.userDepartment,
                                    userWebsiteUrl:compRes[i]?.userWebsiteUrl,
                                    userSocialMediaUrl:compRes[i]?.userSocialMediaUrl,
                                    userFinalCommit:compRes[i]?.userFinalCommit
                                }
                            }         
                            arr.push(data)
                        }
                        res.status(StatusCodes.OK).json({msg:'All Core Competencies Data Retrieved Successfully',data:arr})
                        return
                    })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(`SELECT userId FROM coreCompetencies_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Client Not Found' });
                    return;
                }
                db.query(`SELECT coreCompetencyNameId FROM coreCompetencies_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competencies Data Not Found'})
                        return;
                    }
                    const query = `
                    SELECT * 
                    FROM coreCompetencies_table
                    JOIN user_table ON user_table.userId=coreCompetencies_table.userId
                    JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
                    WHERE coreCompetencies_table.userId = ? 
                    AND coreCompetencies_table.coreCompetencyNameId = ?`
                    db.query(query,[userId,coreCompetencyNameId],async(finalErr,finalRes)=>{
                        if (finalErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                            return  
                        }
                        const data={
                            coreCompetenciesId:finalRes[0]?.coreCompetenciesId,
                            description:finalRes[0]?.description,
                            importance:finalRes[0]?.importance,
                            defensability:finalRes[0]?.defensability,
                            klocInput:finalRes[0]?.klocInput,
                            coreCompetencyName:{
                                coreCompetencyNameId:finalRes[0]?.coreCompetencyNameId,
                                coreCompetencyName:finalRes[0]?.coreCompetencyName,
                                coreCompetencyDescription:finalRes[0]?.coreCompetencyDescription
                            },
                            user:{
                                userId:finalRes[0]?.userId,
                                userName:finalRes[0]?.userName,
                                userEmail:finalRes[0]?.userEmail,
                                userMobileNo:finalRes[0]?.userMobileNo,
                                userAltMobileNo:finalRes[0]?.userAltMobileNo,
                                userCompany:finalRes[0]?.userCompany,
                                userCountry:finalRes[0]?.userCountry,
                                userAddress:finalRes[0]?.userAddress,
                                userRole:finalRes[0]?.userRole,
                                userDesignation:finalRes[0]?.userDesignation,
                                userDepartment:finalRes[0]?.userDepartment,
                                userWebsiteUrl:finalRes[0]?.userWebsiteUrl,
                                userSocialMediaUrl:finalRes[0]?.userSocialMediaUrl,
                                userFinalCommit:finalRes[0]?.userFinalCommit
                            }
                        }   
                        res.status(StatusCodes.OK).json({msg:'Core Competencies Data Retrieved Successfully',data:data})    
                        return
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    updateCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            const updatedBody=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedBody).length === 0;
            db.query(`SELECT userId FROM coreCompetencies_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Client Not Found' });
                    return;
                }
                db.query(`SELECT coreCompetencyNameId FROM coreCompetencies_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Name Not Found'})
                        return;
                    }
                    if (isUpdatedBodyEmpty){
                        res.status(StatusCodes.OK).json({msg:'Core Competencies Data Updated Successfully',data:updatedBody})
                        return 
                    }else{
                        const updateQuery=`UPDATE coreCompetencies_table SET ? WHERE userId=? AND coreCompetencyNameId=?`
                        db.query(updateQuery,[updatedBody,userId,coreCompetencyNameId],async(finalErr,finalRes)=>{
                            if (finalErr){
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr})
                                return
                            }
                            res.status(StatusCodes.OK).json({msg:'Core Competencies Data Updated Successfully',data:updatedBody})
                            return 
                        })
                    }
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    deleteCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(`SELECT userId FROM coreCompetencies_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Client Not Found' });
                    return;
                }
                db.query(`SELECT coreCompetencyNameId FROM coreCompetencies_table WHERE coreCompetencyNameId=?`,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Name Not Found'})
                        return;
                    }
                    const query=`DELETE FROM coreCompetencies_table WHERE userId=? AND coreCompetencyNameId=?`
                    db.query(query,[userId,coreCompetencyNameId],async(finalErr,finalRes)=>{
                        if (finalErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr})
                            return
                        }
                        res.status(StatusCodes.OK).json({msg:'Core Competencies Data Deleted Successfully'})
                        return 
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    }
}
module.exports=coreCompetencyController