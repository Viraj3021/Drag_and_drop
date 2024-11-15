const sortableList = document.querySelector(".sortable-list");
const undoBtn = document.getElementById("undo-btn");
const addRowBtn = document.getElementById("add-row-btn");

let history = [];

// Save the current state of the list if it's different from the last state
const saveState = () => {
    const currentState = [...sortableList.children].map(item => item.outerHTML);
    if (!history.length || JSON.stringify(history[history.length - 1]) !== JSON.stringify(currentState)) {
        history.push(currentState);
    }
};

// Restore the previous state
const undoLastAction = () => {
    if (history.length > 1) {
        history.pop(); // Remove current state
        const prevState = history[history.length - 1];
        sortableList.innerHTML = prevState.join("");
        reattachEventListeners(); // Reattach drag event listeners to each item
    }
};

// Reattach drag event listeners to each item after undo
const reattachEventListeners = () => {
    sortableList.querySelectorAll(".item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.target.classList.add("dragging");
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
            saveState(); // Save the new state after item drop
        });
    });
};

// Initial save of the list's state
saveState();

// Add drag event listeners to each item initially
reattachEventListeners();

// Drag and drop functionality
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    
    // Get all items except the currently dragging one
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];

    // Find the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Insert the dragging item before the found sibling
    sortableList.insertBefore(draggingItem, nextSibling);
};

// Attach event listeners to the sortable list
sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());

// Attach event listener to the Undo button
undoBtn.addEventListener("click", undoLastAction);

// Event listener for the "Add Row" button
addRowBtn.addEventListener("click", () => {
    const newRow = document.createElement('li');
    newRow.classList.add('item');
    newRow.setAttribute('draggable', 'true');
    
    const newRowContent = `
        <div class="details">
          <img src="images/img-4.jpg" alt="James Khosravi">
          <span>Dam Musk</span>
        </div>
    `;
    
    newRow.innerHTML = newRowContent;
    sortableList.appendChild(newRow); // Add the new row to the list
    
    reattachEventListeners(); // Reattach drag event listeners
    saveState(); // Save the state after adding the new row
});
