/* All routes Related to admin */

const { upload } = require("../../service/upload");
const { routeVerifierJwt } = require("../auth/jwt");
const {
  instituteActivation,
  getData,
  getConstituenctData,
  getOnboards,
  adminInstitutionRegister,
  deleteStudent,
  registerAdmin,
  getAdminsData,
  deleteAdmin,
  getLast7DaysStudent,
  getLast7DaysCertificates,
  getLast7DaysInstitute,
  getFilteredData,
  EditAdminRole,
  GetSuppresedEmail,
  DeleteSuppresedEmail,
  ResetStudentPassword,
  GetEmailListDomain,
  DeleteEmailListDomain,
  updateEmailListDomain,
  createEmailListDomain,
} = require("./admin.controller");
const {
  postQuote,
  getQuote,
  updateQuote,
  deleteQuote,
} = require("./quotes.controller");
const {
  postBlog,
  getBlog,
  updatedBlog,
  deleteBlog,
  getBlogById,
} = require("./blog.controller");
const {
  postYouthGallery,
  fetchResourceLibrary,
  postResourcesLibrary,
  updateResourcesLibrary,
  deleteResourcesLibrary,
} = require("./content.controller");
const {
  getNews,
  getNewsById,
  postNews,
  updateNews,
  deleteNews,
} = require("./news.controller");
const {
  getAdminInstituteData,
  getCoordinatorData,
  getStudentsDataByInstitute,
  fetchStudentDelegate,
  getStudentsCertificateData,
  StudentActivation,
  deleteInstitute,
  addStudent,
} = require("./instituteAdmin.controller");
const {
  getCertificatesData,
  postCertificateData,
  updateCertificateData,
  deleteCertificateData,
} = require("./instituteCertificates");
const fetchCertificate = require("./fetchCertificate");
const { createPoll } = require("./poll.controller");
const { contact, deleteContactUs } = require("./contact");
const {
  PostCertificate,
  fetchAllCertificates,
} = require("../course/certificate.controller");
const {
  getResources,
  postResources,
  updateResources,
  deleteResources,
} = require("./instituteResources");
const {
  postGallery,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("./instituteGallery");
const {
  getAffiliateInstitute,
  postAffiliateInstitute,
  deleteAffiliateInstitute,
  getAllAffiliateInstitute,
} = require("./instituteAffiliate");
const {
  PostAdminCourses,
  PostAdminCoursesSection,
  PostAdminCoursesSectionVideo,
  getAdminCoursesSectionVideo,
  getAdminCourses,
  getAdminCoursesSections,
  editAdminCourses,
  deleteAdminCourses,
  editAdminCoursesSection,
  deleteAdminCoursesSection,
} = require("./admincourses.controller");
const { LocalMulter } = require("../../service/localMulter");
const { ImageReduce } = require("../../service/imageSizeReducer");
const {
  AddGalleryEvent,
  fetchGalleryEvent,
  FetchGalleryImage,
  UploadGalleryImage,
  deleteInstituteGalleryImage,
  updateInstituteGalleryImage,
} = require("./GalleryControl");
const { uploadEventImage } = require("../public/offlineEventControl");
const { getDataAnalytics, getUsersPerDayForChart } = require("./analytics.controller");

const adminRouter = require("express").Router();
adminRouter.get("/", getData);
adminRouter.get("/email-suppress", GetSuppresedEmail);
adminRouter.delete("/email-suppress", DeleteSuppresedEmail);
adminRouter.get("/email-list", GetEmailListDomain);
adminRouter.delete("/email-list", DeleteEmailListDomain);
adminRouter.put("/email-list", updateEmailListDomain);
adminRouter.post("/email-list/new", createEmailListDomain);
adminRouter.get("/constituency", getConstituenctData);
adminRouter.post("/institute", upload.single("none"), instituteActivation); //TODO
adminRouter.post("/institute-register", adminInstitutionRegister);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/data", getAdminsData);
adminRouter.delete("/delete", deleteAdmin);
adminRouter.put("/update", EditAdminRole);
adminRouter.delete("/institute-delete", deleteInstitute);
adminRouter.get("/institute/:id", getAdminInstituteData);
adminRouter.get("/coordinator/:id", getCoordinatorData);
adminRouter.post("/addStudent", addStudent);
adminRouter.post("/student", upload.single("none"), StudentActivation);
adminRouter.get("/students/:id", getStudentsDataByInstitute);
adminRouter.post("/student/reset-password", ResetStudentPassword);
adminRouter.delete("/student-delete", deleteStudent);
adminRouter.get("/delegates/:id", fetchStudentDelegate);
adminRouter.get("/getonboards", getOnboards);
adminRouter.get("/certificate/:id", getCertificatesData);
adminRouter.post(
  "/certificate/:id",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/certificate/"),
  postCertificateData
);
adminRouter.put(
  "/certificate/:id",
  LocalMulter.single("certificate_url"),
  ImageReduce(500, "admin/certificate/"),
  updateCertificateData
);
adminRouter.delete("/certificate/:id", deleteCertificateData);
adminRouter.get("/institute-certificates/:id", getStudentsCertificateData);

adminRouter.get("/institute-resources/:id", getResources);
adminRouter.post(
  "/institute-resources/:id",
  upload.single("resource_file"),
  postResources
);
adminRouter.put(
  "/institute-resources",
  upload.single("resource_file"),
  updateResources
);
adminRouter.delete("/institute-resources", deleteResources);

adminRouter.get("/institute-gallery/:id", getGallery);
adminRouter.post(
  "/institute-gallery/:id",
  LocalMulter.single("img"),
  ImageReduce(500, "instituteGallery/"),
  postGallery
);
adminRouter.put(
  "/institute-gallery",
  LocalMulter.single("img"),
  ImageReduce(500, "instituteGallery/"),
  updateGallery
);
adminRouter.delete("/institute-gallery", deleteGallery);

adminRouter.get("/institute-affiliate", getAllAffiliateInstitute);
adminRouter.get("/institute-affiliate/:id", getAffiliateInstitute);
adminRouter.post("/institute-affiliate/:id", postAffiliateInstitute);
adminRouter.delete("/institute-affiliate", deleteAffiliateInstitute);

adminRouter.get("/quotes", getQuote);
adminRouter.post(
  "/quotes",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/quotes/"),
  postQuote
);
adminRouter.put(
  "/quotes",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/quotes/"),
  updateQuote
);
adminRouter.delete("/quotes", deleteQuote);
adminRouter.get("/blogs", getBlog);
adminRouter.get("/blogs/edit/:id", getBlogById);

//Certificate API for Admin Table
adminRouter.get("/certificate", fetchCertificate);

adminRouter.post(
  "/blogs",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/blogs/"),
  postBlog
);
adminRouter.put(
  "/blogs",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/blogs/"),
  updatedBlog
);
adminRouter.delete("/blogs", deleteBlog);
adminRouter.get("/news", getNews);
adminRouter.get("/news/edit/:id", getNewsById);
adminRouter.post(
  "/news",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/news/"),
  postNews
);
adminRouter.put(
  "/news",
  LocalMulter.single("img"),
  ImageReduce(500, "/admin/news"),
  updateNews
);
adminRouter.delete("/news", deleteNews);

//admin/blogs/edit/${id.id}
adminRouter.post(
  "/youthgallery",
  LocalMulter.single("img"),
  ImageReduce(500, "admin/youthgallery/"),
  postYouthGallery
);

//polling API
adminRouter.put("/createPoll", createPoll);
adminRouter.get("/content/resource-library", fetchResourceLibrary);
adminRouter.post(
  "/content/resource-library",
  upload.single("pdf"),
  postResourcesLibrary
);
adminRouter.put(
  "/content/resource-library/:id",
  upload.single("pdf"),
  updateResourcesLibrary
);
adminRouter.delete("/content/resource-library/:id", deleteResourcesLibrary);
adminRouter.post(
  "/course",
  LocalMulter.single("thumbnail"),
  ImageReduce(500, "admin/course/"),
  PostAdminCourses
);
adminRouter.put(
  "/course",
  LocalMulter.single("thumbnail"),
  ImageReduce(500, "admin/course/"),
  editAdminCourses
);
adminRouter.delete("/course", deleteAdminCourses);
//Contact-Us
adminRouter.get("/contactUs", contact);
adminRouter.delete("/contactUS", deleteContactUs);
adminRouter.post("/course/section", PostAdminCoursesSection);
adminRouter.put("/course/section", editAdminCoursesSection);
adminRouter.delete("/course/section", deleteAdminCoursesSection);
adminRouter.post("/course/section/video", PostAdminCoursesSectionVideo);
adminRouter.get("/course/section/video", getAdminCoursesSectionVideo);
adminRouter.get("/course", getAdminCourses);
adminRouter.get("/course/section", getAdminCoursesSections);

adminRouter.get("/analytics", getDataAnalytics);
adminRouter.get('/analytics/users-per-day', getUsersPerDayForChart);

// get 7 days data for student
adminRouter.get("/7daysDataStudent", getLast7DaysStudent);

// get 7 days data for Institute
adminRouter.get("/7daysDataInstitute", getLast7DaysInstitute)

adminRouter.get("/7daysDataCertificate", getLast7DaysCertificates)
adminRouter.get("/getInfoFilter", getFilteredData)


/*  Gallery Routes */
adminRouter.post(
  "/gallery_event",
  LocalMulter.single("img"),
  ImageReduce(500, "public/gallery_event_image/thumbnail/"),
  AddGalleryEvent
);
adminRouter.get("/gallery_event", fetchGalleryEvent);
adminRouter.get("/gallery_event_image", FetchGalleryImage);
adminRouter.delete("/gallery_event_image", deleteInstituteGalleryImage);
adminRouter.put("/gallery_event_image", updateInstituteGalleryImage);
adminRouter.post(
  "/gallery_event_image",
  LocalMulter.single("img"),
  ImageReduce(500, "public/gallery_event_image/"),
  UploadGalleryImage
);

module.exports = adminRouter;
