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

//
// Object to store orders
//
var orderList = [];

var orderID = 101;
var pizzaID = 101;
var toppingID = 101;

// Check ID
var isIdExists = function (id, list) {
  var isIdFound = false;

  for (var index = 0; index < list.length; index++) {
    if (list[index].id == id) {
      isIdFound = true;
      break
    }
  }

  if (isIdFound) {
    return true;
  } else {
    return false;
  }

};

router.post('/pizza', (req, res) => {
  var pizza = req.body;

  //
  // Parameter validation
  //
  if (pizza.hasOwnProperty('name') &&
      pizza.hasOwnProperty('size') &&
      pizza.hasOwnProperty('price') &&
      typeof(pizza.price) == 'number' &&
      (pizza.price > 0)) {

        var isValidPizza = true;

        if (!(pizza.hasOwnProperty('id') && typeof(pizza.id) == 'number'
            && !(isIdExists(pizza.id, pizzaList)))) {
          pizza.id = pizzaID;
          pizzaID += 1;
        }

        // Check for duplicate entries
        for (var i = 0; i < pizzaList.length; i++) {
          // Duplicate ID
          if (pizzaList[i].id == pizza.id) {
            isValidPizza = false;
            pizzaID -= 1;
            res.status(400).send('Pizza with same ID already exists');
            break;
          }

          // Duplicate Name
          if (pizzaList[i].name == pizza.name) {
            isValidPizza = false;
            pizzaID -= 1;
            res.status(400).send('Pizza with same Name already exists');
            break;
          }
        }

        // Add pizza to an existing list
        if (isValidPizza) {
          pizzaList.push(pizza);
          toppingList.push([]);

          // Set location in the header
          res.location(req.headers.host + '/v1/pizza/' + pizza.id);
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
    var idList = [];

    for (var i = 0; i < pizzaList.length; i++) {
      idList.push(pizzaList[i].id);
    }

    res.status(200).send(idList);
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
  var pizza = req.body;
  var isPizzaFound = false;
  var index = 0;

  for (index = 0; index < pizzaList.length; index++) {
    if (pizzaList[index].id == req.params.pizzaId) {
      pizza.id = pizzaList[index].id;
      isPizzaFound = true;
      break;
    }
  }

  if (isPizzaFound) {
    //
    // Parameter validation
    //
    if (pizza.hasOwnProperty('name') &&
        pizza.hasOwnProperty('size') &&
        pizza.hasOwnProperty('price') &&
        typeof(pizza.price) == 'number') {
          pizzaList[index] = pizza;
          res.status(204).send('Update Okay');
    } else {
      // parameter missing
      res.status(400).send('Invalid pizza supplied');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza not found');
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

    res.status(204).send('deleted');
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

    if (topping.hasOwnProperty('name') &&
        topping.hasOwnProperty('price') &&
        typeof(topping.price) == 'number' &&
        (topping.price > 0)) {

          if (!(topping.hasOwnProperty('id') && typeof(topping.id) == 'number'
              && !(isIdExists(topping.id, toppingList)))) {
            topping.id = toppingID;
            toppingID += 1;
          }

          toppingList[index].push(topping);
          pizzaList[index].price += topping.price;

          // Set location in the header
          res.location(req.headers.host + '/v1/pizza/' + req.params.pizzaId  + '/topping/' + topping.id);
          res.status(201).send('Created new Topping for pizza');
    } else {
      // parameter missing
      res.status(400).send('Invalid input');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza not found');
  }
});

//
// Get toppings of a pizza by ID
//
router.get('/pizza/:pizzaId/topping', (req, res) => {
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
    if (toppingList[index].length === 0) {
      res.status(400).send('No toppings found');
    } else {
      var idList = [];

      for (var i = 0; i < toppingList[index].length; i++) {
        idList.push(toppingList[index][i].id);
      }

      res.status(200).send(idList);
    }
  } else {
    // No pizza found
    res.status(404).send('Specified pizza id not found');
  }
});

//
// Get toppings of a pizza by ID (including toppingsId)
//
router.get('/pizza/:pizzaId/topping/:toppingId', (req, res) => {
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
    var isToppingFound = false;

    for (var i = 0; i < toppingList[index].length; i++) {
      if (toppingList[index][i].id == req.params.toppingId) {
        isToppingFound = true;
        res.status(200).send(toppingList[index][i]);
        break;
      }
    }

    if (!isToppingFound) {
      res.status(404).send('Pizza or Topping not found');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza or Topping not found');
  }
});

//
// Delete toppings of a pizza by ID (including toppingsId)
//
router.delete('/pizza/:pizzaId/topping/:toppingId', (req, res) => {
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
    var isToppingFound = false;

    for (var i = 0; i < toppingList[index].length; i++) {
      if (toppingList[index][i].id == req.params.toppingId) {
        isToppingFound = true;
        pizzaList[index].price -= toppingList[index][i].price;

        // Delete topping
        toppingList[index].splice(i, 1);

        res.status(204).send('Deleted');
        break;
      }
    }

    if (!isToppingFound) {
      res.status(404).send('Pizza or Topping not found');
    }
  } else {
    // No pizza found
    res.status(404).send('Pizza or Topping not found');
  }
});

//
// Delete toppings of a pizza by ID (including toppingsId)
//
router.post('/order', (req, res) => {
  var order = req.body;

  //
  // Parameter validation
  //
  if (order.hasOwnProperty('orderItems') &&
      typeof(order.orderItems) == 'object' &&
      order.hasOwnProperty('recipient') &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(order.recipient)) {

        if (!(order.hasOwnProperty('id') && typeof(order.id) == 'number'
            && !(isIdExists(order.id, orderList)))) {
          // assign ID
          order.id = orderID;
          orderID += 1;
        }

        // Calculat total price
        order.totalPrice = 0;

        var isValidOrder = true;

        for (var i = 0; i < order.orderItems.length; i++) {
          var inputID = order.orderItems[i].pizzaId;

          for (var index = 0; index < pizzaList.length; index++) {
            if (pizzaList[index].id == inputID) {
              break;
            }
          }

          if (index == pizzaList.length) {
            isValidOrder = false;
            orderID -= 1;
          } else {
            var pizzaPrice = 0;
            pizzaPrice += pizzaList[index].price;

            if (order.orderItems[i].hasOwnProperty('quantity')) {
              order.totalPrice += (pizzaPrice * order.orderItems[i].quantity);
            } else {
              isValidOrder = false;
              orderID -= 1;
            }
          }
        }

        if (isValidOrder) {
          orderList.push(order);

          // Set location in the header
          res.location(req.headers.host + '/v1/order/' + order.id);
          res.status(201).send('Created new order');
        } else {
          // parameter invalid
          res.status(400).send('Invalid pizza ID');
        }

  } else {
    // parameter missing
    res.status(400).send('Invalid order');
  }
});

//
// Get pizza list
//
router.get('/order', (req, res) => {
  if (orderList.length === 0) {
    // No pizzas
    res.status(404).send('No orders found');
  } else {
    var idList = [];

    for (var i = 0; i < orderList.length; i++) {
      idList.push(orderList[i].id);
    }

    res.status(200).send(idList);
  }
});

//
// Get pizza list by id
//
router.get('/order/:orderId', (req, res) => {
  var isOrderFound = false;
  var index = 0;

  for (index = 0; index < orderList.length; index++) {
    if (orderList[index].id == req.params.orderId) {
      isOrderFound = true;
      break;
    }
  }

  if (isOrderFound) {
    // Delete order
    res.status(200).send(orderList[index]);
  } else {
    // No order found
    res.status(404).send('Order not found');
  }
});

//
// Delete toppings of a pizza by ID (including toppingsId)
//
router.delete('/order/:orderId', (req, res) => {
  var isOrderFound = false;
  var index = 0;

  for (index = 0; index < orderList.length; index++) {
    if (orderList[index].id == req.params.orderId) {
      isOrderFound = true;
      break;
    }
  }

  if (isOrderFound) {
    // Remove order
    orderList.splice(index, 1);

    // Delete order
    res.status(204).send('Deletion successful');
  } else {
    // No order found
    res.status(404).send('Order not found');
  }
});

module.exports = router;
