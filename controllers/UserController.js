const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const transporter = require("../config/nodemailer");

const UserController = {
  async create(req, res, next) {
    try {
      let hash;
      if (req.body.password !== undefined) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      if (req.file) req.body.avatar = req.file.filename;
      if (req.body.email === "tengobirras@gmail.com") {
        const user = await User.create({
          ...req.body,
          confirmed: true,
          password: hash,
          role: "admin",
        });
        return res.status(201).send({ message: "Welcome back ADMIN", user });
      } else {
        const user = await User.create({
          ...req.body,
          confirmed: true,
          password: hash,
          role: "user",
        });
        // const url = "http://localhost:8080/users/confirm/" + req.body.email; //enviamos esta url en forma de enlace al correo puesto por el usuario
        // await transporter.sendMail({
        //   to: req.body.email,
        //   subject: "Confirme su registro",
        //   html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
        //  <a href="${url}"> Click para confirmar tu registro</a>
        //  `,
        // });
        res.status(201).send({
          message: "We have sent you an email to confirm your register...",
          user,
        });
      }
    } catch (error) {
      console.log(error);
      error.origin = "User";
      next(error);
    }
  },
  async confirm(req, res) {
    try {
      await User.updateOne(
        {
          email: req.params.email,
        },
        { confirmed: true }
      );
      res.status(201).send("User confirm succesfull");
    } catch (error) {
      console.error(error);
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email }).populate({
        path: "postIds",
        select: ["title", "body", "avatar", "createdAt"],
      });
      if (!user) {
        return res
          .status(400)
          .send({ message: "User or password incorrect..." });
      }
      if (!user.confirmed) {
        return res.status(400).send({ message: "You may confirm your email" });
      }
      const isMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "User or password incorrect..." });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Welcome " + user.username, user, token });
    } catch (error) {
      console.error(error);
      res.status(401).send({ message: "We had an issue checking the user..." });
    }
  },

  async adminDelete(req, res) {
    try {
      await User.findById(req.params._id);
      if (req.user._id.toString() === req.params._id)
        return res.status(201).send({
          message:
            "But...why should I eliminate my own master? I'm not ready for that...I love you",
        });
      await Post.updateMany(
        { userId: req.params._id },
        { $unset: [{ comments: 1 }] }
      );
      await Post.deleteMany({ userId: req.params._id }, {});
      await Comment.deleteMany({ userId: req.params._id }, {});
      const user = await User.findByIdAndDelete(req.params._id);
      res.send({
        message: `As you wish master, ${user.username} has been deleted`,
        user,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem trying to remove the user" });
    }
  },
  async userDelete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.user._id);
      res.status(201).send({ message: `The user ${user} has been deleted` });
    } catch (error) {
      res.send({ message: "We had an issue removing the user..." });
    }
  },
  async update(req, res) {
    try {
      const updatedUser = {
        username: req.body.username,
        avatar: req.file.filename,
        email: req.body.email,
        password: req.body.password,
      };
      const user = await User.findByIdAndUpdate(req.user._id, updatedUser, {
        new: true,
      });
      res.send({ message: "User successfully updated", user });
    } catch (error) {
      console.error(error);
    }
  },
  async updateAdmin(req, res) {
    try {
      const oldUser = await User.findById(req.params._id);
      oldName = oldUser.name;
      const user = await User.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.send({
        message: `I like your style master, we updated the user ${oldName}`,
        user,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.find().select([
        "username",
        "email",
        "role",
        "followers",
        "avatar",
      ]);
      res.send(users);
    } catch (error) {
      console.error(error);
    }
  },
  async logoutUser(req, res) {
    try {
      console.log("fase 1");
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      console.log("fase 2");
      res.send({ message: "Disconnected" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "We had a problem trying to disconnect you",
      });
    }
  },

  async logoutAdmin(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({
        message: `As you wish master, the user ${user.username} has been kicked`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "We had a problem trying to disconnect you",
      });
    }
  },

  async getInfo(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select(["-password", "-tokens"])
        .populate({
          path: "postIds",
          select: ["title", "body", "avatar", "createdAt"],
        })
        .populate({
          path: "followers",
          select: { name: 1 },
        });
      user._doc.totalFollowers = user.followers.length;
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "We had a problem searching that information" });
    }
  },
  async getById(req, res) {
    try {
      if (req.params._id.length !== 24) {
        res
          .status(400)
          .send({ message: "You may need to introduce a valid Id format" });
        return;
      }
      const post = await User.findById(req.params._id).populate({
        path: "postIds",
        select: ["title", "body", "avatar", "createdAt"],
      });
      if (post === null) {
        res
          .status(400)
          .send({ message: "The id you introduced doesn't exist" });
        return;
      }
      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },
  async getUserByName(req, res) {
    try {
      const name = new RegExp(req.params.username, "i");
      const post = await User.findOne({ name });
      if (post === null) {
        res.status(400).send({ message: "Sorry, we can't find that User" });
        return;
      }
      res.send(post);
    } catch (error) {
      console.log(error);
    }
  },
  async followUser(req, res) {
    try {
      await User.findById(req.params._id);
      if (req.user._id.toString() === req.params._id)
        return res
          .status(201)
          .send({ message: "You are not so cool to follow yourself" });
      const exist = await User.findById(req.params._id);
      if (!exist.followers.includes(req.user._id)) {
        const user = await User.findByIdAndUpdate(
          req.params._id,
          { $push: { followers: req.user._id } },
          { new: true }
        );
        res
          .status(201)
          .send({ message: `Now you are following ${user.username}` });
      } else {
        res.status(400).send({ message: "You can't follow twice!" });
      }
    } catch (error) {
      res.status(500).send({ message: "There was an issue in the controller" });
    }
  },
  async unFollowUser(req, res) {
    try {
      const exist = await User.findById(req.params._id);
      if (exist.followers.includes(req.user._id)) {
        const user = await User.findByIdAndUpdate(
          req.params._id,
          { $pull: { followers: req.user._id } },
          { new: true }
        );
        res.status(200).send(user);
      } else {
        res.status(400).send({
          message: "You can't unfollow someone you didn't follow first!",
        });
      }
    } catch (error) {
      res.status(500).send({ message: "There was an issue in the controller" });
    }
  },
};

module.exports = UserController;
