//DATA MODULE
var budgetModule = (function(){
   // some code
   //custom datatypes function constructor because of we have lot of expenses and incomes

   var Expenses = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value =  value;
   }
   var Income = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value =  value;
   }
   // calculate total
   var calculateTotal = function(type){
     var sum = 0;

     data.allItems[type].forEach(function(curr){
       sum += curr.value;
     })
     data.totals[type] = sum
   };
   //data structure

   var data = {
     allItems: {
       exp: [],
       inc: []
     },
     totals: {
       expenses: 0,
       income: 0
     },
     budget: 0,
     percentage: -1
 }


 return {
   addItem: function(type, des, val) {
     var newItem, id;
     // create neew ID
     if (data.allItems[type].length > 0) {
       id = data.allItems[type][data.allItems[type].length - 1].id + 1;
     } else {
       id = 0;
     }


     // create new item based on 'inc' or exp type
     if (type === 'exp') {
       newItem = new Expenses(id, des, val)
     }else if (type === 'inc') {
       newItem = new Income(id, des, val)
     }

     // Push it into the data structure
     data.allItems[type].push(newItem)

     //return the new element
     return newItem;

   },
   calculateBudget: function(){
     // calculate total income and expenses
     calculateTotal('exp');
     calculateTotal('inc');

     // calculate the budget: income - expenses
     data.budget = data.totals.income - data.totals.expenses
     // calculate the percentage of the income that we spent
     data.percentage = Math.round((data.totals.expenses / data.totals.income) * 100)

   },
   getBudget: function(){
     return {
       budget: data.budget,
       totalIncome: data.totals.income,
       totalExpenses: data.totals.expenses,
       percentage: data.percentage
     }
   },
   testing: function(){
     console.log(data);
   }
 };

}) ();

// UI MODULE
var uiModule = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }
  // returning input value to the UI is public
  return {
    // a public method
    getInput: function() {
      //methods for values to return at the same time
      return{
         type : document.querySelector(DOMstrings.inputType).value, // value = inc || exp;
         description : document.querySelector(DOMstrings.inputDescription).value,
         value : parseFloat (document.querySelector(DOMstrings.inputValue).value),
      }

    },
    addListItem: function(obj, type){

      var html, newHtml, element;
      //create HTML strings with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      }
      else if(type === 'exp' ) {

        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }


      // replace the placeholder text with the actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

      //insert HTML into the DOM using adjacentHTML


    },
    clearFIelds: function(){
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +  DOMstrings.inputValue)

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";

      })
      fieldsArray[0].focus();    // focusing back to the first field
    },
    getDOMstrings: function() {
      return DOMstrings;
    }

  }
})();


// CONTROLLER MODULE
var controller = (function(budgetCtrl, uiCtrl) {

  var setupEventListener = function() {
    var DOM = uiCtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem) //call back
    // enter key event listener
    document.addEventListener('keypress', function(event){

      if(event.keycode === 13 || event.which === 13){
        controlAddItem();
    inputButton: '.add__btn'
  }
  // returning input value to the UI is public
  return {
    // a public method
    getInput: function() {
      //methods for values to return at the same time
      return{
         type : document.querySelector(DOMstrings.inputType).value, // value = inc || exp;
         description : document.querySelector(DOMstrings.inputDescription).value,
         value : document.querySelector(DOMstrings.inputValue).value
      }

    },
    getDOMstrings:   function() {
      return DOMstrings;
    }
      }
    })
  }

  var updateBudget = function (){
    // 1. calculate the budget
    budgetCtrl.calculateBudget()

    // 2. returns the budget
    budgetCtrl.getBudget();


    //3. display the budget on the UI
    console.log(budgetCtrl.getBudget());
  }

  var controlAddItem = function (){
    // 1. get input data
    var input = uiCtrl.getInput(); // communicating with the getInput method in the ui module


    if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
      // 2. add item to budiget controller
      var newItem = budgetCtrl.addItem(input.type, input.description, input.value)

      // 3. add itenm to ui
      var addNewItem = uiCtrl.addListItem(newItem, input.type)
      // 4. clear the fi9elds
      uiCtrl.clearFIelds();

      // calcuate and update budget
      updateBudget()
    }

  }

  return {
    init: function(){
      console.log("Start Application");
      setupEventListener();
    }
  }

}) (budgetModule, uiModule);

controller.init();
