import OverallStat from "../models/OverallStat.js";
import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    const overallStat = await OverallStat.find({ year: currentYear });
    const {
      yearlyTotalSoldUnits,
      monthlyData,
    } = overallStat[0];
    const thisMonthStats = overallStat[0].monthlyData.find(
      ({ month }) => month === currentMonth
    );
    const todayStats = overallStat[0].dailyData.find(
      ({ date }) => date === currentDay
    );

    res.status(200).json({
      yearlyTotalSoldUnits,
      monthlyData,
      thisMonthStats,
      todayStats,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
