const { getAwsStatus } = require('../config/aws');

const getAwsArchitectureStatus = async (req, res, next) => {
  try {
    const status = getAwsStatus();
    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAwsArchitectureStatus,
};
