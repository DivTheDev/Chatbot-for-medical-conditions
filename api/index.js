const express = require('express');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });
AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
});

var dynamodb = new AWS.DynamoDB();
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
  if (isEmpty(symptoms)) {
    return res.status(500).send('Symptoms has not been provided');
  }

  var titleObject = {};
  var index = 0;
  symptoms.forEach(function(value) {
      index++;
      var titleKey = ":name"+index;
      titleObject[titleKey.toString()] = value;
  });

  console.log(titleObject);
  let params = {
    TableName: 'symptoms',
    FilterExpression : "name IN ("+Object.keys(titleObject).toString()+ ")",
    ProjectionExpression: 'id',
  };

  dynamodb.getItem(params, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      console.log(data.Item);
      if (isEmpty(data.Item)) {
        return res.status(500).send('Symptoms does not exist');
      }

      res.status(200).json(
        { data: data.Item }
      );
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