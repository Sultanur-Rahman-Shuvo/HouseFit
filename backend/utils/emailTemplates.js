// Email HTML templates

const paymentVerifiedTemplate = ({ userName, billMonth, amount, transactionId }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Verified</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Your payment has been successfully verified!</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Bill Month: ${billMonth}</li>
            <li>Amount: ${amount} BDT</li>
            <li>Transaction ID: ${transactionId}</li>
          </ul>
          <p>Thank you for your timely payment.</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const paymentRejectedTemplate = ({ userName, transactionId, reason }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Rejected</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Unfortunately, your payment could not be verified.</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>Please check your transaction details and resubmit with the correct information.</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const bookingApprovedTemplate = ({ userName, flatNumber, requestedDate }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Request Approved</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Great news! Your booking request has been approved.</p>
          <p><strong>Flat:</strong> ${flatNumber}</p>
          <p><strong>Viewing Date:</strong> ${requestedDate}</p>
          <p>Our representative will contact you shortly.</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const treeApprovedTemplate = ({ userName, points, location }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .badge { background: #F59E0B; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌳 Tree Plantation Approved!</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Congratulations! Your tree plantation has been verified and approved.</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Points Awarded:</strong> <span class="badge">+${points} points</span></p>
          <p>Thank you for contributing to a greener environment! Keep planting! 🌱</p>
          <p><small>Check the leaderboard to see your ranking. The top contributor gets 1000 BDT discount!</small></p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const leaveApprovedTemplate = ({ userName, startDate, endDate }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Leave Request Approved</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Your leave request has been approved.</p>
          <p><strong>From:</strong> ${startDate}</p>
          <p><strong>To:</strong> ${endDate}</p>
          <p>Have a safe trip!</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const billGeneratedTemplate = ({ userName, month, total, dueDate }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .amount { font-size: 24px; color: #3B82F6; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Bill Generated</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Your monthly bill has been generated.</p>
          <p><strong>Month:</strong> ${month}</p>
          <p><strong>Total Amount:</strong> <span class="amount">${total} BDT</span></p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p>Please make your payment before the due date to avoid late fees.</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const problemAssignedTemplate = ({ employeeName, title, priority, category }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .priority { display: inline-block; padding: 5px 15px; border-radius: 5px; color: white; }
        .urgent { background: #EF4444; }
        .high { background: #F59E0B; }
        .medium { background: #3B82F6; }
        .low { background: #6B7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Task Assigned</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>A new problem has been assigned to you.</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Priority:</strong> <span class="priority ${priority}">${priority.toUpperCase()}</span></p>
          <p>Please address this issue at your earliest convenience.</p>
        </div>
        <div class="footer">
          <p>HouseFit Apartment Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
    paymentVerifiedTemplate,
    paymentRejectedTemplate,
    bookingApprovedTemplate,
    treeApprovedTemplate,
    leaveApprovedTemplate,
    billGeneratedTemplate,
    problemAssignedTemplate,
};

