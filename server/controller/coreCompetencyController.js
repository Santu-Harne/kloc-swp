const assert = require('assert')
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')
const {selectAllFromCoreCompetencyName,insertDataIntoCoreCompetencyName,selectAllDataFromCoreCompetencyName,selectCoreCompetencyNameIdFromCoreCompetencyName,
    selectOneDataFromCoreCompetencyName,updateCoreCompetencyNameData,deleteCoreCompetencyNameData,selectUserIdFromUser,selectAllFromCoreCompetenciesTable,
    insertDataIntoCoreCompetenciesTable,selectAllCoreCompetenciesData,selectOneCoreCompetenciesData,updateCoreCompetenciesData,deleteCoreCompetenciesData,selectCoreCompetencyNameIdFromCoreCompetenciesTable}=require('../utils/coreCompetencyQueries')
const {requiredFieldsMissingMsg,coreCompetencyNameAlreadyExistsMsg,internalServerErrorMsg,userNotFoundMsg,coreCompetencyNameCreatedSuccessfullyMsg,
    AllCoreCompetencyNamesRetrievedSuccessfullyMsg,coreCompetencyNameNotFoundMsg,coreCompetencyNameRetrievedSuccessfullyMsg,coreCompetencyNameUpdatedSuccessfullyMsg,coreCompetencyNameDeletedSuccessfullyMsg,
    requestBodyMsg,coreCompetenciesDataCreatedSuccessfullyMsg,allCoreCompetenciesDataRetrievedSuccessfullyMsg,coreCompetenciesDataNotFoundMsg,coreCompetenciesDataRetrievedSuccessfullyMsg,
    coreCompetenciesDataUpdatedSuccessfullyMsg,coreCompetenciesDataDeletedSuccessfullyMsg}=require('../utils/coreCompetencyMessages')

