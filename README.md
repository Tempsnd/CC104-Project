# Brewster Caffee — Customer Queue Game

CC104 – Data Structures and Algorithms | Course Term Project

## Group Members
- Rhamz Daniel R. Ramos
- David John Dela R. Vega 
- Darwin Frias
- Dominic M. Perez

## Game Objective
Customers line up at a café counter and must be served in the order they arrived (first in, first served). The player serves each customer by clicking the drink they ordered. Serve *10 customers* to win the shift.

## Features
- Start screen with how-to-play instructions (Step 1-3)
- Waiting line shown in arrival order, with a live "Up next" preview
- Drink matching: the player serves by clicking the drink the customer ordered
- Live timer for the customer at the counter, and the time taken to serve each one
- Progress ring that fills as customers are served
- Win popup with confetti, customers served, and average wait time
- Reset button to restart at any time

## How to Play
1. Click *Click to start* on the start screen.
2. Click *Add customer* to add a customer to the waiting line. Each customer gets a unique ticket number, a name, and a random drink order.
3. The customer at the front of the line is at the counter. Their order is shown in the bubble.
4. Click the drink button that matches the order (*Oat latte*, *Cappuccino*, or *Matcha*).
   - Correct drink: the customer is served and leaves the line.
   - Wrong drink: an error message is shown and the customer stays.
   - Empty line: serving is blocked and a warning is shown.
5. Watch the timer to see how long the current customer has waited at the counter.
6. Serve 10 customers to win. Click *Reset* at any time to start over.

## Data Structure
*Queue (FIFO)*, implemented with a JavaScript array.

| Operation | Code | Meaning |
|---|---|---|
| Enqueue | queue.push(customer) | Add a customer at the back |
| Dequeue | queue.shift() | Remove the customer at the front |
| Peek | queue[0] | Look at the front customer without removing |

Each customer is an object: { number, name, order, skin, hair, shirt, arrivedAt, startedAt }.

## Algorithms and Key Functions
| Function | Purpose |
|---|---|
| enqueue() | Creates a customer with a unique number and a random name and drink, then adds them to the back of the queue |
| dequeue() | Removes and returns the customer at the front |
| peek() | Returns the front customer without removing them, or null if the queue is empty |
| serveDrink(drink) | Checks for an empty queue, checks that the drink matches the front customer's order, then dequeues and updates the score |
| checkWin() | Checks if 10 customers have been served and shows the win popup |
| reset() | Clears the queue and all counters and restarts the game |
| render() | Updates the whole screen (counter, up next, waiting line, stats) |
| renderCounter() | Shows the customer at the counter (name, ticket, order, avatar) |
| renderUpNext() | Shows the next customer in the "Up next" card |
| renderQueue() | Draws the waiting line in arrival order |
| renderStats() | Updates the waiting count, total served, and progress ring |
| updateTimer() | Shows a live timer for the customer at the counter |
| formatTime() | Turns seconds into text like 1m 11s |
| randomItem(list) | Picks a random item from an array (names, drinks, colors, confetti colors) |
| launchConfetti() | Creates 70 confetti pieces with random position, color, size and speed when the player wins |

*Algorithm notes*
- *FIFO processing:* only queue[0] can ever be served, so customers are always served in arrival order.
- *Input guards:* serving an empty queue and serving the wrong drink are both rejected without changing the queue.
- *Wait time:* each customer is stamped with Date.now() when they reach the counter. The time taken to serve them is the difference, shown in the message and used for the average on the win screen.

## Technologies
HTML, CSS, Bootstrap (layout only), JavaScript, jQuery. No backend, database, or internet connection is needed.

## How to Run
1. Download or clone this repository.
2. Open index.html in a web browser.

## Screenshots
(Add screenshots here: start screen, gameplay, wrong drink message, win popup)