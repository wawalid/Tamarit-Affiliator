// Importaciones
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

const cookieOptions = {
  httpOnly: process.env.NODE_ENV === "production",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  console.log("token en el backend", token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "User not found" });

    return res.json({
      id: userFound._id,
      fullname: userFound.fullname,
      email: userFound.email,
      id_afiliado: userFound.id_afiliado,
      is_verified: userFound.is_verified,
      dni: userFound.dni,
      cuenta_bancaria: userFound.cuenta_bancaria,
      identidad: userFound.identidad,
      completado: userFound.completado,
      is_admin: userFound.is_admin,
      rrss_1: userFound.rrss_1,
      rrss_2: userFound.rrss_2,
      rrss_3: userFound.rrss_3,
      createdAt: userFound.createdAt,
    });
  });
};

export const register = async (req, res) => {
  const { email, password, fullname, rrss_1, rrss_2, rrss_3 } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: passwordHash,
      rrss_1,
      rrss_2,
      rrss_3,
    });
    const userSaved = await newUser.save();

    const id_afiliado = `${fullname.charAt(0).toUpperCase()}${userSaved._id
      .toString()
      .slice(-7)}`;
    userSaved.id_afiliado = id_afiliado;
    await userSaved.save();

    const token = await createAccessToken({
      id: userSaved._id,
      is_admin: userSaved.is_admin,
    });
    res.cookie("token", token, cookieOptions);

    res.json({
      id: userSaved._id,
      fullname: userSaved.fullname,
      email: userSaved.email,
      id_afiliado: userSaved.id_afiliado,
      completado: userSaved.completado,
      is_verified: userSaved.is_verified,
      rrss_1: userSaved.rrss_1,
      rrss_2: userSaved.rrss_2,
      rrss_3: userSaved.rrss_3,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["User not found"]);

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Invalid password"]);

    const token = await createAccessToken({
      id: userFound._id,
      is_admin: userFound.is_admin,
    });
    res.cookie("token", token, cookieOptions);

    res.json({
      id: userFound._id,
      fullname: userFound.fullname,
      email: userFound.email,
      id_afiliado: userFound.id_afiliado,
      dni: userFound.dni,
      cuenta_bancaria: userFound.cuenta_bancaria,
      identidad: userFound.identidad,
      completado: userFound.completado,
      is_verified: userFound.is_verified,
      is_admin: userFound.is_admin,
      rrss_1: userFound.rrss_1,
      rrss_2: userFound.rrss_2,
      rrss_3: userFound.rrss_3,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    fullname: userFound.fullname,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

export const updateUser = async (req, res) => {
  const { fullname, email, password, dni, cuenta_bancaria, identidad, rrss_1, rrss_2, rrss_3 } =
    req.body;
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });

  if (fullname) userFound.fullname = fullname;
  if (email) userFound.email = email;
  if (password) userFound.password = await bcrypt.hash(password, 10);
  if (rrss_1) userFound.rrss_1 = rrss_1;
  if (rrss_2) userFound.rrss_2 = rrss_2;
  if (rrss_3) userFound.rrss_3 = rrss_3;
  if (dni !== undefined) userFound.dni = dni;
  if (cuenta_bancaria !== undefined)
    userFound.cuenta_bancaria = cuenta_bancaria;
  if (identidad !== undefined) userFound.identidad = identidad;

  userFound.completado = Boolean(
    userFound.dni && userFound.cuenta_bancaria && userFound.identidad
  );
  const updatedUser = await userFound.save();

  return res.json({
    id: updatedUser._id,
    fullname: updatedUser.fullname,
    email: updatedUser.email,
    id_afiliado: updatedUser.id_afiliado,
    is_verified: updatedUser.is_verified,
    dni: updatedUser.dni,
    cuenta_bancaria: updatedUser.cuenta_bancaria,
    identidad: updatedUser.identidad,
    completado: updatedUser.completado,
    rrss_1: updatedUser.rrss_1,
    rrss_2: updatedUser.rrss_2,
    rrss_3: updatedUser.rrss_3,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  });
};
