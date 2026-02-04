/*Routes for public  */
const { ImageReduce } = require("../../service/imageSizeReducer");
const { LocalMulter } = require("../../service/localMulter");
const sendMail = require("../../service/smtpMail");
const { getBlogBySlug, getBlog } = require("../admin/blog.controller");
const { getNewsBySlug, getNews } = require("../admin/news.controller");
const { fetchGalleryEvent, FetchGalleryImage } = require("../admin/GalleryControl");

const {
  getPublicInstitute,
  fetchAllG20Countries,
  fetchAllG20Designation,
  stateWiseData,
  stateWiseContent,
  fetchTopics,
  fetchStateWiseContent,
  uploadStateWiseContent,
  stateAndDistrictData,
  contactUs,
  StudentsPublic,
  fetchInstituteList,
  StatesList,
  DistrictList,
  fetchTrackAndTheme,
} = require("./public.controller");
const { captchaverifier } = require("../../middleware/captchaverifier");
const publicRouter = require("express").Router();

publicRouter.get("/blogs", getBlog);
publicRouter.get("/news", getNews);
publicRouter.get("/gallery_event", fetchGalleryEvent);
publicRouter.get("/gallery_event_image", FetchGalleryImage);
publicRouter.get("/institute", getPublicInstitute);
publicRouter.get("/documents", getPublicInstitute);
publicRouter.get("/g20_countries", fetchAllG20Countries);
publicRouter.get("/g20_designations", fetchAllG20Designation);
publicRouter.get("/topics", fetchTopics);
publicRouter.get("/theme-tracks", fetchTrackAndTheme);
publicRouter.get("/pincode", stateWiseData);
publicRouter.get("/stateWiseContent", stateWiseContent);
publicRouter.get("/adminState", fetchStateWiseContent);
publicRouter.post("/adminState", uploadStateWiseContent);
publicRouter.get("/stateanddistrict", stateAndDistrictData);
publicRouter.get("/stateList", StatesList);
publicRouter.get("/districtList", DistrictList);
publicRouter.get("/sendmail", async (req, res) => {
  const { fromMail, toMail, subject, body } = req.body;
  if (!fromMail || !toMail || !subject || !body) {
    res.json({ message: "Please provide all the necessary Fields" });
  } else {
    const mailres = await sendMail(fromMail, toMail, subject, body);
    res.json({ mailres: mailres });
  }
});
publicRouter.post("/contactus", captchaverifier, contactUs);
publicRouter.post("/newsletter", contactUs);
publicRouter.get("/dynamic-blog/:slug", getBlogBySlug);
publicRouter.get("/dynamic-news/:slug", getNewsBySlug);
publicRouter.get("/students", StudentsPublic);
publicRouter.get("/institute-list", fetchInstituteList);

const {
  addOfflineEvent,
  fetchOfflineEvent,
  uploadEventImage,
  fetchEventImage,
  deleteEventImage,
} = require("./offlineEventControl");

publicRouter.post("/offline_event", addOfflineEvent);
publicRouter.get("/offline_event", fetchOfflineEvent);
publicRouter.get("/offline_event_image", fetchEventImage);
publicRouter.delete("/offline_event_image", deleteEventImage);
publicRouter.post(
  "/offline_event_image",
  LocalMulter.single("img"),
  ImageReduce(500, "public/offline_event_image/"),
  uploadEventImage
);

const { getNotify, getUsers, addNotify } = require("./notification");
const { routeVerifierJwt } = require("../auth/jwt");
/* Notications Routes */
publicRouter.get("/notification", routeVerifierJwt, getNotify);
publicRouter.post("/notification", routeVerifierJwt, addNotify);
publicRouter.put("/notification", routeVerifierJwt, getUsers);

module.exports = publicRouter;
