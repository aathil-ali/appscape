const moment = require("moment");
const uuid = require("uuid");
const logger = require("../utils/logger");
const hubspot = require("../utils/hubspot");
const ActivityLogger = require("../utils/activity-logger");

class OAuthController {
  constructor() {
    this.hubspotHelper = new hubspot(null, null, null);
    this.hubspotAxiosHelper = null;
  }

  /**
   * Handle OAuth callback                                                              
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @description:: Installation of the App
   */
  
  async oauthCallBack(req, res) {
    try {
      if (req.query.code) {
        const oAuth = await this.hubspotHelper.hubspotCreateOrRefreshAccessToken(
          "authorization_code",
          req.query.code
        );

        const access_token = oAuth.access_token;
        const refresh_token = oAuth.refresh_token;

        this.hubspotAxiosHelper = new hubspot(access_token, null);

        // Log user signup activity
        await this.logUserSignup();

        const userData = await this.hubspotAxiosHelper.hubspotApiAxios(
          "get",
          "",
          "/oauth/v1/access-tokens/" + access_token
        );

        const ownerDataResponse = await this.hubspotAxiosHelper.hubspotApiAxios(
          "get",
          "",
          "/crm/v3/owners/"
        );

        const ownerUser = ownerDataResponse.results.find(
          (owner) => owner.userId == userData.user_id
        );

        // Create users from owner data
        await this.createUsers(ownerDataResponse.results);

        res.status(200).send({
          code: 200,
          data: ownerUser,
          status: "succ",
          data: null,
        });
      } else {
        res.status(404).send({
          code: 404,
          status: "failed",
          data: null,
        });
      }
    } catch (e) {
      res.status(500).send({
        code: 500,
        status: "failed",
        data: null,
      });
    }
  }

  /**
   * Log user signup activity
   */
  async logUserSignup() {
    const activityLogger = new ActivityLogger();
    activityLogger.log("123", "User signed up");
  }

  /**
   * Create users from owner data
   * @param {Array} ownerData - Array of owner data
   */
  async createUsers(ownerData) {
    for (const owner of ownerData) {
      await User.create({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
      });
    }
  }
}

module.exports = new OAuthController();
