const express = require('express');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });
AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
});

var dynamodb = new AWS.DynamoDB();
var dynamodbDocClient = new AWS.DynamoDB.DocumentClient();
var comprehendMedical = new AWS.ComprehendMedical();

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

PORT = 3000;

app.post('/login', (req, res) => {
  const username = req.body.username;
  var password = req.body.password;

  if (isEmpty(username)) {
    return res.status(500).send('Username has not been provided');
  }

  if (isEmpty(password)) {
    return res.status(500).send('Password has not been provided');
  }

  let params = {
    TableName: 'users',
    Key: {
      username: { S: username.toLowerCase() },
    },
    ProjectionExpression: 'password, admin',
  };

  dynamodb.getItem(params, function (err, data) {
    if (err) {
      return res.status(500).send(err);
    } else {
      if (isEmpty(data.Item)) {
        return res.status(500).send('User does not exist');
      }

      bcrypt.compare(password, data.Item['password']['S'], function (err, ret) {
        let isAdmin = false;
        if (!isEmpty(data.Item['admin'])) {
          isAdmin = data.Item['admin']['BOOL'];
        }

        return res.status(200).json(
          { 'login': ret, 'isAdmin': isAdmin }
        );
      });
    }
  });
});

app.get('/conditions-per-user', (req, res) => {
  getAllFromDB('medical_conditions')
    .then(medicalConditions => {
      if (isEmpty(medicalConditions)) {
        return res.status(500).send('No medical conditions found');
      }

      params = {
        TableName: 'user_conditions',
      };

      conditionsPerUser = [];
      let redFlag = false;
      dynamodb.scan(params, function (err, data) {
        if (err) {
          return res.status(500).send(err);
        } else {
          data.Items.forEach(function (conditionPerUser) {
            let userConditions = [];
            conditionPerUser.conditions['NS'].forEach(function (medicalCondition) {
              let medicalConditionForUser = medicalConditions.find(x => x.id == medicalCondition);
              if (redFlag === false && medicalConditionForUser['red_flag'] !== null && typeof medicalConditionForUser['red_flag'] !== 'undefined') {
                conditionPerUser.symptom['NS'].forEach(function (symptom) {
                  if (medicalConditionForUser['red_flag'].values.includes(Number(symptom))) {
                    redFlag = true;
                  }
                });
              }

              userConditions.push(
                medicalConditionForUser.name
              );
            });

            conditionsPerUser.push(
              {
                key: conditionPerUser.user.S,
                conditions: userConditions,
                redFlag: redFlag
              }
            );
          });
        }

        console.log(conditionsPerUser);
        return res.status(200).json(
          { 'data': conditionsPerUser }
        );
      });
    });
});

app.post('/chat', (req, res) => {
  const text = req.body.text;
  if (isEmpty(text)) {
    return res.status(500).send('Text has not been provided');
  }

  let params = {
    Text: text
  };

  comprehendMedical.detectEntities(params, function (err, data) {
    if (err) {
      return res.status(500).send(err);
    } else {
      const obj = data.Entities.find(obj => obj.Category === 'MEDICAL_CONDITION');
      if (typeof obj === 'undefined') {
        return res.status(500).send('Invalid text provided');
      }

      return res.status(200).json(
        { condition: obj.Text.toUpperCase() }
      );
    }
  });
});

app.post('/submitSymptoms', (req, res) => {
  const symptoms = req.body.symptoms;
  const userId = req.body.user;
  if (isEmpty(userId)) {
    return res.status(500).send('User has not been provided');
  }

  if (isEmpty(symptoms)) {
    return res.status(500).send('Symptoms has not been provided');
  }

  let queryParams = { RequestItems: {} };
  let keys = [];
  symptoms.forEach(function(value) {
    let obj = {
      'name': value
    }

    keys.push(obj);
  });

  queryParams.RequestItems['symptoms'] = {
    Keys: keys,
    ProjectionExpression: 'id'
  };

  let newSymptoms = [];
  dynamodbDocClient.batchGet(queryParams, function (err, data) {
    if (err) {
      return res.status(500).send(err); 
    } else {
      if (data.Responses.symptoms.length === 0) {
        return res.status(500).send('No medical conditions found on the DB');
      }

      newSymptoms = data.Responses.symptoms;
      let result = newSymptoms.map(symptom => String(symptom.id));
      let params = {
        'TableName' : 'user_conditions',
        'Key' : {
          'user': { 'S': userId.toLowerCase() },
        },
        'UpdateExpression' : 'ADD symptom :valuesToAdd',
        'ExpressionAttributeValues' : {
          ':valuesToAdd' : { 'NS': result }
        },
        ReturnValues:'UPDATED_NEW'
      }

      dynamodb.updateItem(params, function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          return res.status(200);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log('FYP listening on port ' + PORT)
});

function isEmpty(value) {
  return (value == null || value === 'undefined' || value.length === 0);
}

async function getAllFromDB(tableName) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  params = {
    TableName: tableName,
  };

  var objectPromise = await docClient.scan(params).promise().then((data) => {
    return data.Items
  });

  return objectPromise;
}