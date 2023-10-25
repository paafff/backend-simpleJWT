// const express = require('express');
const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;

  if (password !== confPassword)
    return res.status(400).json({ msg: 'password tidak sama' });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const findUser = await prisma.user.findUnique({ where: { email: email } });
    if (findUser) {
      return res.status(400).json({ msg: 'sorry, email already registered' });
    }

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    res.json({ msg: 'registrasi berhasil' });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        password: true,
      },
    });

    if (!findUser) return res.status(404).json({ msg: 'user tidak ditemukan' });

    const matchPassword = await bcrypt.compare(
      req.body.password,
      findUser.password
    );
    if (!matchPassword) return res.status(400).json({ msg: 'password sallah' });

    // data yang akan tersimpan pada token (decoded middleware)
    const userId = findUser.id;
    const name = findUser.name;
    const email = findUser.email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, findUser }).status(200);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
