var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'root',
    database: 'bamazon'

});

connection.connect(function (err) {
    console.log("Connected as id: " + connection.threadId);
    connection.end();
});