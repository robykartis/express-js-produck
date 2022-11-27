import User from "../model/UserModel.js";

export const verifyUser = async (req, res, next) => {
  // Jika Tidak Ada User Login Maka
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon Login Ke Akun Anda" });
  }
  //   Jika ada maka
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  //   Jika Tidak Terdapat User Dengan Uuid yang sama didatabase maka
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });
  //   Jika ada
  req.userId = user.id;
  req.role = user.role;
  next();
};
export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  //   Jika Tidak Terdapat User Dengan Uuid yang sama didatabase maka
  if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" });
  if (user.role !== "admin")
    return res.status(403).json({ msg: "Akses Terlarang" });

  next();
};
