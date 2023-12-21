const assert = require('assert')
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')

const coreCompetencyController={
    createCoreCompentencyName:async(req,res)=>{
        try{
            const reqBody = req.body
            if (!reqBody || !reqBody.hasOwnProperty('competencyName') || reqBody['competencyName'].trim()===''){
                res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Required Fields Are Missing' });
                return;
            }
            const newId = await idGenerator('corecompetency', 'corecompetencyname_table')
            const coreCompetencyNameData = { ...reqBody, corecompetencyId: newId}
            const query = 'INSERT INTO corecompetencyname_table SET ?';
            db.query(query, coreCompetencyNameData, (err, response) => {
                if (err){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                    return 
                }
                res.status(StatusCodes.OK).json({ msg: 'Core Competency Data Created Successfully', data: coreCompetencyNameData })
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencyNames:async(req,res)=>{
        try{
            const query=`SELECT * FROM corecompetencyname_table`
            db.query(query,async(getErr,getRes)=>{
                if (getErr){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:getErr});
                    return 
                }
                res.status(StatusCodes.OK).json({msg:'All Core Competencies Names Data Retrieved Successfully',data:getRes})
                return
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencyName:async(req,res)=>{
        try{
            const corecompetencyId=req.params.corecompetencyId
            db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Not Found' });
                    return;
                }
                const query=`SELECT * FROM corecompetencyname_table WHERE coreCompetencyId=?`
                db.query(query,corecompetencyId,async(getError,getResponse)=>{
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
    updateCoreCompetency:async(req,res)=>{
        try{
            const corecompetencyId=req.params.corecompetencyId
            const updatedData=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedData).length === 0;
            db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Not Found' });
                    return;
                }
                if (isUpdatedBodyEmpty){
                    res.status(StatusCodes.OK).json({ msg: 'Core Competency Name Data Updated successfully', data: updatedData });
                    return
                }else{
                    const query=`UPDATE corecompetencyname_table SET ? WHERE corecompetencyId=?`
                    db.query(query,[updatedData,corecompetencyId],async(updateErr,updateRes)=>{
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
            const corecompetencyId=req.params.corecompetencyId
            db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(compErr,compResp)=>{
                if (compErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }

                if (compResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Core Competency Not Found' });
                    return;
                }
                const query=`DELETE FROM corecompetencyname_table WHERE corecompetencyId=?`
                db.query(query,corecompetencyId,async(deleteErr,deleteRes)=>{
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
            const corecompetencyId=req.params.corecompetencyId
            const createData=req.body
            const newId = await idGenerator('competency', 'corecompetencies_table')
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Not Found'})
                        return;
                    }
                    const coreCompetenciesData = { ...createData, userId:userId,corecompetencyId:corecompetencyId,competencyId: newId}
                    console.log(coreCompetenciesData)
                    const query = 'INSERT INTO corecompetencies_table SET ?';
                    db.query(query, coreCompetenciesData, (err, response) => {
                        if (err){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err});
                            return 
                        }
                        res.status(StatusCodes.OK).json({ msg: 'Core Competencies Data Created Successfully', data: coreCompetenciesData })
                        return
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getAllCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const corecompetencyId=req.params.corecompetencyId
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Not Found'})
                        return
                    }
                    const query = `
                        SELECT * 
                        FROM corecompetencies_table
                        JOIN user_table ON user_table.userId=corecompetencies_table.userId
                        JOIN corecompetencyname_table ON corecompetencyname_table.corecompetencyId=corecompetencies_table.corecompetencyId
                        WHERE corecompetencies_table.userId = ? 
                        AND corecompetencies_table.corecompetencyId = ?
                        ORDER BY corecompetencies_table.competencyId`;
                        db.query(query, [userId, corecompetencyId], async (err, compRes) => {
                            if (err){
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err});
                                return 
                            }
                            let arr=[]
                            for (let i=0;i<compRes.length;i++){
                                const data={
                                    competencyId:compRes[i]?.competencyId,
                                    description:compRes[i]?.description,
                                    importance:compRes[i]?.importance,
                                    defensability:compRes[i]?.defensability,
                                    klocInput:compRes[i]?.klocInput,
                                    coreCompetencyName:{
                                        corecompetencyId:compRes[i]?.corecompetencyId,
                                        competencyName:compRes[i]?.competencyName,
                                        competencyDescription:compRes[i]?.competencyDescription
                                    },
                                    user:{
                                        userId:compRes[i]?.userId,
                                        userName:compRes[i]?.userName,
                                        userEmail:compRes[i]?.userEmail,
                                        userMobileNo:compRes[i]?.userMobileNo,
                                        userAltMobileNo:compRes[i]?.userAltMobileNo,
                                        userRole:compRes[i]?.userRole,
                                        userCompany:compRes[i]?.userCompany,
                                        userCountry:compRes[i]?.userCountry,
                                        userAddress:compRes[i]?.userAddress,
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
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    getCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const corecompetencyId=req.params.corecompetencyId
            const competencyId=req.params.competencyId
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Not Found'})
                        return;
                    }
                    db.query(`SELECT competencyId FROM corecompetencies_table WHERE userId=? AND corecompetencyId=? AND competencyId=?`,[userId,corecompetencyId,competencyId],async(compErr,compRes)=>{
                        if (compErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                            return;
                        }
                        if (compRes.length===0){
                            res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competencies Not Found'})
                            return;
                        }
                        const query = `
                        SELECT * 
                        FROM corecompetencies_table
                        JOIN user_table ON user_table.userId=corecompetencies_table.userId
                        JOIN corecompetencyname_table ON corecompetencyname_table.corecompetencyId=corecompetencies_table.corecompetencyId
                        WHERE corecompetencies_table.userId = ? 
                        AND corecompetencies_table.corecompetencyId = ?
                        AND corecompetencies_table.competencyId=?`;
                        db.query(query,[userId,corecompetencyId,competencyId],async(finalErr,finalRes)=>{
                            if (finalErr){
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                                return  
                            }
                            const data={
                                competencyId:finalRes[0]?.competencyId,
                                description:finalRes[0]?.description,
                                importance:finalRes[0]?.importance,
                                defensability:finalRes[0]?.defensability,
                                klocInput:finalRes[0]?.klocInput,
                                coreCompetencyName:{
                                    corecompetencyId:finalRes[0]?.corecompetencyId,
                                    competencyName:finalRes[0]?.competencyName,
                                    competencyDescription:finalRes[0]?.competencyDescription
                                },
                                user:{
                                    userId:finalRes[0]?.userId,
                                    userName:finalRes[0]?.userName,
                                    userEmail:finalRes[0]?.userEmail,
                                    userMobileNo:finalRes[0]?.userMobileNo,
                                    userAltMobileNo:finalRes[0]?.userAltMobileNo,
                                    userRole:finalRes[0]?.userRole,
                                    userCompany:finalRes[0]?.userCompany,
                                    userCountry:finalRes[0]?.userCountry,
                                    userAddress:finalRes[0]?.userAddress,
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
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    updateCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const corecompetencyId=req.params.corecompetencyId
            const competencyId=req.params.competencyId
            const updatedBody=req.body
            const isUpdatedBodyEmpty = Object.keys(updatedBody).length === 0;
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Not Found'})
                        return;
                    }
                    db.query(`SELECT competencyId FROM corecompetencies_table WHERE userId=? AND corecompetencyId=? AND competencyId=?`,[userId,corecompetencyId,competencyId],async(compErr,compRes)=>{
                        if (compErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                            return;
                        }
                        if (compRes.length===0){
                            res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competencies Not Found'})
                            return;
                        }
                        if (isUpdatedBodyEmpty){
                            res.status(StatusCodes.OK).json({msg:'Core Competencies Data Updated Successfully',data:updatedBody})
                            return 
                        }else{
                            const updateQuery=`UPDATE corecompetencies_table SET ? WHERE userId=? AND corecompetencyId=? AND competencyId=?`
                            db.query(updateQuery,[updatedBody,userId,corecompetencyId,competencyId],async(finalErr,finalRes)=>{
                                console.log(finalErr)
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
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    deleteCoreCompetencies:async(req,res)=>{
        try{
            const userId=req.params.userId
            const corecompetencyId=req.params.corecompetencyId
            const competencyId=req.params.competencyId
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT corecompetencyId FROM corecompetencyname_table WHERE corecompetencyId=?`,corecompetencyId,async(coreErr,coreRes)=>{
                    if (coreErr){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
                    if (coreRes.length===0){
                        res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competency Not Found'})
                        return;
                    }
                    db.query(`SELECT competencyId FROM corecompetencies_table WHERE userId=? AND corecompetencyId=? AND competencyId=?`,[userId,corecompetencyId,competencyId],async(compErr,compRes)=>{
                        if (compErr){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                            return;
                        }
                        if (compRes.length===0){
                            res.status(StatusCodes.BAD_REQUEST).json({msg:'Core Competencies Not Found'})
                            return;
                        }
                        const query=`DELETE FROM corecompetencies_table WHERE userId=? AND corecompetencyId=? AND competencyId=?`
                        db.query(query,[userId,corecompetencyId,competencyId],async(finalErr,finalRes)=>{
                            if (finalErr){
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr})
                                return
                            }
                            res.status(StatusCodes.OK).json({msg:'Core Competencies Data Deleted Successfully'})
                            return 
                        })
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