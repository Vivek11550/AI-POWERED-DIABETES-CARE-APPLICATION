
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find().sort({ createdAt: -1 })
      .populate("userId", "email role profileCompleted");

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientProfile.find().sort({ createdAt: -1 })
      .populate("userId", "email role profileCompleted");

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};