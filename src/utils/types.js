// Script Modes
const SCRIPT_MODES = {
  ONE_TIME: "one_time",
  CRON_JOB: "cron_job",
};

// Priority types
const ERROR_PRIORITY = {
  P1: "p1",
  P2: "p2",
  P3: "p3",
};

const HUBSPOT_API_CONFIG = {
  MAX_API_RETRIES:5
}

const API_THROTTLE ={
  MAX_DURATION_IN_SECONDS:1,
  MAX_REQUESTS:10
}
module.exports = {
  SCRIPT_MODES,
  ERROR_PRIORITY,
  HUBSPOT_API_CONFIG,
  API_THROTTLE
};