const coreCompetencyController={
    createCoreCompentencyName:async(req,res)=>{
        try{
            const reqBody = req.body
            if (!reqBody || !reqBody.hasOwnProperty('coreCompetencyName') || reqBody['coreCompetencyName'].trim()===''){
                res.status(StatusCodes.BAD_REQUEST).json({ msg: requiredFieldsMissingMsg });
                return;
            }
            // Check if the competencyName already exists
            const existingCompetency = await new Promise((resolve, reject) => {
            db.query(selectAllFromCoreCompetencyName, [reqBody.coreCompetencyName], (err, results) => {
                if (err) {
                reject(err);
                } else {
                resolve(results[0]);
                }
            });
            });

            if (existingCompetency) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: coreCompetencyNameAlreadyExistsMsg });
            return;
            }
            const newId = await idGenerator('coreCompetencyName', 'coreCompetencyName_table')
            const coreCompetencyNameData = { ...reqBody, coreCompetencyNameId: newId}
            const query = insertDataIntoCoreCompetencyName
            db.query(query, coreCompetencyNameData, (err, response) => {
                if (err){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                    return 
                }
                res.status(StatusCodes.OK).json({ msg: coreCompetencyNameCreatedSuccessfullyMsg, data: coreCompetencyNameData })
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    getCoreCompetencyNames:async(req,res)=>{
        try{
            const query=selectAllDataFromCoreCompetencyName
            db.query(query,async(getErr,getRes)=>{
                if (getErr){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg});
                    return 
                }
                res.status(StatusCodes.OK).json({msg:AllCoreCompetencyNamesRetrievedSuccessfullyMsg,data:getRes})
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    getCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(selectCoreCompetencyNameIdFromCoreCompetencyName,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: coreCompetencyNameNotFoundMsg});
                    return;
                }
                const query=selectOneDataFromCoreCompetencyName
                db.query(query,coreCompetencyNameId,async(getError,getResponse)=>{
                    if (getError){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg});
                        return 
                    }
                    res.status(StatusCodes.OK).json({msg:coreCompetencyNameRetrievedSuccessfullyMsg,data:getResponse})
                    return
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    updateCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            const updatedData=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedData).length === 0;
            db.query(selectCoreCompetencyNameIdFromCoreCompetencyName,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: coreCompetencyNameNotFoundMsg });
                    return;
                }
                if (isUpdatedBodyEmpty){
                    res.status(StatusCodes.OK).json({ msg: coreCompetencyNameUpdatedSuccessfullyMsg, data: updatedData });
                    return
                }else{
                    // Check if the competencyName already exists
                    const existingCompetency = await new Promise((resolve, reject) => {
                        db.query(selectAllFromCoreCompetencyName, [updatedData.coreCompetencyName], (err, results) => {
                            if (err) {
                            reject(err);
                            } else {
                            resolve(results[0]);
                            }
                        });
                        });
            
                        if (existingCompetency) {
                        res.status(StatusCodes.BAD_REQUEST).json({ msg: coreCompetencyNameAlreadyExistsMsg});
                        return;
                        }
                    const query=updateCoreCompetencyNameData
                    db.query(query,[updatedData,coreCompetencyNameId],async(updateErr,updateRes)=>{
                        if (updateErr) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: updateErr });
                            return;
                        }

                        res.status(StatusCodes.OK).json({ msg: coreCompetencyNameUpdatedSuccessfullyMsg, data: updatedData });
                        return
                    })
                }
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return 
        }
    },
    deleteCoreCompetencyName:async(req,res)=>{
        try{
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(selectCoreCompetencyNameIdFromCoreCompetencyName,coreCompetencyNameId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: coreCompetencyNameNotFoundMsg });
                    return;
                }
                const query=deleteCoreCompetencyNameData
                db.query(query,coreCompetencyNameId,async(deleteErr,deleteRes)=>{
                    if (deleteErr) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: deleteErr });
                        return;
                    }
                    res.status(StatusCodes.OK).json({msg:coreCompetencyNameDeletedSuccessfullyMsg})
                    return
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    createCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetenciesData=req.body
            db.query(selectUserIdFromUser,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: userNotFoundMsg });
                    return;
                }
                // if (!coreCompetenciesData || coreCompetenciesData.length === 0 || Object.keys(coreCompetenciesData).length===0) {
                //     res.status(StatusCodes.BAD_REQUEST).json({ msg: requestBodyMsg });
                //     return;
                // }else{
                if (coreCompetenciesData.length>0){
                    let count = 0;
                    let errCount=0
                    for (let i = 0; i < coreCompetenciesData.length; i++) {
                        try {
                            const { coreCompetencyNameId, description, importance, defensability, klocInput } = coreCompetenciesData[i];
                            const cRes = await new Promise((resolve, reject) => {
                                db.query(selectAllFromCoreCompetenciesTable, [coreCompetencyNameId,userId], (cErr, cRes) => {
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
                            const query =insertDataIntoCoreCompetenciesTable
                            const values = [newId, userId, coreCompetencyNameId, description, importance, defensability, klocInput];
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
                        return res.status(StatusCodes.OK).json({ msg: coreCompetenciesDataCreatedSuccessfullyMsg, data: coreCompetenciesData });
                    }else{
                       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    }
                }
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    getAllCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            db.query(selectUserIdFromUser,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: userNotFoundMsg });
                    return;
                }
                const query = selectAllCoreCompetenciesData
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
                        res.status(StatusCodes.OK).json({msg:allCoreCompetenciesDataRetrievedSuccessfullyMsg,data:arr})
                        return
                    })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    getCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(selectUserIdFromUser,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: userNotFoundMsg});
                    return;
                }
                db.query(selectCoreCompetencyNameIdFromCoreCompetenciesTable,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg});
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:coreCompetenciesDataNotFoundMsg})
                        return;
                    }
                    const query =selectOneCoreCompetenciesData
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
                        res.status(StatusCodes.OK).json({msg:coreCompetenciesDataRetrievedSuccessfullyMsg,data:data})    
                        return
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    updateCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            const updatedBody=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedBody).length === 0;
            db.query(selectUserIdFromUser,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: userNotFoundMsg });
                    return;
                }
                db.query(selectCoreCompetencyNameIdFromCoreCompetenciesTable,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:coreCompetencyNameNotFoundMsg})
                        return;
                    }
                    if (isUpdatedBodyEmpty){
                        res.status(StatusCodes.OK).json({msg:coreCompetenciesDataUpdatedSuccessfullyMsg,data:updatedBody})
                        return 
                    }else{
                        const updateQuery=updateCoreCompetenciesData
                        db.query(updateQuery,[updatedBody,userId,coreCompetencyNameId],async(finalErr,finalRes)=>{
                            if (finalErr){
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr})
                                return
                            }
                            res.status(StatusCodes.OK).json({msg:coreCompetenciesDataUpdatedSuccessfullyMsg,data:updatedBody})
                            return 
                        })
                    }
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    },
    deleteCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const coreCompetencyNameId=req.params.coreCompetencyNameId
            db.query(selectUserIdFromUser,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: userNotFoundMsg });
                    return;
                }
                db.query(selectCoreCompetencyNameIdFromCoreCompetenciesTable,coreCompetencyNameId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: internalServerErrorMsg });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:coreCompetencyNameNotFoundMsg})
                        return;
                    }
                    const query=deleteCoreCompetenciesData
                    db.query(query,[userId,coreCompetencyNameId],async(finalErr,finalRes)=>{
                        if (finalErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr})
                            return
                        }
                        res.status(StatusCodes.OK).json({msg:coreCompetenciesDataDeletedSuccessfullyMsg})
                        return 
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:internalServerErrorMsg})
            return
        }
    }
}
module.exports=coreCompetencyController