const config = require("config");
const db = require("../models/index");

const moment = require("moment");
var uuid = require("uuid");

const logger = require("../utils/logger");
const hubspot = require("../utils/hubspot");
const ActivityLogger = require("../utils/activity-logger");

const AppUserConfig = db.AppUserConfig;
const User = db.User;
const AppUserOwner = db.AppUserOwner;



/** 
* @name:: oauthCallBack
* @category:: Controller method
* @description:: Installation of the App
*/
async function oauthCallBack(req, res) {
    try {
        if (req.query.code) {

            const hubspotHelper = new hubspot(null,null,null) ;
            
            const oAuth = await hubspotHelper.hubspotCreateOrRefreshAccessToken('authorization_code',req.query.code);

            
            const access_token = oAuth.access_token;
            const refresh_token = oAuth.refresh_token;


            const hubspotAxiosHelper =  new hubspot(access_token,null) ;


            const activityLogger = new ActivityLogger();

            activityLogger.log('123', 'User signed up');

            const userData = await hubspotAxiosHelper.hubspotApiAxios("get","","/oauth/v1/access-tokens/" + access_token) ;

            const ownerDataResponse =  await hubspotAxiosHelper.hubspotApiAxios("get","","/crm/v3/owners/") ;
            
            const ownerUser = ownerDataResponse["results"].find( async function (owner) {

               
                
                return owner.userId == userData.user_id;
            });

            ownerDataResponse["results"].forEach(async owner => {

                console.log(owner);

                await User.create({
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    email: owner.email,
                }); 
            });
                res.status(200).send({
                    code: 200,
                    data:ownerUser,
                    status: "succ",
                    data: null,
                });
            // }


        } else {
            res.status(404).send({
                code: 404,
                status: "failed",
                data: null,
            });

            return;
        }
    } catch (e) {


        res.status(500).send({
            code: 500,
            status: "failed",
            data: null,
        });

        return;
    }
}



module.exports = {
    oauthCallBack,
};




