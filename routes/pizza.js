const express = require('express');
const router = express.Router();

//
// List of pizzas
//
var pizzaList = [];

//
// Object to store toppings of each pizza
//
var toppingList = [];

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
        for (var i = 0; i < pizzaList.length; i++) {
          // Duplicate ID
          if (pizzaList[i].id == pizza.id) {
            isValidPizza = false;
            res.status(400).send('Pizza with same ID already exists');
            break;
          }

          // Duplicate Name
          if (pizzaList[i].name == pizza.name) {
            isValidPizza = false;
            res.status(400).send('Pizza with same Name already exists');
            break;
          }
        }

        // Add pizza to an existing list
        if (isValidPizza) {
          pizzaList.push(pizza);
          toppingList.push(null);
          res.status(201).send('Created new pizza');
        }

  } else {
    // parameter missing
    res.status(400).send('Invalid input');
  }
});

//
// Get pizza list
//
router.get('/pizza', (req, res) => {
  if (pizzaList.length === 0) {
    // No pizzas
    res.status(404).send('No pizzas exists');
  } else {
    res.status(200).send(pizzaList);
  }
});

//
// Get pizza by ID
//
router.get('/pizza/:pizzaId', (req, res) => {
  var isPizzaFound = false;
  var index = 0;

  for (index = 0; index < pizzaList.length; index++) {
    if (pizzaList[index].id == req.params.pizzaId) {
      isPizzaFound = true;
      break;
    }
  }

  if (isPizzaFound) {
    // Pizza found
    res.status(200).send(pizzaList[index]);
  } else {
    // No pizza found
    res.status(404).send('Pizza could not be found');
  }
});

//
// Update pizza by ID
//
router.put('/pizza/:pizzaId', (req, res) => {
  var isPizzaFound = false;
  var index = 0;

  for (index = 0; index < pizzaList.length; index++) {
    if (pizzaList[index].id == req.params.pizzaId) {
      isPizzaFound = true;
      break;
    }
  }

  if (isPizzaFound) {
    // Pizza found
    var pizza = req.body;

    //
    // Parameter validation
    //
    if (pizza.hasOwnProperty('id') &&
        pizza.hasOwnProperty('name') &&
        pizza.hasOwnProperty('size') &&
        pizza.hasOwnProperty('price')) {
          pizzaList[index] = pizza;
          res.status(204).send('Update Okey');
    } else {
      // parameter missing
      res.status(400).send('Invalid pizza supplied');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza could not be found');
  }
});

//
// Delete pizza by ID
//
router.delete('/pizza/:pizzaId', (req, res) => {
  var isPizzaFound = false;
  var index = 0;

  for (index = 0; index < pizzaList.length; index++) {
    if (pizzaList[index].id == req.params.pizzaId) {
      isPizzaFound = true;
      break;
    }
  }

  if (isPizzaFound) {
    // Pizza found
    pizzaList.splice(index, 1);

    // Remove toppings
    toppingList.splice(index, 1);

    res.status(204).send('Deleted');
  } else {
    // No pizza found
    res.status(404).send('Pizza not found');
  }
});

//
// Add toppings
//
router.post('/pizza/:pizzaId/topping', (req, res) => {
  var isPizzaFound = false;
  var index = 0;

  for (index = 0; index < pizzaList.length; index++) {
    if (pizzaList[index].id == req.params.pizzaId) {
      isPizzaFound = true;
      break;
    }
  }

  if (isPizzaFound) {
    // Pizza found
    var topping = req.body;

    if (topping.hasOwnProperty('id') &&
        topping.hasOwnProperty('name') &&
        topping.hasOwnProperty('price')) {
          toppingList[index] = topping;
          res.status(204).send('Created new Topping for pizza');
    } else {
      // parameter missing
      res.status(400).send('Invalid input');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza not found');
  }
});

module.exports = router;
