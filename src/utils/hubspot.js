const { default: axios } = require("axios");
const config = require("config");
const logger = require("./logger");

const {
  axiosRequestInterceptorOnFullFilled,
  axiosResponseInterceptorOnFullFilled,
  axiosResponseInterceptorOnError,
} = require("./axios-helpers");


class hubspot {

  /**
 * @name:: Constructor
 * @category:: Class
 * @description:: Initializes an instance with access credentials, user ID, and API endpoint.
 * @param:: accessToken - A token representing the access credentials for a user or application
 * @param:: userId - The ID of the user associated with the access token
 * @param:: endPoint - The endpoint URL or API endpoint for the class
 */
  constructor(accessToken, userId ) {

    this.accessToken = accessToken;
    this.userId = userId;
    this.hubspotAxios = this._createHubspotAxiosInstance();
    this.clientId = config.get("HUBSPOT.CLIENT_ID");
    this.clientSecret = config.get("HUBSPOT.CLIENT_SECRET");
    this.redirectUri = config.get("HUBSPOT.REDIRECT_URI");
    this.oAuthUri = config.get("HUBSPOT.OAUTH_API_ENDPOINT");
    this._init();

  }

  /** 
 * @name:: _createHubspotAxiosInstance
 * @category:: Helper function
 * @description:: Initializing axios instance
*/
  _createHubspotAxiosInstance() {

    const headers = {
      "Content-Type": this.accessToken ? "application/json" : "application/x-www-form-urlencoded",
    }; 
    
    if (this.accessToken) headers.Authorization = `Bearer ${this.accessToken}`;
  
    return axios.create({
      baseURL: config.get("HUBSPOT.BASE_URL"),
      headers: headers,
    });
  }

  /** 
   * @name:: _init
   * @category:: Helper function
   * @description::   Initialize the instance
  */
  _init() {

    this.hubspotAxios.interceptors.request.use(axiosRequestInterceptorOnFullFilled);
    // add response interceptor to retry on failure
    this.hubspotAxios.interceptors.response.use(
      axiosResponseInterceptorOnFullFilled,
      (error) => axiosResponseInterceptorOnError(error, this.userId)
    );

  }

 /**
 * @name:: hubspotApiAxios
 * @category::  Helper function
 * @description:: Makes an HTTP request to the HubSpot API using the specified method and body.
 * @param:: method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param:: body - The request body (payload) to be sent. Defaults to null.
 * @returns:: A Promise that resolves to the payload of the API response.
 */
  hubspotApiAxios = (method, body = null , endPoint) => {

    return new Promise(async (resolve, reject) => {
      try {

        const options = {
          method: method,
          data: body,
          url: endPoint,
        };

        const response = await this.hubspotAxios(options);
        const payload = response.data;

        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });

  }

  /**
 * @name:: hubspotCreateOrRefreshAccessToken
 * @category::  Helper function
 * @description:: Creates or refreshes an access token for HubSpot.
 * @param:: grantType - The grant type for token creation or refresh (e.g., 'authorization_code', 'refresh_code').
 * @param:: token - The token value to be used (e.g., authorization code or refresh token). Defaults to null.
 * @returns:: A Promise that resolves to the payload containing the access token.
 */
  hubspotCreateOrRefreshAccessToken = (grantType, token = null) => {

    return new Promise(async (resolve, reject) => {

      const formData = new URLSearchParams();

      if (grantType === 'authorization_code' && token) {
        formData.append('code', token);
      } else if (grantType == 'refresh_code' && token) {
        formData.append('refresh_token', token);
      } else {
        reject(new Error('Invalid grantType or token'));
        return;
      }

      formData.append('grant_type', grantType);
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      formData.append('redirect_uri', this.redirectUri);

      const options = {
        method: 'POST',
        data:formData,
        url: this.oAuthUri,
      };

      const response = await this.hubspotAxios(options);
      const payload = response.data;

      resolve(payload);
      try {
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = hubspot;
