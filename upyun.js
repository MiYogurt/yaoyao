const upyun = require('upyun')

const { BUNKIT_NAME: name, BUNKIT_USER: user, BUNKIT_PASS : pass} = process.env;

const service = new upyun.Service(name, user, pass);
const client = new upyun.Client(service);
const bucket = new upyun.Bucket(name, user, pass);

client.makeDir('/avatar')

module.exports = {
    service,
    client,
    upyun,
    bucket
}