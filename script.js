const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const toDoList = document.getElementById('toDo-list');
const doingList = document.getElementById('doing-list');
const reviewList = document.getElementById('review-list');
const doneList = document.getElementById('done-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let toDoListArray = [];
let doingListArray = [];
let reviewListArray = [];
let doneListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false; 
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('toDoItems')) {
    toDoListArray = JSON.parse(localStorage.toDoItems);
    doingListArray = JSON.parse(localStorage.doingItems);
    reviewListArray = JSON.parse(localStorage.reviewItems);
    doneListArray = JSON.parse(localStorage.doneItems);
  }else {
    toDoListArray = ['Testing', 'Deployment'];
    doingListArray = ['Visual Elements'];
    reviewListArray = ['Content Creation'];
    doneListArray = ['Research', 'Sitemap'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [toDoListArray, doingListArray, reviewListArray, doneListArray];
  const arrayNames = ['toDo', 'doing', 'review', 'done'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  })
}

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable= true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // toDo Column
  toDoList.textContent = '';
  toDoListArray.forEach((toDoItem, index) => {
    createItemEl(toDoList, 0, toDoItem, index);
  });
  toDoListArray = filterArray(toDoListArray);

  // doing Column
  doingList.textContent = '';
  doingListArray.forEach((doingItem, index) => {
    createItemEl(doingList, 1, doingItem, index);
  });
  doingListArray = filterArray(doingListArray);

  // review Column
  reviewList.textContent = '';
  reviewListArray.forEach((reviewItem, index) => {
    createItemEl(reviewList, 2, reviewItem, index);
  });
  reviewListArray = filterArray(reviewListArray);

  // On Hold Column
  doneList.textContent = '';
  doneListArray.forEach((doneItem, index) => {
    createItemEl(doneList, 3, doneItem, index);
  });
  doneListArray = filterArray(doneListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if neccessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop Items
function rebuildArrays() {
  toDoListArray = [];
  for (let i =0; i < toDoList.children.length; i++) {
    toDoListArray.push(toDoList.children[i].textContent);
  }
  doingListArray = [];
  for (let i =0; i < doingList.children.length; i++) {
    doingListArray.push(doingList.children[i].textContent);
  }
  reviewListArray = [];
  for (let i =0; i < reviewList.children.length; i++) {
    reviewListArray.push(reviewList.children[i].textContent);
  }
  doneListArray = [];
  for (let i =0; i < doneList.children.length; i++) {
    doneListArray.push(doneList.children[i].textContent);
  }
  updateDOM();
}

// When Item starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column allows for Item to be dropped
function allowDrop(e) {
  e.preventDefault();
}

// When Item enters column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// When Item is dropped
function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  //Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();