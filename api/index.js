const express = require('express');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});
AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
});

var dynamodb = new AWS.DynamoDB();

const SALT_ROUNDS = 10;
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
        ProjectionExpression: 'password',
    };

    dynamodb.getItem(params, function (err, data) {
        if (err) {
            return res.status(500).send(err);
        } else
            if (isEmpty(data.Item)) {
                return res.status(500).send('User does not exist');
            }

            bcrypt.compare(password, data.Item['password']['S'], function(err, ret) {
                return res.status(200).json({ 'login' : ret });
            });
        }
    );
});

app.listen(PORT, () => {
  console.log('FYP listening on port ' + PORT)
});

function isEmpty(value) {
    return (value == null || value === 'undefined' || value.length === 0);
}