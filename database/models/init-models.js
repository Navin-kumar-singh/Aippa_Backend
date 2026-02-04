var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _blogs = require("./blogs");
var _careerGuide = require("./careerGuide");

var _applied_cert_users = require("./applied_cert_users");
var _campusherpa = require("./campusherpa");
var _model_un_coordinators = require("./model_un_coordinators");
var _model_un_pressCorps_members = require("./model_un_pressCorps_members");
var _model_un_secretariats_member = require("./model_un_secretariats_member");
var _certificates = require("./certificates");
var _model_un_secretariats = require("./model_un_secretariats");
var _course_enrolled = require("./course_enrolled");
var _course_review = require("./course_review");
var _contactus = require("./contactus");
var _courses = require("./courses");
var _comments = require("./comments");
var _club_institutes = require("./club_institutes");
var _club_students = require("./club_students");
var _posts = require("./posts");
var _clubs = require("./clubs");
var _discussion_board = require("./discussion_board");
var _discussion_attendees = require("./discussion_attendees");
var _events = require("./events");
var _eventPlanPage = require("./eventPageForm");
var _eventPlan = require("./eventPlan");
var _event_point = require("./event_point");
var _event_vote = require("./event_vote");
var _event_status = require("./event_status");
var _emailProcessing = require("./emailProcessing");
var _email_deliveries = require("./email_deliveries");
var _email_list = require("./email_list");
var _g20_country = require("./g20_country");
var _g20_tracks = require("./g20_tracks");
var _g20_themes = require("./g20_themes");
var _g20_delegates = require("./g20_delegates");
var _g20_designation = require("./g20_designation");
var _institute_affiliate = require("./institute_affiliate");
var _institute_gallery = require("./institute_gallery");
var _institute_certificate = require("./institute_certificate");
var _institute_coordinators = require("./institute_coordinators");
var _institute_account_manager = require("./institute_account_manager");
var _institute_register = require("./institute_register");
// var _institute_backup = require("./institute_backup");
var _student_register = require("./student_register");
var _teacher_register = require("./teacher_register");
var _institute_onboard = require("./institute_onboard");
var _institute_resources = require("./institute_resources");
var _institute_reg_details = require("./institute_reg_details");
var _student_reg_details = require("./student_reg_details");
var _teacher_reg_details = require("./teacher_reg_details");
var _institutions = require("./institutions");
var _loksabha_constituency = require("./loksabha_constituency");
var _lsmtQuestions = require("./lsmtQuestions");
var _lsmtAttempt = require("./lsmtAttempt");
var _news = require("./news");
var _pincode = require("./pincode");
var _poll_questions = require("./poll_questions");
var _questions = require("./questions");
var _quiz = require("./quiz");
var _quotes = require("./quotes");
var _stateWiseContent = require("./stateWiseContent");
var _reporting_council = require("./reporting_council");
var _resource_library = require("./resource_library");
var _sections = require("./sections");
var _student_coordinators = require("./student_coordinators");
var _student_onboard = require("./student_onboard");
var _student_poll = require("./student_poll");
var _student_quiz = require("./student_quiz");
var _students = require("./students");
var _sub_topics = require("./sub_topics");
var _topics = require("./topics");
var _users = require("./users");
var _video_documents = require("./video_documents");
var _youth_gallery = require("./youth_gallery");
var _otpverify = require("./otpverify");
var _mediaCoverages = require("./mediaCoverages");
var _delegatesEmailProcessing = require("./delegatesEmailProcessing");
var _documents = require("./documents");
var _event_winners = require("./event_winners");
var _offline_event = require("./offline_event");
var _offline_event_images = require("./offline_event_images");
var _gallery = require("./gallery");
var _gallery_images = require("./galley_images");
var _gallery_comments = require("./gallery_comments");
var _additional_certificates = require("./additional_certificates");
var _notification = require("./notification");
var _carbonFootprint_Transportation = require("./carbon_calculator");
var _model_un_register = require("./model_un_register");
var _model_un_student_part = require("./model_un_student_part");
var _model_un_pressCorps = require("./model_un_pressCorps");
var _model_un_committees = require("./model_un_committees");
var _model_un_eventtheme = require("./model_un_eventtheme");
var _model_un_subtheme = require("./model_un_subtheme");
var _model_un_selected_committees = require("./model_un_selected_committees");
var _model_un_eventformat = require("./model_un_eventformat");
var _model_un_eventcoordinator = require("./model_un_eventcoordinator");
var _cfc_questions = require("./cfc_questions");
var _cfc_category = require("./cfc_category");
var _cfc_answers = require("./cfc_answers");
var _days_21_task_performance = require("./days_21_task_performance");
var _days_21_attempt = require("./days_21_attempt");
var _days_21_task = require("./days_21_task");
var _steps_75_task_performance = require("./steps_75_task_performance");
var _steps_75_attempt = require("./steps_75_attempt");
var _steps_75_category = require("./steps_75_category");
var _steps_75_task = require("./steps_75_task");
var _carbonCredit = require("./carbonCredit");
var _discussion_chat = require("./discussion_chat");
var _discussion_reply = require("./discussion_reply");
var _discussion_point = require("./discussion_point");
var _discussion_likes = require("./discussion_likes");
var _discussion_dislikes = require("./discussion_dislikes");
var _notification_center = require("./notification_center");
var _discussion_scoresheet = require("./discussion_scoresheet");
var _model_un_gallery = require("./model_un_gallery");
var _model_un_mediaCoverage = require("./model_un_mediaCoverage");
var _model_un_commuinque = require("./model_un_commuinque");
var _club_members = require("./club_members");
var _user_subscriber = require("./user_subscriber");
var _institute_req_message = require("./institute_req_message");
var _review_rating = require("./review_rating");
var _nipam_institute = require("./nipam_institute");
var _riasecFeedback = require("./riasecFeedback");
var _lsmtFeedback = require("./lsmtFeedback");
var _riasecAttempt = require("./riasecAttempt");
var _riasecQuestions = require("./riasecQuestions");
var _riasecCareer = require("./riasecCareer");
var _riasecCareerList = require("./riasecCareerList");
var _all_teacher_student = require("./all_teacher_student");
var _institute_csv_admin = require("./institute_csv_admin");
var _highlights = require("./highlights");
var _cal_events = require("./cal_events");
var _cal_events_users = require("./cal_events_users");
var _cal_events_posts = require("./cal_events_posts");
var _cal_events_likes = require("./cal_events_likes");
var _cal_events_comments = require("./cal_events_comments");
var _institutecbse_details = require("./institutecbse_details");
var _institutecbse_alt_details = require("./institutecbse_alt_details");
var _admin_comments = require("./admin_comments");
var _data_provider = require("./data_provider");
var _calling_team_status = require("./calling_team_status");

