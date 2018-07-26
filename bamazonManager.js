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
    showStock();
    editStock();

});

const showStock = function () {
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

const editStock = function () {
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
            message: "What would you like to edit? (Input Item ID)"

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
                        message: "How much would you like to add or subtract?",

                        //checks if input is a number
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (editedQuantity) {

                        //asks for confirmation
                        inquirer.prompt({
                            name: 'confirm',
                            type: 'confirm',
                            message: 'Are you sure you want to put ' + editedQuantity.quantity + " into " + chosenItem.product_name + "(s)?"
                        }).then(function (confirmation) {

                            //if confirmation is yes
                            if (confirmation.confirm) {

                                //checks if there is enough stock.
                                if (parseInt(editedQuantity.quantity) + parseInt(chosenItem.stock_quantity) < 0) {
                                    console.log(
                                        "Error: Not enough stock to take!\n" +
                                        "Backing out of edit...\n"
                                    );
                                    editStock();
                                } else {
                                    parsedNumber = parseInt(editedQuantity.quantity);

                                    //Updates our stock
                                    connection.query('UPDATE products SET ? WHERE ?', [{
                                        stock_quantity: chosenItem.stock_quantity += parsedNumber
                                    }, {
                                        item_id: chosenItem.item_id
                                    }], function (err, res) {
                                        showStock();
                                        editStock();
                                        console.log("\nEdit successful!\n");
                                    });

                                }
                            }
                            //if confirmation is no.
                            else {
                                console.log("Backing out of edit...")
                                editStock();
                            }
                        });



                    })
                }
            }
        });
    });
}
