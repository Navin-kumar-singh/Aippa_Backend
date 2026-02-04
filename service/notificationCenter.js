const generateNotification = (notificationTemplate) => {
    switch(notificationTemplate) {
        case "Mun_cord_invitation":
            return "You are selected for MUN Member";

        case "like":
            return "Someone liked your post";

        default:
            return "Default notification message";
    }
}

module.exports = generateNotification;
