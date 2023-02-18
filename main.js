const tasksDev = document.querySelector(".tasks");
const textInput = document.querySelector(".task-input");
const inputButton = document.querySelector("input[type='button']");
const taskElements = document.querySelectorAll(".task");

let tasksArr = [];
if (localStorage.getItem("tasks")) {
  tasksArr = JSON.parse(localStorage.getItem("tasks"));
  addTasksElements(tasksArr);
}

inputButton.addEventListener("click", () => {
  if (textInput.value.trim() != "") {
    addTask(textInput.value);
    textInput.value = "";
    textInput.focus();
  }
});
inputButton.addEventListener("click", changeOnClick);

textInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    inputButton.click();
  } else {
    let resultarr = tasksArr.filter((task) =>
      task.title.includes(textInput.value.toLowerCase())
    );
    addTasksElements(resultarr);
  }
});

function addTask(inputTask) {
  let taskObj = {
    id: new Date().getTime(),
    title: inputTask.toLowerCase(),
    details: "",
    date: new Date(),
    day:
      new Date().getDate() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getFullYear(),
    time:
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds(),
  };
  tasksArr.unshift(taskObj);
  updateLocalStorage(tasksArr);
  // add to tasks div
  addTasksElements(tasksArr);
}
window.localStorage;
function updateLocalStorage(tasksArr) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function addTasksElements(tasksArr) {
  tasksDev.innerHTML = "";
  for (let task of tasksArr) {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    taskEl.setAttribute("task-id", task.id);

    //   <input class="title">test</input>
    const taskTitle = document.createElement("input");
    taskTitle.setAttribute("maxlength", "25");
    taskTitle.className = "title";
    const disabledAttr = document.createAttribute("disabled");
    taskTitle.setAttributeNode(disabledAttr);
    taskTitle.value = task.title;

    //   <button class="task-details">open</button>
    const taskButton = document.createElement("button");
    taskButton.innerHTML = "Open";

    //     <textarea class="info">info about ......</textarea>
    taskEl.appendChild(taskTitle);
    taskEl.appendChild(taskButton);

    addFunctionality(taskEl);
    tasksDev.appendChild(taskEl);
  }
}

// functionality of task elements and its children
function addFunctionality(taskEl) {
  const taskButton = taskEl.querySelector("button");
  const taskTitle = taskEl.querySelector(".title");

  //start initialize  the events handlers of task button
  taskButton.addEventListener("click", changeOnClick);
  taskButton.addEventListener("click", (ev) => {
    taskTitle.toggleAttribute("disabled");
    if (taskEl.children.length > 2) {
      ev.target.innerHTML = "Open";
      submitTaskEdit(taskEl);
      taskEl.querySelector(".details").remove();
    } else {
      ev.target.innerHTML = "Save";
      shawTaskDetails(taskEl);
    }
  });
  //end initialize  the events handlers of task button
}

// add details div in the DOM inside task element
function shawTaskDetails(taskEl) {
  //start set textarea input (as info of a task)
  const detailsTextArea = document.createElement("textarea");
  detailsTextArea.className = "info";

  let task = tasksArr.filter(
    (task) => task.id == taskEl.getAttribute("task-id")
  )[0]; //get the task object for the current task element

  detailsTextArea.innerHTML = task.details;
  //start set textarea input (as info of a task)

  //start textarea event handlers
  detailsTextArea.addEventListener("focus", function () {
    let value = this.value;
    this.value = null;
    this.value = value;
    this.style.height = this.scrollHeight + "px";
  });
  detailsTextArea.addEventListener("input", function () {
    this.style.height = this.scrollHeight + "px";
  });
  //end textarea event handlers

  //start set span date => <span class="init-date">date</span>
  const detailsDate = document.createElement("span");
  detailsDate.className = "init-date";
  detailsDate.innerHTML = task.day + " <br/> " + task.time;
  //end set span date

  //start set div details (parent element)  =>   <div class="details"></div>
  const detailsDiv = document.createElement("div");
  detailsDiv.className = "details";
  detailsDiv.appendChild(detailsTextArea);
  detailsDiv.appendChild(detailsDate);
  //end set div details

  taskEl.appendChild(detailsDiv);
  detailsTextArea.focus();
}

//on click event handler change color effect at the button element
function changeOnClick(event) {
  event.target.style.color = "#666";
  event.target.style.backgroundColor = "#efefef";
  event.target.style.fontSize = "20px";

  const colorInterv = setTimeout(() => {
    event.target.style.fontSize = "16px";
    event.target.style.color = "#efefef";
    event.target.style.backgroundColor = "#666";
  }, 100);
}

// on click fundtion for save button
function submitTaskEdit(taskEl) {
  tasksArr.forEach((task) => {
    if (task.id == taskEl.getAttribute("task-id")) {
      task.title = taskEl.querySelector("input").value;
      task.details = taskEl.querySelector("textarea").value;
    }
    updateLocalStorage(tasksArr);
  });
}
