const statsModel = require('../models/statsModel')

async function getDashboardStats(req, res) {
  try {
    const totalMembers = await statsModel.getTotalMembers()
    const expiringMembers = await statsModel.getExpiringMembersCount()
    const totalWorkshops = await statsModel.getTotalWorkshops()
    const totalApplications = await statsModel.getTotalApplications()
    const applicationsByWorkshop = await statsModel.getApplicationsByWorkshop()
    const applicationsBySourceChannel =
      await statsModel.getApplicationsBySourceChannel()

    res.status(200).json({
      totalMembers,
      expiringMembers,
      totalWorkshops,
      totalApplications,
      applicationsByWorkshop,
      applicationsBySourceChannel,
    })
  } catch (error) {
    console.error(
      'Greška pri dohvaćanju statistike za dashboard:',
      error.message
    )
    res
      .status(500)
      .json({ message: 'Interna serverska greška pri dohvaćanju statistike.' })
  }
}

module.exports = {
  getDashboardStats,
}
