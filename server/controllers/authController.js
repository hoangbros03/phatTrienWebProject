const {
  model: CucDangKiem,
  CucDangKiemSchema,
} = require("../models/CucDangKiem");
const {
  model: TrungTamDangKiem,
  TrungTamDangKiemSchema,
} = require("../models/TrungTamDangKiem");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/roles_list");
const logger = require("../logger/logger");
const { log } = require("winston");
const handleLogin = async (req, res) => {
  const body = req.body;
  console.log(body);
  console.log(body.role);
  if (!body["user"] || !body["password"]) {
    logger.error("Necessary information must be inputted when log in");
    return res
      .status(400)
      .json({ message: "Necessary information must be inputted" });
  }
  //deny if user == god
  if (body.user == "god") {
    logger.info("Can't use this user name to login!");
    return res.sendStatus(400);
  }

  // //assign to role variable
  let role = null;
  //While sample shows that an account can have many roles, it won't happen here (max 1 role per acc)
  let role_num = null;
  if (body.role == ROLES_LIST.CucDangKiem) {
    role = CucDangKiem;
    role_num = 2000;
  } else if (body.role == ROLES_LIST.TrungTamDangKiem) {
    role = TrungTamDangKiem;
    role_num = 3000;
  } else {
    logger.error(
      "Role is not allowed (this is not a place for admin, tk hung dung nghich dai nua)"
    );
    return res.sendStatus(400);
  }

  //exec to return a promise
  const foundUser = await role.findOne({ user: body.user }).exec();
  if (!foundUser||(role_num===3000&&foundUser.active===false)) {
    logger.error("Username doesn't existed in the db");
    return res
      .status(200)
      .json({ status: "Username doesn't existed in the db" });
  }

  //   evaluate password
  //   It can compare between hased and plain password!
  //
  var match = await bcrypt.compare(body.password, foundUser.password);

  if (match) {
    //create JWTs
    try {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            user: foundUser.user,
            role: role_num.toString(),
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      //refresh every 30 minutes
      const refreshToken = jwt.sign(
        { UserInfo: { user: foundUser.user, role: role_num.toString() } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      //Save refreshToken for current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      logger.info(`auth successfully with ${foundUser.user}`);

      //Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // secure: true,
        sameSite: "None",
        maxAge: 30 * 60 * 1000,
      });
      //Cookies will be store in the client browser via 'cookies-parser' in server.js file
      res
        .status(200)
        .json({ access_token: accessToken, refreshToken: refreshToken });
    } catch (error) {
      console.log(error);
      res.status(200).json({ status: "Have error" });
    }
    //Grab roles and accessToken to json and send to user
    //TODO: Modified so front-end can work if needed
  } else {
    logger.error("Invalid password");
    res.status(200).json({ status: "Invalid password" });
  }
};
// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      console.log(decoded);
      const { UserInfo } = decoded;
      if (err) return res.status(403).json({ message: "Forbidden" });
      // //assign to role variable
      let role = null;
      //While sample shows that an account can have many roles, it won't happen here (max 1 role per acc)
      let role_num = null;
      if (UserInfo.role == ROLES_LIST.CucDangKiem) {
        role = CucDangKiem;
        role_num = 2000;
      } else if (UserInfo.role == ROLES_LIST.TrungTamDangKiem) {
        role = TrungTamDangKiem;
        role_num = 3000;
      } else {
        logger.error(
          "Role is not allowed (this is not a place for admin, tk hung dung nghich dai nua)"
        );
        return res.sendStatus(400);
      }
      const foundUser = await role
        .findOne({
          user: UserInfo.user,
        })
        .exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            user: foundUser.user,
            role: UserInfo.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      console.log({});
      res.json({ accessToken, user: UserInfo.user, role: UserInfo.role });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
module.exports = { handleLogin, refresh, logout };
