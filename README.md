# Bamazon Storefront
An amazon-like storefront using Node.js and MYSQL. 

Has two files, bamazonCustomer.js and bamazonManager.js 

bamazonCustomer.js, is our customer app where items can be seen and purchased. 
bamazonManager.js, is our manager app where items can be deleted, updated (adding or removing stock), or adding new items. 


## Getting Started
Please have your own MYSQL database to use this app. 

Please name your MYSQL database 'bamazon' and put in your existing details in... Example: 

```.js```` 

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "WHATEVER_THE_USER",
    password: 'YOUR_PASSWORD',
    database: 'bamazon'

}); 

Make sure your database has values or add items with manager app. 
Once you have the database in the js files, you can run either files with node. 

# USAGE OF THE APPS ARE ALSO SHOWN IN SCREENSHOTS!

## Prerequisites 

You will need node.js and a MYSQL database in order to run the app. 
The following NPM packages must be installed as well. 

mysql - for the script to connect with your database.
inquirer - for the easy UI. 
table - for clean and easy to read tables. 


### Version
1.00 

Some bugs/Problems that need to be addressed: 
Tables are looped, and individual products are shown in separate tables. 
Inquirer has a weird bug where the question is at the top until a key is pressed and it shows in the bottom. 

### Authors

#### Jason Felipe 

* github page - https://github.com/jasonfelipe 

* linkedin page - https://www.linkedin.com/in/jason-felipe-089558107/ 



### Acknowledgements
Thanks to the 2018 UA Bootcamp!






