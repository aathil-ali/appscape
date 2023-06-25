const { default: axios } = require("axios");
const logger = require("./logger");

const { HUBSPOT_API_CONFIG } = require("./types");

/**
 * @description Axios request interceptor to handle the fullfilled state
 * @param {import('axios').InternalAxiosRequestConfig} config Axios config which is got while sending response
 * @returns {Promise<import('axios').InternalAxiosRequestConfig>}
 */
const axiosRequestInterceptorOnFullFilled = async (config) => {
    try {
        // Get origin of the url
        const origin = new URL(String(config.baseURL)).hostname;

        // add to db with origin and api request count

        return config;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description Axios response interceptor to handle the fullfilled state
 * @param {import('axios').AxiosResponse} response Axios response object which will be recieved on successful response
 * @returns {Promise<import('axios').AxiosResponse>}
 */
const axiosResponseInterceptorOnFullFilled = async (response) => {
    try {
        const { config } = response;

        // Get origin of the url
        const origin = new URL(String(config.baseURL)).hostname;

        // add to db with origin and api success count

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * @description Axios response interceptor to handle the error state
 * @param {*} error Axios error
 * @returns
 */
const axiosResponseInterceptorOnError = async (error) => {
    // get config and error message from the axios error response
    const { config } = error;

    // Get origin of the url
    const origin = new URL(config.baseURL).hostname;

    try {
        // if no config / not mentioned about retry, error out
        if (!config || !HUBSPOT_API_CONFIG.MAX_API_RETRIES) {
            // add to db with origin and api error count
            return Promise.reject(error);
        }

        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                logger.error('401 Unauthorized: Invalid authentication');
            } else if (status === 403) {
                logger.error('403 Forbidden: Insufficient permissions');
            } else if (status === 429) {
                logger.error('429 Too many requests: API rate limits exceeded');
            } else if (status === 477) {
                const retryAfter = error.response.headers['retry-after'];
                logger.error(`477 Migration in Progress: Retry after ${retryAfter} seconds`);
                const retryDelay = parseInt(retryAfter, 10) * 1000;
                return new Promise((resolve) => setTimeout(resolve, retryDelay))
                    .then(() => axios(config));
            } else if (status === 502 || status === 504 || status === 503 || status === 521 || status === 523 || status === 524) {
                logger.error(`${status} Error: Retry after a few seconds`);
                return new Promise((resolve) => setTimeout(resolve, 2000))
                    .then(() => axios(config));
            } else if (status === 522) {
                logger.error('522 Connection timed out: Please contact support');
            } else if (status === 525 || status === 526) {
                logger.error('525/526 SSL issues: Please contact support');
            } else {
                logger.error(`Error: ${status} - ${error.response.statusText}`);
            }

        }

        // decrement retry counter
        HUBSPOT_API_CONFIG.MAX_API_RETRIES -= 1;

        // delay the retry based on delay timer provided
        const delayRetryRequest = new Promise((resolve) => {
            setTimeout(() => {
                logger.info("Retrying the request...");
                logger.info(config);
                resolve(true);
            }, config.retryDelay || 1000);
        });

        // retry the request with same config
        return delayRetryRequest.then(() => axios(config));
    } catch (error) {
        logger.error("Error occurred in axios response interceptor", error);
        return Promise.reject(error);
    }
};

module.exports = {
    axiosRequestInterceptorOnFullFilled,
    axiosResponseInterceptorOnFullFilled,
    axiosResponseInterceptorOnError,
};
