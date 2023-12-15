const assert = require('assert')
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')

const competitiveAnalysisController={
    createCompetitiveAnalysis:async(req,res)=>{
        try{
            const userId=req.params.userId
            const competitionAnalysisData = req.body
            console.log(competitionAnalysisData)
            db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                if (!competitionAnalysisData || competitionAnalysisData.length === 0 || Object.keys(competitionAnalysisData).length===0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Request body must contain at least one core competency entry.' });
                    return;
                }else{
                    let errCount=0
                    let count = 0;
                    for (let i = 0; i < competitionAnalysisData.length; i++) {
                        try {
                            const { competitionName, companyProfile, keyCompetitiveAdvantage, targetMarket, marketingStrategy, productPricing, productsAndServices, strengths, weaknesses, opportunities, threats,klocInput } = competitionAnalysisData[i];
                            const cRes = await new Promise((resolve, reject) => {
                                db.query(`SELECT * FROM competitionanalysis_table WHERE competitionName=? AND userId=?`, [competitionName,userId], (cErr, cRes) => {
                                    if (cErr) {
                                        reject(cErr);
                                    } else {
                                        resolve(cRes);
                                    }
                                });
                            });
                            let newId;
                            if (cRes.length === 0) {
                                newId = await idGenerator('competitionAnalysis', 'competitionanalysis_table');
                            } else {
                                newId = cRes[0].competitionAnalysisId;
                            }
                            const query = `
                            INSERT INTO competitionanalysis_table 
                            (competitionAnalysisId, userId, competitionName, companyProfile, keyCompetitiveAdvantage, targetMarket, marketingStrategy, productPricing, productsAndServices, strengths, weaknesses, opportunities, threats,klocInput)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
                            ON DUPLICATE KEY UPDATE
                              companyProfile = VALUES(companyProfile),
                              keyCompetitiveAdvantage = VALUES(keyCompetitiveAdvantage),
                              targetMarket = VALUES(targetMarket),
                              marketingStrategy = VALUES(marketingStrategy),
                              productPricing = VALUES(productPricing),
                              productsAndServices = VALUES(productsAndServices),
                              strengths = VALUES(strengths),
                              weaknesses = VALUES(weaknesses),
                              opportunities = VALUES(opportunities),
                              threats = VALUES(threats),
                              klocInput=VALUES(klocInput)`;
                            const values = [newId, userId, competitionName, companyProfile, keyCompetitiveAdvantage, targetMarket, marketingStrategy, productPricing, productsAndServices, strengths, weaknesses, opportunities, threats,klocInput];
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
                    if (count===competitionAnalysisData.length){
                        return res.status(StatusCodes.OK).json({ msg: 'Competitive Analysis Data Created Successfully', data: competitionAnalysisData });
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
    getAllCompetitiveAnalysis:async(req,res)=>{
        try{
            const userId = req.params.userId
            db.query(`SELECT userId FROM competitionanalysis_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                    const query=`SELECT * 
                    FROM competitionanalysis_table
                    JOIN user_table ON user_table.userId=competitionanalysis_table.userId
                    WHERE competitionanalysis_table.userId = ? 
                    ORDER BY competitionanalysis_table.competitionAnalysisId`
                    db.query(query, [userId],async(err,compRes)=>{
                        if (err){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                            return 
                        }
                        let arr=[]
                        for (let i=0;i<compRes.length;i++){
                            const data={
                                competitionAnalysisId:compRes[i]?.competitionAnalysisId,
                                competitionName:compRes[i]?.competitionName,
                                companyProfile:compRes[i]?.companyProfile,
                                keyCompetitiveAdvantage:compRes[i]?.keyCompetitiveAdvantage,
                                targetMarket:compRes[i]?.targetMarket,
                                marketingStrategy:compRes[i]?.marketingStrategy,
                                productPricing:compRes[i]?.productPricing,
                                productsAndServices:compRes[i]?.productsAndServices,
                                strengths:compRes[i]?.strengths,
                                weaknesses:compRes[i]?.weaknesses,
                                opportunities:compRes[i]?.opportunities,
                                threats:compRes[i]?.threats,
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
                        res.status(StatusCodes.OK).json({msg:'All Competitive Analysis Data Retrieved Succesfully',data:arr})
                        return
                    })
                })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        } 
    },
    getCompetitiveAnalysis:async(req,res)=>{
        try{
            const userId = req.params.userId;
            const competitionAnalysisId = req.params.competitionAnalysisId;
            db.query(`SELECT userId FROM competitionanalysis_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT competitionAnalysisId FROM competitionanalysis_table WHERE userid=? AND competitionAnalysisId=?`,[userId,competitionAnalysisId],async(compErr,compResp)=>{
                    if (compErr) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
    
                    if (compResp.length === 0) {
                        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Competitive Analysis Not Found' });
                        return;
                    }
                    const query = `
                        SELECT * 
                        FROM competitionanalysis_table
                        JOIN user_table ON user_table.userId=competitionanalysis_table.userId
                        WHERE competitionanalysis_table.userId = ? 
                        AND competitionanalysis_table.competitionAnalysisId = ?`;
                    db.query(query, [userId, competitionAnalysisId], async (err, compRes) => {
                        if (err){
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:finalErr});
                            return 
                        }
                        const data={
                            competitionAnalysisId:compRes[0]?.competitionAnalysisId,
                            competitionName:compRes[0]?.competitionName,
                            companyProfile:compRes[0]?.companyProfile,
                            keyCompetitiveAdvantage:compRes[0]?.keyCompetitiveAdvantage,
                            targetMarket:compRes[0]?.targetMarket,
                            marketingStrategy:compRes[0]?.marketingStrategy,
                            productPricing:compRes[0]?.productPricing,
                            productsAndServices:compRes[0]?.productsAndServices,
                            strengths:compRes[0]?.strengths,
                            weaknesses:compRes[0]?.weaknesses,
                            opportunities:compRes[0]?.opportunities,
                            threats:compRes[0]?.threats,
                            user:{
                                userId:compRes[0]?.userId,
                                userName:compRes[0]?.userName,
                                userEmail:compRes[0]?.userEmail,
                                userMobileNo:compRes[0]?.userMobileNo,
                                userAltMobileNo:compRes[0]?.userAltMobileNo,
                                userRole:compRes[0]?.userRole,
                                userCompany:compRes[0]?.userCompany,
                                userCountry:compRes[0]?.userCountry,
                                userAddress:compRes[0]?.userAddress,
                                userDesignation:compRes[0]?.userDesignation,
                                userDepartment:compRes[0]?.userDepartment,
                                userWebsiteUrl:compRes[0]?.userWebsiteUrl,
                                userSocialMediaUrl:compRes[0]?.userSocialMediaUrl,
                                userFinalCommit:compRes[0]?.userFinalCommit
                            }
                        } 
                        res.status(StatusCodes.OK).json({msg:'Competitive Analysis Data Retrieved Successfully',data:data})
                        return
                    })
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return 
        }
    },
    updateCompetitiveAnalysis:async(req,res)=>{
        try{
            const userId = req.params.userId;
            const competitionAnalysisId = req.params.competitionAnalysisId;
            const updatedBody=req.body
            const isUpdatedBodyEmpty=Object.keys(updatedBody).length === 0;
            db.query(`SELECT userId FROM competitionanalysis_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT competitionAnalysisId FROM competitionanalysis_table WHERE userid=? AND competitionAnalysisId=?`,[userId,competitionAnalysisId],async(compErr,compResp)=>{
                    if (compErr) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
    
                    if (compResp.length === 0) {
                        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Competitive Analysis Not Found' });
                        return;
                    }
                    if (isUpdatedBodyEmpty){
                        res.status(StatusCodes.OK).json({ msg: 'Competitive Analysis data updated successfully', data: updatedBody });
                        return
                    }else{
                        // Both user and competition analysis record exist, proceed with the update
                        const updateQuery = 'UPDATE competitionanalysis_table SET ? WHERE userId=? AND competitionAnalysisId=?';
                        db.query(updateQuery, [updatedBody, userId, competitionAnalysisId], async (updateErr, updateCompRes) => {
                            if (updateErr) {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: updateErr });
                                return;
                            }

                            res.status(StatusCodes.OK).json({ msg: 'Competitive Analysis data updated successfully', data: updatedBody });
                            return
                        });
                    }
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    },
    deleteCompetitiveAnalysis:async(req,res)=>{
        try{
            const userId = req.params.userId;
            const competitionAnalysisId = req.params.competitionAnalysisId;
            db.query(`SELECT userId FROM competitionanalysis_table WHERE userId=?`,userId,async(userErr,userResp)=>{
                if (userErr) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                    return;
                }
                if (userResp.length === 0) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
                    return;
                }
                db.query(`SELECT competitionAnalysisId FROM competitionanalysis_table WHERE userid=? AND competitionAnalysisId=?`,[userId,competitionAnalysisId],async(compErr,compResp)=>{
                    if (compErr) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                        return;
                    }
    
                    if (compResp.length === 0) {
                        res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Competitive Analysis Not Found' });
                        return;
                    }

                    // Both user and competition analysis record exist, proceed with the update
                    const deleteQuery = 'DELETE FROM competitionanalysis_table WHERE userId=? AND competitionAnalysisId=?';
                    db.query(deleteQuery, [userId, competitionAnalysisId], async (deleteErr, deleteCompRes) => {
                        if (deleteErr) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: deleteErr });
                            return;
                        }

                        res.status(StatusCodes.OK).json({ msg: 'Competitive Analysis Data Deleted Successfully'})
                        return
                    });
                })
            })
        }catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"Internal Server Error"})
            return
        }
    }
}
module.exports=competitiveAnalysisController