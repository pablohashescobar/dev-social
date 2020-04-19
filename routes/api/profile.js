const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const axios = require("axios");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
//@route GET api/profile/me
//@desc Get Current Users profile
//@acess Private

router.get("/me", auth, async (req, res) => {
  try {
    //Finding through the user id passed through token
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);

    //Catching Errors
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route Post api/profile
//@desc  Create or update Users profile
//@acess Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status Is Required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build Profile object

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website)
      profileFields.website =
        website === "" ? "" : normalize(website, { forceHttps: true });
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    console.log(profileFields.skills);

    //Build Social Object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //Update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
      //Catching Errors
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
    res.send("Hello");
  }
);

//@route get api/profile
//@desc  Get All Profiles
//@acess Public
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Internal Server Error");
  }
});

//@route get api/profile/user/:user_id
//@desc  Get Specific User through the id
//@acess Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.json(profile);
    //Catching The Error
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      console.error(err.kind);

      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).json("Internal Server Error");
  }
});

//@route DELETE api/profile
//@desc  Delete Profile, user & post
//@acess Private

router.delete("/", auth, async (req, res) => {
  try {
    //@todo -remove users post
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Internal Server Error");
  }
});

//@route PUT api/profile/experience
//@desc  Put Experience
//@acess Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("company", "Company is Required").not().isEmpty(),
      check("from", "From date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc  Delete Experience
//@acess Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    console.log("Remove Index", removeIndex);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Internal Serval Error");
  }
});

//@route PUT api/profile/education
//@desc  Put Experience
//@acess Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is Required").not().isEmpty(),
      check("degree", "Degree is Required").not().isEmpty(),
      check("fieldofstudy", " Field of Study is Required").not().isEmpty(),
      check("from", " From date is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc  Delete education
//@acess Private

router.delete("/education/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    console.log("Remove Index", removeIndex);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Internal Serval Error");
  }
});

//@route GET api/profile/github/:username
//@desc  GET User REpos from github
//@acess Public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
    };

    const gitHubResponse = await axios.get(options.uri, {
      headers: { "user-agent": "node.js" },
    });

    if (gitHubResponse.status === !200) {
      return res.status(404).json({ msg: "No user Found" });
    }

    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("No User Found");
  }
});

module.exports = router;
