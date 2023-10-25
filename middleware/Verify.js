const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Dapatkan token dari permintaan, misalnya dari header, cookie, atau query params
  const token = req.headers.authorization.split(' ')[1]; // Sesuaikan dengan cara Anda mengirim token
  // const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'token not found, please log in first' });
  }

  // Verifikasi token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ msg: 'token is invalid, please log in first' });
    }

    console.log(decoded);
    //data user tersimpan pada decoded
    // Jika token valid, simpan data pengguna yang terverifikasi di objek req.user
    req.user = decoded;
    req.email = decoded.email;
    next(); // Lanjutkan ke rute berikutnya
  });

  // fixxxxx
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  // if (token == null) return res.sendStatus(401).json({ msg: 'unauthorized' });
  // // Verifikasi token
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ msg: 'Token tidak valid' });
  //   }

  //   // Jika token valid, simpan data pengguna yang terverifikasi di objek req
  //   req.user = decoded;
  //   next(); // Lanjutkan ke rute berikutnya
  // });
};

module.exports = verifyToken;
