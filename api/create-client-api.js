import Parse from 'parse'

Parse.serverURL = process.env.baseUrl + '/parse'

export default () => {
  Parse.initialize('1')
  return Parse
}