const sequelize = require("../connection");
// const comments = require("./comments");

function initModels(sequelize) {
  var club_institutes = _club_institutes(sequelize, DataTypes);
  var club_students = _club_students(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var careerGuide = _careerGuide(sequelize, DataTypes);

  var admin = _admin(sequelize, DataTypes);
  var applied_cert_users = _applied_cert_users(sequelize, DataTypes);
  var blogs = _blogs(sequelize, DataTypes);
  var campusherpa = _campusherpa(sequelize, DataTypes);
  var model_un_coordinators = _model_un_coordinators(sequelize, DataTypes);
  var model_un_pressCorps_members = _model_un_pressCorps_members(
    sequelize,
    DataTypes
  );
  var model_un_secretariats_member = _model_un_secretariats_member(
    sequelize,
    DataTypes
  );
  var certificates = _certificates(sequelize, DataTypes);
  var course_enrolled = _course_enrolled(sequelize, DataTypes);
  var course_review = _course_review(sequelize, DataTypes);
  var contactus = _contactus(sequelize, DataTypes);
  var courses = _courses(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var clubs = _clubs(sequelize, DataTypes);
  var discussion_board = _discussion_board(sequelize, DataTypes);
  var discussion_attendees = _discussion_attendees(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var model_un_committees = _model_un_committees(sequelize, DataTypes);
  var model_un_secretariats = _model_un_secretariats(sequelize, DataTypes);
  var eventPlanPage = _eventPlanPage(sequelize, DataTypes);
  var eventPlan = _eventPlan(sequelize, DataTypes);
  var event_point = _event_point(sequelize, DataTypes);
  var event_vote = _event_vote(sequelize, DataTypes);
  var event_status = _event_status(sequelize, DataTypes);
  var emailProcessing = _emailProcessing(sequelize, DataTypes);
  var email_deliveries = _email_deliveries(sequelize, DataTypes);
  var email_list = _email_list(sequelize, DataTypes);
  var g20_country = _g20_country(sequelize, DataTypes);
  var g20_tracks = _g20_tracks(sequelize, DataTypes);
  var g20_themes = _g20_themes(sequelize, DataTypes);
  var g20_delegates = _g20_delegates(sequelize, DataTypes);
  var g20_designation = _g20_designation(sequelize, DataTypes);
  var institute_certificate = _institute_certificate(sequelize, DataTypes);
  var institute_affiliate = _institute_affiliate(sequelize, DataTypes);
  var institute_gallery = _institute_gallery(sequelize, DataTypes);
  var institute_coordinators = _institute_coordinators(sequelize, DataTypes);
  var institute_account_manager = _institute_account_manager(
    sequelize,
    DataTypes
  );
  var institute_register = _institute_register(sequelize, DataTypes);
  // var institute_backup = _institute_backup(sequelize, DataTypes);
  var student_register = _student_register(sequelize, DataTypes);
  var teacher_register = _teacher_register(sequelize, DataTypes);
  var institute_onboard = _institute_onboard(sequelize, DataTypes);
  var institute_resources = _institute_resources(sequelize, DataTypes);
  var institute_reg_details = _institute_reg_details(sequelize, DataTypes);
  var student_reg_details = _student_reg_details(sequelize, DataTypes);
  var teacher_reg_details = _teacher_reg_details(sequelize, DataTypes);
  var institutions = _institutions(sequelize, DataTypes);
  var loksabha_constituency = _loksabha_constituency(sequelize, DataTypes);
  var lsmtQuestions = _lsmtQuestions(sequelize, DataTypes);
  var lsmtAttempt = _lsmtAttempt(sequelize, DataTypes);
  var news = _news(sequelize, DataTypes);
  var pincode = _pincode(sequelize, DataTypes);
  var poll_questions = _poll_questions(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);
  var quiz = _quiz(sequelize, DataTypes);
  var quotes = _quotes(sequelize, DataTypes);
  var reporting_council = _reporting_council(sequelize, DataTypes);
  var resource_library = _resource_library(sequelize, DataTypes);
  var sections = _sections(sequelize, DataTypes);
  var stateWiseContent = _stateWiseContent(sequelize, DataTypes);
  var student_coordinators = _student_coordinators(sequelize, DataTypes);
  var student_onboard = _student_onboard(sequelize, DataTypes);
  var student_poll = _student_poll(sequelize, DataTypes);
  var student_quiz = _student_quiz(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var sub_topics = _sub_topics(sequelize, DataTypes);
  var topics = _topics(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var video_documents = _video_documents(sequelize, DataTypes);
  var youth_gallery = _youth_gallery(sequelize, DataTypes);
  var otpverify = _otpverify(sequelize, DataTypes);
  var mediaCoverages = _mediaCoverages(sequelize, DataTypes);
  var event_winners = _event_winners(sequelize, DataTypes);
  var delegatesEmailProcessing = _delegatesEmailProcessing(
    sequelize,
    DataTypes
  );
  var documents = _documents(sequelize, DataTypes);
  var offline_event = _offline_event(sequelize, DataTypes);
  var offline_event_images = _offline_event_images(sequelize, DataTypes);
  var gallery = _gallery(sequelize, DataTypes);
  var gallery_images = _gallery_images(sequelize, DataTypes);
  var gallery_comments = _gallery_comments(sequelize, DataTypes);
  var additional_certificates = _additional_certificates(sequelize, DataTypes);
  var notification = _notification(sequelize, DataTypes);
  var carbonFootprint_Transportation = _carbonFootprint_Transportation(
    sequelize,
    DataTypes
  );
  var model_un_register = _model_un_register(sequelize, DataTypes);
  var model_un_student_part = _model_un_student_part(sequelize, DataTypes);
  var model_un_pressCorps = _model_un_pressCorps(sequelize, DataTypes);
  var model_un_eventtheme = _model_un_eventtheme(sequelize, DataTypes);
  var model_un_subtheme = _model_un_subtheme(sequelize, DataTypes);
  var model_un_selected_committees = _model_un_selected_committees(
    sequelize,
    DataTypes
  );
  var model_un_eventformat = _model_un_eventformat(sequelize, DataTypes);
  var model_un_eventcoordinator = _model_un_eventcoordinator(
    sequelize,
    DataTypes
  );
  var model_un_gallery = _model_un_gallery(sequelize, DataTypes);
  var model_un_mediaCoverage = _model_un_mediaCoverage(sequelize, DataTypes);
  var model_un_commuinque = _model_un_commuinque(sequelize, DataTypes);
  var cfc_questions = _cfc_questions(sequelize, DataTypes);
  var cfc_category = _cfc_category(sequelize, DataTypes);
  var cfc_answers = _cfc_answers(sequelize, DataTypes);
  var days_21_task_performance = _days_21_task_performance(
    sequelize,
    DataTypes
  );
  var days_21_attempt = _days_21_attempt(sequelize, DataTypes);
  var days_21_task = _days_21_task(sequelize, DataTypes);
  var steps_75_task_performance = _steps_75_task_performance(
    sequelize,
    DataTypes
  );
  var steps_75_attempt = _steps_75_attempt(sequelize, DataTypes);
  var steps_75_category = _steps_75_category(sequelize, DataTypes);
  var steps_75_task = _steps_75_task(sequelize, DataTypes);
  var carbonCredit = _carbonCredit(sequelize, DataTypes);
  var discussion_chat = _discussion_chat(sequelize, DataTypes);
  var discussion_point = _discussion_point(sequelize, DataTypes);
  var discussion_reply = _discussion_reply(sequelize, DataTypes);
  var discussion_dislikes = _discussion_dislikes(sequelize, DataTypes);
  var discussion_likes = _discussion_likes(sequelize, DataTypes);
  var notification_center = _notification_center(sequelize, DataTypes);
  var discussion_scoresheet = _discussion_scoresheet(sequelize, DataTypes);
  var club_members = _club_members(sequelize, DataTypes);
  var user_subscriber = _user_subscriber(sequelize, DataTypes);
  var institute_req_message = _institute_req_message(sequelize, DataTypes);
  var review_rating = _review_rating(sequelize, DataTypes);
  var nipam_institute = _nipam_institute(sequelize, DataTypes);

  // Raisec Models
  var riasecFeedback = _riasecFeedback(sequelize, DataTypes);
  var lsmtFeedback = _lsmtFeedback(sequelize, DataTypes);
  var riasecQuestions = _riasecQuestions(sequelize, DataTypes);
  var riasecAttempt = _riasecAttempt(sequelize, DataTypes);
  var riasecCareer = _riasecCareer(sequelize, DataTypes);
  var riasecCareerList = _riasecCareerList(sequelize, DataTypes);
  var all_teacher_student = _all_teacher_student(sequelize, DataTypes);
  var institute_csv_admin = _institute_csv_admin(sequelize, DataTypes);
  var highlights = _highlights(sequelize, DataTypes);

  var cal_events = _cal_events(sequelize, DataTypes);
  var cal_events_users = _cal_events_users(sequelize, DataTypes);
  var cal_events_posts = _cal_events_posts(sequelize, DataTypes);
  var cal_events_likes = _cal_events_likes(sequelize, DataTypes);
  var cal_events_comments = _cal_events_comments(sequelize, DataTypes);

  var institutecbse_details = _institutecbse_details(sequelize, DataTypes);
  var institutecbse_alt_details = _institutecbse_alt_details(
    sequelize,
    DataTypes
  );

  var admin_comments = _admin_comments(sequelize, DataTypes);
  var data_provider = _data_provider(sequelize, DataTypes);

  var calling_team_status = _calling_team_status(sequelize, DataTypes);

  // certificates.belongsTo(courses, { as: "course", foreignKey: "courseId" });
  // courses.hasMany(certificates, { as: "certificates", foreignKey: "courseId" });
  // course_enrolled.belongsTo(courses, { as: "course", foreignKey: "courseId" });
  // courses.hasMany(course_enrolled, {
  //   as: "course_enrolleds",
  //   foreignKey: "courseId",
  // });
  // course_review.belongsTo(courses, {
  //   as: "course",
  //   foreignKey: "courseId",
  //   onDelete: "CASCADE",
  //   onUpdate: "CASCADE",
  // });
  // courses.hasMany(course_review, {
  //   as: "course_reviews",
  //   foreignKey: "courseId",
  // });
  // sections.belongsTo(courses, { as: "course", foreignKey: "courseId" });
  // courses.hasMany(sections, { as: "sections", foreignKey: "courseId" });
  // g20_delegates.belongsTo(g20_country, {
  //   as: "country",
  //   foreignKey: "countryId",
  // });
  g20_country.hasMany(g20_delegates, {
    as: "g20_delegates",
    foreignKey: "countryId",
  });
  institutions.hasMany(g20_delegates, {
    as: "g20_delegates",
    foreignKey: "instituteId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  institute_onboard.belongsTo(institutions, {
    as: "institute",
    foreignKey: "instituteId",
  });
  institutions.hasMany(institute_onboard, {
    as: "institute_onboards",
    foreignKey: "instituteId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  institutions.hasMany(institute_onboard, {
    as: "institute_resources",
    foreignKey: "instituteId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  reporting_council.belongsTo(institutions, {
    as: "institute",
    foreignKey: "instituteId",
  });
  institutions.hasMany(reporting_council, {
    as: "reporting_councils",
    foreignKey: "instituteId",
  });
  institutions.hasMany(event_status, {
    as: "event_status",
    foreignKey: "instituteId",
  });
  students.belongsTo(institutions, {
    as: "institute",
    foreignKey: "instituteId",
  });
  institutions.hasMany(students, { as: "students", foreignKey: "instituteId" });
  questions.belongsTo(quiz, { as: "quiz", foreignKey: "quizId" });
  quiz.hasMany(questions, { as: "questions", foreignKey: "quizId" });
  video_documents.belongsTo(sections, {
    as: "section",
    foreignKey: "sectionId",
  });

  club_institutes.hasOne(institutions, {
    as: "club_institutes",
    foreignKey: "id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  club_students.hasOne(students, {
    as: "club_students",
    foreignKey: "id",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  sections.hasMany(video_documents, {
    as: "video_documents",
    foreignKey: "sectionId",
  });
  certificates.belongsTo(students, { as: "student", foreignKey: "studentId" });
  students.hasMany(certificates, {
    as: "certificates",
    foreignKey: "studentId",
  });
  course_enrolled.belongsTo(students, {
    as: "student",
    foreignKey: "studentId",
  });
  students.hasMany(course_enrolled, {
    as: "course_enrolleds",
    foreignKey: "studentId",
  });
  students.hasMany(student_coordinators, {
    as: "student_coordinator",
    foreignKey: "studentId",
  });

  students.hasMany(riasecAttempt, {
    foreignKey: "userId",
    as: "riasecAttempts",
  });
  riasecAttempt.belongsTo(students, {
    foreignKey: "userId",
    as: "student",
  });

  students.hasMany(lsmtAttempt, {
    foreignKey: "userId",
    as: "lsmtAttempts",
  });
  lsmtAttempt.belongsTo(students, {
    foreignKey: "userId",
    as: "student",
  });

  course_review.belongsTo(students, {
    as: "student",
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  students.hasMany(course_review, {
    as: "course_reviews",
    foreignKey: "studentId",
  });
  g20_delegates.belongsTo(students, { as: "student", foreignKey: "studentId" });
  students.hasMany(g20_delegates, {
    as: "g20_delegates",
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  reporting_council.belongsTo(students, {
    as: "student",
    foreignKey: "studentId",
  });
  student_coordinators.belongsTo(students, {
    as: "student_coordinator",
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  students.hasMany(reporting_council, {
    as: "reporting_councils",
    foreignKey: "studentId",
  });
  student_onboard.belongsTo(students, {
    as: "student",
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  students.hasMany(student_onboard, {
    as: "student_onboards",
    foreignKey: "studentId",
  });
  student_quiz.belongsTo(students, {
    as: "student",
    foreignKey: "studentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  students.hasMany(student_quiz, {
    as: "student_quizzes",
    foreignKey: "studentId",
  });
  sub_topics.belongsTo(topics, { as: "topic", foreignKey: "topicId" });
  topics.hasMany(sub_topics, { as: "sub_topics", foreignKey: "topicId" });
  institute_affiliate.belongsTo(institutions, {
    as: "institute",
    foreignKey: "instituteId",
  });
  posts.hasMany(comments, { as: "comments", foreignKey: "postId" });
  comments.belongsTo(posts, { as: "posts", foreignKey: "postId" });

  // model_un_register.hasMany(model_un_committees, {  as :  "model_un_committees", foreignKey : "registerId" })
  // model_un_committees.belongsTo(model_un_register, {  as :  "model_un_register", foreignKey : "registerId" })
  //======= model_un_student_part belongs to students_reg_details
  // model_un_student_part.belongsTo(students, { foreignKey: 'studentId' });

  // student_reg_details
  students.hasMany(student_reg_details, {
    as: "student_reg_details",
    foreignKey: "student_id",
    onDelete: "CASCADE",
  });
  student_reg_details.belongsTo(students, {
    as: "students",
    foreignKey: "student_id",
    onDelete: "CASCADE",
  });

  // teacher_reg_details
  students.hasMany(teacher_reg_details, {
    as: "teacher_reg_details",
    foreignKey: "student_id",
    onDelete: "CASCADE",
  });
  teacher_reg_details.belongsTo(students, {
    as: "students",
    foreignKey: "student_id",
    onDelete: "CASCADE",
  });

  // institute_reg_details
  institutions.hasMany(institute_reg_details, {
    as: "institute_reg_details",
    foreignKey: "institute_id",
    onDelete: "CASCADE",
  });
  institute_reg_details.belongsTo(institutions, {
    as: "institutions",
    foreignKey: "institute_id",
    onDelete: "CASCADE",
  });

  posts.addHook("afterCreate", (post) => {
    updateCommentCount(post);
  });

  posts.addHook("afterDestroy", (post) => {
    updateCommentCount(post);
  });
  function updateCommentCount(post) {
    sequelize.models.comments
      .count({ where: { postId: post.id } })
      .then((count) => {
        post.commentCount = count;
        post.save();
      })
      .catch((error) => {
        console.error("Error updating commentCount:", error);
      });
  }
  return {
    admin,
    blogs,
    careerGuide,
    applied_cert_users,
    model_un_committees,
    model_un_pressCorps,
    campusherpa,
    model_un_coordinators,
    model_un_pressCorps_members,
    model_un_secretariats_member,
    certificates,
    course_enrolled,
    eventPlanPage,
    course_review,
    courses,
    clubs,
    discussion_board,
    discussion_attendees,
    posts,
    comments,
    contactus,
    events,
    eventPlan,
    event_point,
    event_vote,
    event_status,
    emailProcessing,
    email_deliveries,
    email_list,
    g20_tracks,
    g20_themes,
    g20_country,
    g20_delegates,
    g20_designation,
    institute_affiliate,
    institute_certificate,
    institute_gallery,
    institute_coordinators,
    institute_account_manager,
    institute_register,
    // institute_backup,
    student_register,
    institute_onboard,
    institute_resources,
    institute_reg_details,
    student_reg_details,
    teacher_reg_details,
    teacher_register,
    institutions,
    loksabha_constituency,
    lsmtQuestions,
    lsmtAttempt,
    news,
    pincode,
    poll_questions,
    questions,
    quiz,
    quotes,
    reporting_council,
    resource_library,
    sections,
    stateWiseContent,
    student_coordinators,
    student_onboard,
    student_poll,
    student_quiz,
    students,
    sub_topics,
    topics,
    users,
    video_documents,
    youth_gallery,
    otpverify,
    mediaCoverages,
    delegatesEmailProcessing,
    documents,
    event_winners,
    offline_event,
    offline_event_images,
    gallery,
    gallery_images,
    gallery_comments,
    additional_certificates,
    notification,
    club_institutes,
    club_students,
    model_un_register,
    model_un_student_part,
    model_un_eventtheme,
    model_un_subtheme,
    model_un_selected_committees,
    model_un_eventformat,
    model_un_secretariats,
    model_un_eventcoordinator,
    model_un_gallery,
    model_un_mediaCoverage,
    model_un_commuinque,
    carbonFootprint_Transportation,
    cfc_questions,
    cfc_category,
    cfc_answers,
    days_21_task_performance,
    days_21_task,
    days_21_attempt,
    steps_75_task_performance,
    steps_75_task,
    steps_75_attempt,
    steps_75_category,
    carbonCredit,
    discussion_chat,
    discussion_point,
    discussion_reply,
    discussion_likes,
    discussion_dislikes,
    notification_center,
    discussion_scoresheet,
    club_members,
    user_subscriber,
    institute_req_message,
    review_rating,
    nipam_institute,
    riasecFeedback,
    lsmtFeedback,
    riasecQuestions,
    riasecAttempt,
    riasecCareer,
    riasecCareerList,
    all_teacher_student,
    institute_csv_admin,
    highlights,
    cal_events,
    cal_events_users,
    cal_events_posts,
    cal_events_likes,
    cal_events_comments,
    institutecbse_details,
    institutecbse_alt_details,
    admin_comments,
    data_provider,
    calling_team_status,
  };
}
const DBMODELS = initModels(sequelize);
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
module.exports.DBMODELS = DBMODELS;
