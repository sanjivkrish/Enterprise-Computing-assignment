const express = require('express');
const router = express.Router();

//
// List of pizzas
//
var pizzaOrderList = [];

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/pizza', (req, res) => {
  var pizza = req.body;

  //
  // Parameter validation
  //
  if (pizza.hasOwnProperty('id') &&
      pizza.hasOwnProperty('name') &&
      pizza.hasOwnProperty('size') &&
      pizza.hasOwnProperty('price')) {

        var isValidPizza = true;

        // Check for duplicate entries
        for (var i = 0; i < pizzaOrderList.length; i++) {
          // Duplicate ID
          if (pizzaOrderList[i].id == pizza.id) {
            isValidPizza = false;
            res.status(401).send('Pizza with same ID already exists');
            break;
          }

          // Duplicate Name
          if (pizzaOrderList[i].name == pizza.name) {
            isValidPizza = false;
            res.status(401).send('Pizza with same Name already exists');
            break;
          }
        }

        // Add pizza to an existing list
        if (isValidPizza) {
          pizzaOrderList.push(pizza);
          res.status(201).send('Created new pizza');
        }

  } else {
    // parameter missing
    res.status(400).send('Invalid input');
  }
});

module.exports = router;
