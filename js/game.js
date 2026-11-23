const TARGET = 10; 

const NAMES  = ["Maya", "Theo", "June", "Noah", "Ava", "Liam", "Zoe", "Ben", "Isla", "Leo"];
const DRINKS = ["Oat latte", "Cappuccino", "Matcha"];
const SKINS  = ["#A86B4A", "#E0A07F", "#7A4A2A", "#C98B65", "#8D5A3B"];
const HAIRS  = ["#8A6A4F", "#8A4A3A", "#8A7A2A", "#4A5A3A", "#6B5A7A", "#5A4034"];
const SHIRTS = ["#3F6F85", "#E0705A", "#D9AE3A", "#7A9468", "#8A6FA8", "#D98567"];
const CONFETTI_COLORS = ["#E58B6F", "#2F5D50", "#D9AE3A", "#3F6F85", "#8A6FA8", "#7A9468"];

const DRINK_ICONS = {
  "Oat latte": "assets/icons-for-queue/oat-latte.svg",
  "Cappuccino": "assets/icons-for-queue/cappuccino.svg",
  "Matcha": "assets/icons-for-queue/macha.svg"
};

let queue = [];
let customerNo = 100;
let served = 0;
let gameOver = false;
let totalWait = 0;
let counterStart = 0;

function launchConfetti() {
  const box = $("#confetti");
  box.empty();

  for (let i = 0; i < 70; i++) {
    const piece = $('<span class="confetti-piece"></span>');
    piece.css({
      left: Math.random() * 100 + "%",
      background: randomItem(CONFETTI_COLORS),
      width: 6 + Math.random() * 8 + "px",
      height: 10 + Math.random() * 10 + "px",
      animationDuration: 2.5 + Math.random() * 2.5 + "s",
      animationDelay: Math.random() * 1.2 + "s"
    });
    piece[0].style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
    box.append(piece);
  }
}

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
    shirt: randomItem(SHIRTS),
    arrivedAt: Date.now()
  };

  queue.push(customer);
    if (queue.length === 1) {   
      counterStart = Date.now();
    }
    
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


  const waited = Math.round((Date.now() - front.startedAt) / 1000); 
  totalWait += waited;
  showMessage("Served " + front.name 
    + "'s " + front.order + "! waited " 
    + formatTime(waited) + ".", "success");

  checkWin();
  render();
}

// Check if the player served 10 customers
function checkWin() {
  if (served >= TARGET) {
    gameOver = true;
    const average = Math.round(totalWait / TARGET);

    $("#winScreen").addClass("show");
    launchConfetti();     
    $("#winServed").text(TARGET);
    $("#winAverage").text(formatTime(average));
    setTimeout(function () {
      $("#winScreen").addClass("show");
    }, 600);
  }
}

// Start over
function reset() {
  queue = [];
  customerNo = 100;
  served = 0;
  gameOver = false;
  totalWait = 0;
  $("#confetti").empty();     
  $("#winScreen").removeClass("show");
  showMessage('Click "Add customer" to start.', "");
  render(); 
}

// time convertion from seconds to minutes
function formatTime(seconds) {
  if (seconds < 60) {
    return seconds + "s";
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + "m " + s + "s";
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
    if (!front.startedAt) {                 
      front.startedAt = Date.now();         
    }  
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

// Live timer: how long the customer at the counter has been waiting
function updateTimer() {
  const front = peek();

  if (front && !gameOver) {
    const seconds = Math.floor((Date.now() - front.startedAt) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    $("#waitTimer").text("Waiting " + m + ":" + (s < 10 ? "0" : "") + s);
  } else {
    $("#waitTimer").text("");
  }
}



// ===== START =====
$(document).ready(function () {
  $("#addBtn").click(enqueue);
  $("#resetBtn").click(reset);
  $("#startBtn").click(function () {
    $("#startScreen").fadeOut(400);
  });
  $("#playAgainBtn").click(reset);

  $(".drink-btn").click(function () {
    serveDrink($(this).data("drink"));
  });

  setInterval(updateTimer, 1000); 
  render();
});