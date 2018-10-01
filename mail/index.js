const NM = require("nodemailer");
const fs = require("fs");
const nj = require("nunjucks");

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_NAME = process.env.MAIL_NAME;
const MAIL_PASS = process.env.MAIL_PASS;

const mail = NM.createTransport({
  host: MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: MAIL_NAME,
    pass: MAIL_PASS
  }
});

function getConfig(to, subject, name, vars) {
  let mailOptions = {
    from: MAIL_NAME,
    to,
    subject,
    html: getTemplates(name, vars)
  };
  return mailOptions;
}

const loadTemplates = name => {
  return {
    change: fs.readFileSync(__dirname + "/change.html", 'utf-8'),
    password: fs.readFileSync(__dirname + "/password.html", 'utf-8'),
    register: fs.readFileSync(__dirname + "/register.html", 'utf-8')
  }[name]; // 修改邮件地址 // 忘记密码 // 激活邮件
};

const getTemplates = (name, vars) => {
  return nj.renderString(loadTemplates(name), vars);
};

module.exports = {
  mail,
  getConfig
};
