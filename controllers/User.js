const prisma = require('../db');

const getUsers = async (req, res) => {
  try {
    const findUser = await prisma.user.findMany();

    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
  }
};

const getMe = async (req, res) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { email: req.email },
    });

    console.log('ini req.user ' + req.user);
    // console.log('ini req.user ' + decoded);

    res.status(200).json(findUser);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsers, getMe };
