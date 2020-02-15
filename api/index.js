const express = require('express');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });
AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
});

var dynamodb = new AWS.DynamoDB();
var comprehend = new AWS.Comprehend();

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
      dynamodb.scan(params, function (err, data) {
        if (err) {
          return res.status(500).send(err);
        } else {
          data.Items.forEach(function (conditionPerUser) {
            let userConditions = [];
            conditionPerUser.conditions['NS'].forEach(function (medicalCondition) {
              userConditions.push(
                medicalConditions.find(x => x.id == medicalCondition).name
              );
            });

            conditionsPerUser.push(
              {
                key: conditionPerUser.user.S,
                conditions: userConditions,
              }
            );
          });
        }

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

  var params = {
    EndpointArn: 'arn:aws:comprehend:eu-west-1:797583255773:document-classifier-endpoint/symptoms',
    Text: text,
  };

  comprehend.classifyDocument(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response

    return res.status(200).json(
      { 'data': data }
    );
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