const smoothies = document.querySelectorAll(".smoothie");
//store smoothie names
const smoothieNames = [];
// store items in the shopping cart
let cartItems = [];

//get title ; set background image for each smoothie
let count = 0;
smoothies.forEach(function (smoothie) {
  let titleElement = smoothie.querySelector("h2");
  if (titleElement) {
    let smoothieTitle = titleElement.textContent;
    smoothieNames.push(smoothieTitle);
  }
  count++;
  smoothie.style.backgroundImage = "url('../imgs/smoothie-svgrepo-com (${count}).svg')";
});

//radio buttons for lactose free and iced
const radioButtons = document.querySelectorAll("input[type='radio']");
const lactoseFreeRadios = document.querySelectorAll(
  "input[type='radio'][value='lactose free']"
);
const icedRadios = document.querySelectorAll(
  "input[type='radio'][value='iced']"
);

// assign each radio a unique name
radioButtons.forEach(function (radio) {
  let index;
  if (radio.value === "lactose free") {
    index = Array.from(lactoseFreeRadios).indexOf(radio);

    let newName = radio.getAttribute("name") + index;
    radio.setAttribute("name", newName);
  } else if (radio.value === "iced") {
    index = Array.from(icedRadios).indexOf(radio);
    let newName = radio.getAttribute("name") + index;
    radio.setAttribute("name", newName);
  }

  //toggle radio btns
  let old = null;
  if (radio.checked) {
    old = radio;
  }
  radio.addEventListener("click", function () {
    if (radio === old) {
      radio.checked = false;
      old = null;
    } else {
      old = radio;
    }
  });
});

//enable - + buttons to add subtract the number of products
smoothies.forEach((menuItem) => {
  menuItem.querySelector(".order-total").textContent = 0;
  menuItem.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("order-dec") ||
      event.target.parentElement.classList.contains("order-dec")
    ) {
      changeNumber(menuItem, "dec");
    } else if (
      event.target.classList.contains("order-add") ||
      event.target.parentElement.classList.contains("order-add")
    ) {
      changeNumber(menuItem, "add");
    }
  });
});

//  ensure the display of quantity
function changeNumber(menuItem, method) {
  let quantity = parseInt(menuItem.querySelector(".order-total").textContent);
  let price = parseFloat(
    menuItem.querySelector(".price").textContent.replace("$", "")
  );

  if (method === "dec" && quantity > 0) {
    quantity--;
    menuItem.querySelector(".order-total").textContent = quantity;
  } else if (method === "add") {
    quantity++;
    menuItem.querySelector(".order-total").textContent = quantity;
  }

  menuItem.querySelector(".sum").textContent = "$" + quantity * price;
}

// Create a class for the Smoothie object
class Smoothie {
  name;
  price;
  quantity;
  isIce;
  isLactoseFree;

  constructor(name, price, quantity, isIce, isLactoseFree) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.isIce = isIce;
    this.isLactoseFree = isLactoseFree;
  }
  // didn't use it
  describe() {
    return `you ordered ${this.quantity} of ${this.name}, 
    iced : ${this.isIce}, lactose free : ${this.isLactoseFree}, 
    it's ${this.price * this.quantity} $ in total.`;
  }
}

