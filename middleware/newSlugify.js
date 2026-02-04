const slugify = require("slugify");
const { uid } = require("uid");

module.exports = function newSlugify(str = "") {
  str = str
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase()
    .slice(0, 40)
    .concat("-" + uid(5));
  return slugify(str);
};
