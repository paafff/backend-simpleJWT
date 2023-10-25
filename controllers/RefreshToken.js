const prisma = require('../db');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  try {
    const cookiesRefreshToken = req.cookies.refreshToken;
    console.log(cookiesRefreshToken);
    if (!cookiesRefreshToken)
      return res.status(401).json({ msg: 'unautorize, please login' });

    const findUser = await prisma.user.findFirst({
      where: { refresh_token: cookiesRefreshToken },
    });

    if (!findUser) return res.status(403).json({ msg: 'User not found' });

    jwt.verify(
      cookiesRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) return res.status(403).json({ msg: 'Invalid token' });

        const userId = findUser.id;
        const name = findUser.name;
        const email = findUser.email;

        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '600s',
          }
        );

        res.json({ accessToken }).status(200);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = refreshToken;
