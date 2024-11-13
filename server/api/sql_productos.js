var util = require('./util.js')
  , sql  = require('mssql')
  ;
    
const TABLE_NAME = 'productos'

var builtGet = function(query, obj, callback){
  var keys = Object.keys(obj)

  var arrayKeys = []
  
  util.getConnection(function(err, con){
    if (err) {
      callback(err)
      return
    }

    var request = new sql.Request(con);
    //Agregamos los inputs
    for (var i = 0; i < keys.length; i++) {
      var element = keys[i];
      request.input(element, obj[element]);
    }
    var queryTime = `sql builtGet ${TABLE_NAME} ` + Math.floor(Math.random() * 100000) + 1;
    request.query(query, function(err, recordset){
      con.close();
      if (recordset) callback(err, recordset.length, recordset)
      else callback(err, 0, [])
    });
  });
};

var insert = function(obj, callback) {
  
  var keys = Object.keys(obj)
  
  if (keys.length === 0) {
    callback(null, 0)
    return;
  }

  var arrayFieldsQuery = []
  var arrayParametersQuery = []
  for (var i = 0; i < keys.length; i++) {
    var element = keys[i];
    arrayFieldsQuery.push(element)
    arrayParametersQuery.push(`@${element}`)
  }

  var queryFields = arrayFieldsQuery.join(',')
  var queryValues = arrayParametersQuery.join(',')

  let query = `
    insert into ${TABLE_NAME} 
    (
    ${queryFields}
    )
    values
    (
    ${queryValues}
    );
  `

  try {
    util.getConnection(function(err, con){
      if (err) {
        callback(err)
        return
      }
  
      // var query = query;
      var request = new sql.Request(con);

      //Agregamos los inputs
      for (var i = 0; i < keys.length; i++) {
        var element = keys[i];
        request.input(element, obj[element]);
      }

      var queryTime = `sql insert ${TABLE_NAME} ` + Math.floor(Math.random() * 100000) + 1;

      
      request.query(query, function(err, recordset){
        con.close();

        if (err) {
          callback(err)
          return
        }
        callback(err, true)
      });
    })
  } catch (error) {
    // if (con) con.close()
    callback(error)
  }

}

exports.insert     = insert
exports.builtGet   = builtGet