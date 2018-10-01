import Parse from 'parse/node'

Parse.serverURL = process.env.baseUrl + '/parse'

Parse.initialize("1", "", process.env.masterKey);

export default () => Parse
