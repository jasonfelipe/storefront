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
    console.log(
        '\nHello, welcome to the shop!\nThis is what we have in stock!' 
    );
    showStock();
    purchaseItem();

});

var showStock = function (){
    connection.query('SELECT * FROM products', function (err, res){
        for (var i = 0; i < res.length; i++){
            console.log('\nID' + '        | ' + 'Product Name' + '        | ' + 'Department Name')
            console.log(res[i].item_id + "         | " + res[i].product_name + ' | ' + res[i].department_name)
        }
    });
}

var purchaseItem = function (){
    connection.query("SELECT * FROM products", function (err, res) {
        console.log(res);
        inquirer.prompt({
            name: 'choice',
            type: 'rawlist',
            choices: function (value) {
                var choiceArray = [];

                //Takes the response array, loops them, and them pushes it into the choices array.
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            },
            message: "What would you like to purchase?"

            //Remember, 'answer' is the inquire answers the user made and is an object.
        }).then(function (answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {

                    //Once we chose an auction we store it here.
                    var chosenItem = res[i];

                    //And then we prompt them again.
                    inquirer.prompt({
                        name: 'purchase',
                        type: 'input',
                        message: "How much would you like to purchase?",

                        //checks if input is a number
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {

                        //checks if the input number is less than than the current highest bid
                        if (chosenItem.stock_quantity > parseInt(answer.purchase)) {

                            //if it's higher than the database is updated
                            connection.query('UPDATE auctions SET ? WHERE ?', [{
                                highestbid: chosenItem.stock_quantity - answer.purchase 
                            }, {
                                item_id: chosenItem.id
                            }], function (err, res) {
                                console.log("Purchase successfully placed!");
                                purchaseItem();
                            });
                        } else {
                            console.log("Sorry we don't have enough... Try again...");
                            purchaseItem();
                        }
                    })
                }
            }
        });
    });
}