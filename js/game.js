const TARGET = 10; 

const NAMES  = ["Maya", "Theo", "June", "Noah", "Ava", "Liam", "Zoe", "Ben", "Isla", "Leo"];
const DRINKS = ["Oat latte", "Cappuccino", "Matcha"];
const SKINS  = ["#A86B4A", "#E0A07F", "#7A4A2A", "#C98B65", "#8D5A3B"];
const HAIRS  = ["#8A6A4F", "#8A4A3A", "#8A7A2A", "#4A5A3A", "#6B5A7A", "#5A4034"];
const SHIRTS = ["#3F6F85", "#E0705A", "#D9AE3A", "#7A9468", "#8A6FA8", "#D98567"];

const DRINK_ICONS = {
  "Oat latte": "assets/icons-for-queue/oat-latte.svg",
  "Cappuccino": "assets/icons-for-queue/cappuccino.svg",
  "Matcha": "assets/icons-for-queue/macha.svg"
};

let queue = [];  
let customerNo = 100;  
let served = 0;

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function enqueue() {
  if (gameOver) {
    showMessage("Shift complete! Click Reset to play again.", "success");
    return;
  }

  customerNo++;   
  const customer = {
    number: customerNo,
    name: randomItem(NAMES),
    order: randomItem(DRINKS),
    skin: randomItem(SKINS),
    hair: randomItem(HAIRS),
    shirt: randomItem(SHIRTS)
  };

  queue.push(customer);
  showMessage(customer.name + " (#" + customer.number + ") joined the line.", "");
  render();
}

function dequeue() {
  return queue.shift();
}

function peek() {
  if (queue.length === 0) {
    return null;
  }
  return queue[0];
}

// Player clicked a drink button
function serveDrink(drink) {
  if (gameOver) {
    showMessage("Shift complete! Click Reset to play again.", "success");
    return;
  }

  const front = peek();

  // can't serve an empty queue
  if (front === null) {
    showMessage("No customers waiting. Click Add customer first.", "error");
    return;
  }

  // wrong drink: the customer stays in the line
  if (drink !== front.order) {
    showMessage("Wrong drink! " + front.name + " wants " + front.order + ".", "error");
    return;
  }

  // correct drink: serve the earliest customer
  dequeue();
  served++;
  showMessage("Served " + front.name + "'s " + front.order + "!", "success");
  checkWin();
  render();
}

// Check if the player served 10 customers
function checkWin() {
  if (served >= TARGET) {
    gameOver = true;
    showMessage("You win! You served " + TARGET + " customers.", "success");
  }
}

// Start over
function reset() {
  queue = [];
  customerNo = 100;
  served = 0;
  gameOver = false;
  showMessage('Click "Add customer" to start.', "");
  render();
}

// ===== SCREEN UPDATES =====

// Show a message ("error", "success" or "" for normal)
function showMessage(text, type) {
  $("#message").removeClass("message-error message-success");
  if (type) {
    $("#message").addClass("message-" + type);
  }
  $("#message").text(text);
}

// Update everything on the screen
function render() {
  renderCounter();
  renderUpNext();
  renderQueue();
  renderStats();
}

// The customer at the counter (front of the queue)
function renderCounter() {
  const front = peek();

  if (front) {
    $("#nowServing").text("#" + front.number + " · " + front.name);
    $("#orderText").text(front.order);
    $("#ticketBadge").text("#" + front.number);

    $(".customer-focus .avatar-hair").css("background", front.hair);
    $(".customer-focus .avatar-head").css("background", front.skin);
    $(".customer-focus .avatar-body").css("background", front.shirt);

    $(".customer-focus, .order-bubble, .ticket-badge").removeClass("empty");
  } else {
    $("#nowServing").text("No guests waiting");
    $("#orderText").text("No customer yet");
    $(".customer-focus, .order-bubble, .ticket-badge").addClass("empty");
  }
}
// Customer Preview
function renderUpNext() {
  const next = queue[1];

  if (next) {
    $("#upNext").text("#" + next.number);
    $("#upNextName").text(next.name);
    $("#nextHair").css("background", next.hair);
    $("#nextHead").css("background", next.skin);
    $("#nextBody").css("background", next.shirt);
  } else {
    $("#upNext").text("None");
    $("#upNextName").text("No one yet");
  }
}

// Waiting line
function renderQueue() {
  $("#queueLine").empty();

  for (let i = 0; i < queue.length; i++) {
    const c = queue[i];
    const isFront = (i === 0);
    const subText = isFront ? "At counter · first" : "Position " + (i + 1);

    $("#queueLine").append(`
      <div class="queue-item ${isFront ? "front" : ""}">
        <span class="ticket-pill">#${c.number}</span>
        <div class="avatar">
          <span class="avatar-hair" style="background: ${c.hair};"></span>
          <span class="avatar-head" style="background: ${c.skin};"></span>
          <span class="avatar-body" style="background: ${c.shirt};"></span>
        </div>
        <div class="queue-info">
          <strong>${c.name}</strong>
          <small>${subText}</small>
        </div>
        <span class="drink-icon"><img src="${DRINK_ICONS[c.order]}" alt=""></span>
      </div>
    `);
  }
}

// Progress ring
function renderStats() {
  $("#queueCount").text(queue.length);
  $("#waitingCount").text(queue.length);
  $("#servedCount").text(served);
  $("#totalServed").text(served);

  const left = TARGET - served;
  if (left > 0) {
    $("#goalText").text(left + (left === 1 ? " guest" : " guests") + " to go");
  } else {
    $("#goalText").text("Shift complete!");
  }


  const percent = (served / TARGET) * 100;
 // ring fill function
  $("#ringFill").css("stroke-dashoffset", 333 - (served / TARGET) * 333);
}



// ===== START =====
$(document).ready(function () {
  $("#addBtn").click(enqueue);
  $("#resetBtn").click(reset);

  $(".drink-btn").click(function () {
    serveDrink($(this).data("drink"));
  });

  render();
});