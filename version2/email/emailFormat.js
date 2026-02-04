const generateEmailTemplate = (parentEmail) => {
    return `
        <html>
            <body>
                <h1>Dear Parent,</h1>
                <p>Your child has an important update regarding their school program.</p>
                <p>Please check the latest notifications on the school portal.</p>
                <p>Best regards,<br>Your School Team</p>
            </body>
        </html>
    `;
};

module.exports = generateEmailTemplate;