//Add to cart function:
//check whether items already existed in cart, if it is then add numbers
//check whether the number of products >0
//display table to show the details of shopping cart items
//display reset button
function addToCart(cartBtn) {
  let index = Array.from(cartBtns).indexOf(cartBtn);
  let smoothieName = smoothieNames[index];
  let quantity = parseInt(
    cartBtn.parentNode.querySelector(".price-calc .order-total").innerText
  );
  let icedOrNot = !!cartBtn.parentNode.querySelector(".icedOrNot input").checked;
  let lactoseFreeOrNot = !!cartBtn.parentNode.querySelector(
      ".lactoseFreeOrNot input"
  ).checked;
  let price = parseFloat(
    cartBtn.parentNode.querySelector(".sum").textContent.replace("$", "")
  );
  if (quantity > 0) {
    let existingSmoothie = cartItems.find(
      (item) =>
        item.name === smoothieName &&
        item.isIce === icedOrNot &&
        item.isLactoseFree === lactoseFreeOrNot
    );

    if (existingSmoothie) {
      let singlePrice = existingSmoothie.price / existingSmoothie.quantity;

      existingSmoothie.quantity =
        parseInt(existingSmoothie.quantity) + quantity;
      existingSmoothie.price = singlePrice * existingSmoothie.quantity;
      console.log("single price : " + singlePrice);
    } else {
      let smoothie = new Smoothie(
        smoothieName,
        price,
        quantity,
        icedOrNot,
        lactoseFreeOrNot
      );
      cartItems.push(smoothie);
    }
    document.body.appendChild(resetBtn);
  } else {
    alert("quantity cannot be zero, try again");
  }
}

// add "add to cart function" to "add to cart" button
const cartBtns = document.querySelectorAll(".btn");

cartBtns.forEach((btn) => {
  let index = Array.from(cartBtns).indexOf(btn);
  btn.setAttribute("name", "(cart)" + smoothieNames[index]);

  btn.addEventListener("click", () => {
    addToCart(btn);
    displayItemsInCart();
  });
});

//bug need to be fixed
//display items in the shopping cart function
function displayItemsInCart() {
  let table = document.querySelector("table");
  if (!table) {
    table = document.createElement("table");
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const header = ["Name", "Price", "Quantity", "Iced", "Lactose Free", "Sum"];

    header.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
    document.body.appendChild(table);
  }
  let existingBody = table.querySelector("tbody");
  if (existingBody) {
    existingBody.remove();
  }
  const keys = [
    "name",
    "single price",
    "quantity",
    "isIce",
    "isLactoseFree",
    "price",
  ];
  const tableBody = document.createElement("tbody");
  cartItems.forEach((smoothie) => {
    const row = document.createElement("tr");
    keys.forEach((key) => {
      const cell = document.createElement("td");
      //calculate the single price
      if (key === "single price") {
        cell.textContent = "" + smoothie["price"] / smoothie["quantity"];

        row.appendChild(cell);
        //display yes or no
      } else if (key === "isIce" || key === "isLactoseFree") {
        cell.textContent = smoothie[key] === true ? "Yes" : "No";
        row.appendChild(cell);
      } else {
        cell.textContent = smoothie[key];
        row.appendChild(cell);
      }
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
}

//checkout btn for calculating the total amount
const checkoutBtn = document.querySelector(".checkout button");
checkoutBtn.addEventListener("click", () => {
  let tableBody = document.querySelector("tbody");
  if (tableBody) {
    let rows = tableBody.getElementsByTagName("tr");
    //index of the price column
    let columnIndex = 5;
    let totalAmount = 0;
    for (let i = 0; i < rows.length; i++) {
      let cells = rows[i].getElementsByTagName("td");
      let cellValue = parseFloat(cells[columnIndex].textContent);
      totalAmount += cellValue;
    }
    //display a 'thank you' mes
    if (document.querySelector(".thankYouMes")) {
      document.querySelector(".thankYouMes").remove();
    }
    const p = document.createElement("p");
    p.classList.add("thankYouMes");
    p.textContent = `Its ${totalAmount}, thank you!`;
    document.body.insertBefore(p, resetBtn);
    cartItems = [];
  }
});

//add reset button and reset function
const resetBtn = document.createElement("button");
resetBtn.textContent = "reset";
resetBtn.name = "resetBtn";
resetBtn.addEventListener("click", reset);
function reset() {
  cartItems = [];
  let tableBody = document.querySelector("tbody");
  if (tableBody) {
    displayItemsInCart();
  }
  document.querySelector(".thankYouMes").remove();
}
