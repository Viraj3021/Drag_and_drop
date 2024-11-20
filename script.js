const sortableList = document.querySelector(".sortable-list");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");
const addRowBtn = document.getElementById("add-row-btn");

let history = []; // Stack to store list states for undo
let redoHistory = []; // Stack to store states for redo

// Save the current state of the list
const saveState = () => {
    const currentState = [...sortableList.children].map(item => item.outerHTML);
    if (!history.length || JSON.stringify(history[history.length - 1]) !== JSON.stringify(currentState)) {
        history.push(currentState);
        redoHistory = []; // Clear redo history on new action
    }
};

// Restore the previous state (Undo)
const undoLastAction = () => {
    if (history.length > 1) {
        const currentState = [...sortableList.children].map(item => item.outerHTML);
        redoHistory.push(currentState); // Save current state to redo stack
        history.pop(); // Remove the latest state
        const prevState = history[history.length - 1];
        sortableList.innerHTML = prevState.join("");
        reattachEventListeners(); // Reattach event listeners
    }
};

// Reapply the last undone action (Redo)
const redoLastAction = () => {
    if (redoHistory.length > 0) {
        const redoState = redoHistory.pop(); // Retrieve the last redo state
        const currentState = [...sortableList.children].map(item => item.outerHTML);
        history.push(currentState); // Save current state to history
        sortableList.innerHTML = redoState.join("");
        reattachEventListeners(); // Reattach event listeners
    }
};

// Reattach drag event listeners to items
const reattachEventListeners = () => {
    sortableList.querySelectorAll(".item").forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.target.classList.add("dragging");
        });
        item.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
            saveState(); // Save the new state after dragging
        });
    });
};

// Drag-and-Drop Logic
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    const nextSibling = siblings.find(sibling => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
    sortableList.insertBefore(draggingItem, nextSibling);
};

// Add a new row
const addNewRow = () => {
    const newRow = document.createElement("li");
    newRow.classList.add("item");
    newRow.setAttribute("draggable", "true");
    newRow.innerHTML = `
        <div class="details">
            <img src="images/img-6.jpg" alt="New User">
            <span>John Doe</span>
        </div>
        <i class="uil uil-draggabledots"></i>
    `;
    sortableList.appendChild(newRow); // Add the new row to the list
    reattachEventListeners(); // Reattach event listeners to the new item
    saveState(); // Save the new state
};

// Attach Drag Events
sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", (e) => e.preventDefault());

// Button Event Listeners
undoBtn.addEventListener("click", undoLastAction);
redoBtn.addEventListener("click", redoLastAction);
addRowBtn.addEventListener("click", addNewRow);

// Initial Setup
saveState(); // Save the initial state
reattachEventListeners(); // Attach drag event listeners
