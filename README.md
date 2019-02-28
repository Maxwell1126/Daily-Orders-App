# Daily Orders App

## Prerequisites/Software Used

### Setup

- Node.js
- Postico
- Terminal
- React
- React-Redux


## Installing

- Download project
- `npm install`
- `createdb order_writer_app`
- `use database.sql to insert necessary tables to database.`
- `npm run server`
- `npm run client`


## Screen Shots

### 1 Log In Page
![Log In screen shot](wireframes/Log_In.png)

### 2 Crew Dashboard
![Crew Dashboard screen shot](wireframes/Crew_Dashboard.png)

### 3 Order Sheet
![Order Sheet screen shot](wireframes/Order_Sheet.png)

### 4 Past Order Sheet
![Past Order Sheet screen shot](wireframes/Yesterday's_Order.png)

### 5 History
![History screen shot](wireframes/History.png)

### 6 Update Orders
![Update Orders screen shot](wireframes/Update_Orders.png)

### 7 Update Specific Order Top of Screen
![Update Specific Order Top screen shot](wireframes/Update_Specific_Order_Top.png)

### 8 Update Specific Order Bottom of Screen
![Update Specific Order Bottom screen shot](wireframes/Update_Specific_Order_Bottom.png)


## Completed Features

- Home page displays a table of orders, and the order's status, specific to the logged in user for the current date. Clicking on the order 
takes the user to the ordersheet(s) for the clicked order.
- The order Sheet details page allows the user to place quantities of cases for
products for multiple days and submit or save progress. Past dates are read only.
- Order sheets allow users to add notes to order sheets of the current day or future dates.
- History view allows the user to view a specific past date and see what quantities were placed for the day along with any notes that were left. Notes content is conditionally rendered.
- Manager dashboard contains tables for approved orders, incomplete orders, and orders pending approval from management. Managers can click on any order and go to the order sheet view for that order.
- On the order sheet view, the manager can approve order sheets, add notes, or save progress. 
- The update orders view is exclusive to management, and allows the user to update who writes an order and what products are included in an order. Users can add new and old products and delete products from orders.


## Future Features

- More CSS and Material UI styling
- Refactor code. 


## Deployment

- Heroku: https://daily-orders-app.herokuapp.com/#/home


## Author

- Max Todd


## Acknowledge 

- I would like to thank Chris Black, my instructor at Prime, for all of his support over the whole of my time at prime, and for helping me get to this project to the point in just a two week time period. 
- I would additionally like to thank Kris Szfranski and Ally Boyd.
- Thanks to my cohort, Zaurak, and all my peers at Prime.




