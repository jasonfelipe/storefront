var mysql = require('mysql');
var inquirer = require('inquirer');

//For cleaner tables
var { table } = require('table');


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
        '\nHello, welcome to the shop!\nThis is what we have in stock!\n'
    );
    showStock();
    purchaseItem();

});


//Shows the stock
var showStock = function () {
    connection.query('SELECT * FROM products', function (err, res) {

        // let config,
        //     data,
        //     output;
        // data = [
        //     ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
        //     []
        // ];
        // config = {
        //     columns: {
        //         1: {
        //             width: 20,
        //             wordWrap: true
        //         }
        //     }
        // };

        // output = table(data, config);
        // console.log(output);

        res.forEach(function (i) {
            let id = i.item_id,
                product = i.product_name,
                department = i.department_name,
                price = i.price,
                quantity = i.stock_quantity;


            let config,
                data,
                output;
            data = [
                ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
                [id, product, department, price, quantity]
            ];
            config = {
                columns: {
                    1: {
                        width: 20,
                        wordWrap: true
                    }
                }
            };

            output = table(data, config);
            console.log(output);

            // data[1][0].push(id);
            // data[1][1].push(product);
            // data[1][2].push(department);
            // data[1][3].push(price);
            // data[1][4].push(quantity);

            // console.log(id + '|' + product + '|' + department + '|' + price + '|' + quantity + "\n");

        });


    });

}


//Purchase Item 
var purchaseItem = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt({
            name: 'choice',
            type: 'rawlist',
            choices: function () {
                var choiceArray = [];

                //Takes the response array, loops them, and them pushes it into the choices array.
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            },
            message: "What would you like to purchase? (Input Item ID)"

            //Remember, 'answer' is the inquire answers the user made and is an object.
        }).then(function (chosenProduct) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == chosenProduct.choice) {

                    //Once we chose a product we store it here.
                    var chosenItem = res[i];

                    //And then we prompt them again.
                    inquirer.prompt({
                        name: 'quantity',
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
                    }).then(function (purchasedQuantity) {
                        //checks if the input number is less or equal than the current stock
                        if (chosenItem.stock_quantity >= parseInt(purchasedQuantity.quantity)) {
                            //asks for confirmation
                            inquirer.prompt({
                                name: 'confirm',
                                type: 'confirm',
                                message: 'Are you sure you want to buy ' + purchasedQuantity.quantity + " " + chosenItem.product_name + "(s)?"
                            }).then(function (confirmation) {
                                if (confirmation.confirm) {
                                    parsedPurchase = parseInt(purchasedQuantity.quantity);




                                    //Added code please make this work.
                                    connection.query('SELECT * FROM products WHERE ?', {
                                        item_id: chosenProduct.choice
                                    }, 
                                    function(err,res){
                                        console.log(
                                            "\n\nYour Current Order is: " + 
                                            "\nProduct Name: " +chosenItem.product_name +
                                            "\nQuantity: " + parsedPurchase +
                                            "\n\nTOTAL PRICE: " + chosenItem.price * parsedPurchase
                                        );
                                    });
                                    inquirer.prompt({
                                        name: 'finalConfirm',
                                        type: 'confirm',
                                        message: '\nPlease confirm your purchase.'
                                    }).then(function(updateDatabase){
                                        //end added code



                                        if(updateDatabase.finalConfirm){
                                                //Updates our stock
                                                connection.query('UPDATE products SET ? WHERE ?', [{
                                                    stock_quantity: chosenItem.stock_quantity -= parsedPurchase
                                                }, {
                                                    item_id: chosenItem.item_id
                                                }], function (err, res) {
                                                    showStock();
                                                    purchaseItem();
                                                    console.log("\nPurchase successful!\n");
                                                });
                                        }
                                        else{
                                            console.log("Backing out of purchase...")
                                            purchaseItem();
                                        }
                                    });
                                }
                                else {
                                    console.log("Backing out of purchase...")
                                    purchaseItem();
                                }
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
                                    