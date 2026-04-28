# Web-Based Inventory Management System
This repository contains the source code for a web-based inventory management system with CRUD functionality. The theme of the web app follows the famous clothing brand, named 'UNIQLO'. This project was created for one of my internship interview's technical assessment.

A live demo version can be accessed through the following link:<br />
~~https://gray-flower-0ce0a4e10.5.azurestaticapps.net/~~ <sub>~~The website is currently offline.~~</sub> <br />
~~https://inventory-management-system-nine-rho.vercel.app/ <sub>The website is Group24's deployment.</sub>

## JavaScript Libraries/Frameworks
- Bootstrap 5
- DataTables
- jQuery

## Code Structure
- [index.html](https://github.com/julianganjs/inventory-management-system/blob/main/index.html): The main code for the website.
- [assets](https://github.com/julianganjs/inventory-management-system/tree/main/assets): Contains all the styles, libraries, fonts and frameworks needed for the website to work and look properly.
- [DB.txt](https://github.com/julianganjs/inventory-management-system/blob/main/DB.txt): An existing database file in JSON format to be imported into the inventory system.

## Usage
1. Clone this repository.
2. Download [index.html](https://github.com/julianganjs/inventory-management-system/blob/main/index.html), [assets](https://github.com/julianganjs/inventory-management-system/tree/main/assets) and [DB.txt](https://github.com/julianganjs/inventory-management-system/blob/main/DB.txt) into the same directory.
3. Open index.html using your default browser.
4. Select `LOAD DATA` if you wish to import an existing database file or `NEW DATA` to create a new entry.
5. Select `SAVE DATA` if you wish to export the edited data into a local file.

## Examples
- ### Main Screen (w/o Data)
  <img src="https://github.com/julianganjs/inventory-management-system/assets/127673790/28508f25-43f3-4033-974e-30bf848c5345" width="650vw">
- ### Main Screen (w/ Data)
  <img src="https://github.com/julianganjs/inventory-management-system/assets/127673790/2a5690c7-9541-484b-b70e-4c1c3ba93b53" width="650vw">
- ### Add New Item
  <img src="https://github.com/julianganjs/inventory-management-system/assets/127673790/1f0a4b09-79db-439a-918b-9c2aec184583" width="650vw">
  <br>A modal dialog pops up when an item needs to be added, updated or deleted. The total price is automatically calculated based on the quantity and unit price.<br>
- ### Delete Item
  <img src="https://github.com/julianganjs/inventory-management-system/assets/127673790/a9f44cd1-00b3-4783-a755-6e62da980514" width="650vw">

## License
This project is licensed under the MIT License.
