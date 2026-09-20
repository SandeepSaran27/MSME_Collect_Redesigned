const dashboardService = require('../services/dashboardService');

// @desc    Get dashboard summary stats and recent metrics
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const summaryData = await dashboardService.getSummary(req.user._id);
    return res.status(200).json({
      success: true,
      data: summaryData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
