const input = document.getElementById('taskId');
const taskList = document.getElementById('taskList');
const theme = document.getElementById('more'); 
const container = document.getElementById('mainContainer');
const darkBtn = document.getElementById('darkBtn');
const sideContent = document.getElementById('sideContent');
const sideContainer = document.querySelector('.sideContainer');
const search = document.getElementById('search');
const taskInfo = document.createElement('div');
taskInfo.style.overflowY = 'auto';
let currentContextMenu = null;
let editingTask = null;
let currentTaskInfo = null;
let themeMenuOpen = false;
let isDark = false;
let isClosed = true;
let isTaskDone = false;

let taskItemDivHeight = 78;
let addStepRadioBottom = 485;
let addStepCount = 0;
let addStepClicked = false;
let taskAudio = new Audio('click-124467.mp3');
let menuClick = new Audio('message-124468.mp3');
const addStep = document.createElement('p');
function handleKeyPress(event){
    if(event.key === 'Enter'){
        menuClick.play();
        if(editingTask){
            editingTask.querySelector('span').textContent = input.value.trim();
            editingTask = null;
            input.value = '';   
            
        } else {
            addTasks();    
        }
    }
}

function handleKeyPressForTaskInfo(event){
    if(event.key === 'Enter'){
        addSteps();
        setTaskInfoTask();
    }
}

input.addEventListener('keydown', handleKeyPress);

const stepTasks = document.createElement("p");
const taskListItem = document.createElement('li');
function addTasks() {
    const taskText = input.value.trim();
    if (taskText !== '') {
        const taskListItem = document.createElement('li');        
        taskListItem.className = 'taskListItem';

        const radio = document.createElement('button');
        radio.name = "status";
        radio.className = "statusRadio";

        const span = document.createElement("span");
        span.textContent = taskText;
        span.addEventListener('click', ()=>{
            editTask(taskListItem);
        })

        stepTasks.style.fontSize = '12px';
        stepTasks.style.color = 'rgb(150,150,150)';
        stepTasks.style.marginTop = '35px';
        stepTasks.style.position = 'absolute';
        stepTasks.style.marginLeft = '25px';
        stepTasks.textContent = `0 of ${addStepCount}`;
        console.log(stepTasks);

        const br = document.createElement('br');

        taskListItem.dataset.isDone = 'false';

        radio.addEventListener('click', () => {
            taskAudio.play();
            const currentIsDone = taskListItem.dataset.isDone === 'true';
            taskListItem.dataset.isDone = !currentIsDone ? 'true' : 'false';
            isTaskDone = !isTaskDone;
                if(isTaskDone){
                radio.classList.add('checked');
                radioDiv.classList.add('checked');
                span.style.textDecoration = 'line-through';
                span2.style.textDecoration = 'line-through';
                taskListItem.style.opacity = '0.662';
 
                }
               else {
                
                    taskListItem.style.textDecoration = 'none';
                    taskListItem.style.opacity = '1';
                    radio.classList.remove('checked');
                    radioDiv.classList.remove('checked');
                    span.style.textDecoration = 'none';
                    span2.style.textDecoration = 'none';
    

                }
            updateTaskStyles(taskListItem);
        });
        taskListItem.addEventListener('click', ()=>{
            let taskInfoIsOpen = true;
            menuClick.play();
            removeCurrentTaskInfo();
                currentTaskInfo = taskInfo;
                taskInfo.className = 'taskInfo';
                input.style.width = '51.5%';
                taskList.style.width = '60.5%';
                darkBtn.style.right = '43%'
                theme.style.right = '40%';
                taskInfo.innerHTML =   `
                <button id="close">X</button>   
                <br/>
                <li id="taskItemDiv"></li>
                <br/>
                <li class = "taskListItem" id="addToMyDay"></li>
            <br/>
            <li class = "taskListItem" id="Dates"></li>
            <br/>
            <li class = "taskListItem" id="addFile">🧷 Add a file</li>
            <br/>
            <textarea class = "taskListItem" id="addNote">Add a Note</textarea>
            `
            
            //closeBtn styling
            const closeBtn = taskInfo.querySelector('#close');
            closeBtn.style.float= 'right';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'red';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '18px';

            closeBtn.addEventListener('click', (e)=>{
                menuClick.play();
                e.stopPropagation();
                if(taskInfoIsOpen)
                taskInfo.remove();
                taskList.style.width='94%';
                input.style.width = '90%';
                darkBtn.style.float = 'right';
                darkBtn.style.right = '10%';
                theme.style.float = 'right';
                theme.style.right = '5%';
                currentTaskInfo = null;
                taskInfoIsOpen = false;
                
            })
            //TaskListItem aligning
            const taskItemDiv = taskInfo.querySelector('#taskItemDiv');
            taskItemDiv.style.height = '78px';
            taskItemDiv.style.width = '347px';
            taskItemDiv.style.borderColor = 'rgb(220, 220, 220)';
            const radioDiv = document.createElement('button');
            radioDiv.name = "status";
            radioDiv.className = "statusRadio";
            radioDiv.style.position = 'absolute';
            radioDiv.style.bottom = '555px';
            radioDiv.style.left = '30px';
            radioDiv.addEventListener('click', ()=>{
                taskAudio.play();
                isTaskDone = !isTaskDone;
                if(isTaskDone){
                radio.classList.add('checked');
                radioDiv.classList.add('checked');
                span.style.textDecoration = 'line-through';
                span2.style.textDecoration = 'line-through';
                taskListItem.style.opacity = '0.662';
 
                }
               else {
                
                    taskListItem.style.textDecoration = 'none';
                    taskListItem.style.opacity = '1';
                    radio.classList.remove('checked');
                    radioDiv.classList.remove('checked');
                    span.style.textDecoration = 'none';
                    span2.style.textDecoration = 'none';
    

                }
            })
            const span2 = document.createElement('span');
            span2.textContent = taskText;
            span2.style.color = 'black';
            span2.style.position = 'absolute';
            span2.style.bottom = '555px';
            span2.style.left = '58px';

            span2.addEventListener('click', ()=>{
                editTask(taskListItem);
            })
            
            addStep.style.color = 'rgb(44, 168, 216)';
            addStep.textContent = '+ Add Steps'; 
            addStep.style.fontWeight = '100';
            addStep.style.position = 'absolute';
            addStep.style.top = '105px';   
            addStep.style.left= '35px';
            //addStep functionality
            addStep.addEventListener('click', ()=>{
                menuClick.play();
                addStepClicked = true;
                addSteps();
            })
            const addToMyDay = taskInfo.querySelector('#addToMyDay');
            addToMyDay.innerHTML = `☀️ Add to My Day`;
            addToMyDay.style.color = 'rgb(120,120,120)';
            addToMyDay.style.fontWeight = '300';
            addToMyDay.style.borderColor = 'rgb(220,220,220)';
            const dates = taskInfo.querySelector('#Dates');
            dates.style.height = '145px';
            dates.style.borderColor = 'rgb(220, 220, 220)';
            dates.innerHTML = `
            <p id = "remindMe">⏰ Remind me </p>
            <p style = "color: rgb(220, 220, 220)"> _____________________________________</p>
            <p id="addDueDate">📅 Add due date</p>
            <p style = "color: rgb(220, 220, 220)"> _____________________________________</p>
            <p id="repeat">🔁 Repeat </p>
            `
            dates.style.display = 'grid';
            dates.style.fontWeight = '300';
            dates.style.height = '250px';

            const addFile = taskInfo.querySelector('#addFile');
            addFile.style.fontWeight = '300';
            addFile.style.color = 'rgb(120,120,120)';
            addFile.style.borderColor = 'rgb(220, 220, 220)';

            const addNote = taskInfo.querySelector('#addNote');
            addNote.style.fontWeight = '300';
            addNote.style.color = 'rgb(120,120,120)';
            addNote.style.borderColor = 'rgb(220,220,220)';
            addNote.style.height = '78px';
            addNote.style.width = '347px';

            container.appendChild(taskInfo);
            taskInfo.appendChild(radioDiv);
            taskInfo.appendChild(span2);
            taskInfo.appendChild(addStep);
            
            taskListItem.appendChild(stepTasks);
        })



        
            taskListItem.appendChild(radio);
            taskListItem.appendChild(span);
            taskList.prepend(taskListItem);

        taskList.appendChild(br);
        input.value = '';

        taskListItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            removeCurrentContextMenu();
            showContextMenu(e.clientX, e.clientY, taskListItem);
        });

        taskList.prepend(taskListItem);
    } else {
        alert("Please enter something!");
    }
}

function updateTaskStyles(taskListItem) {
    const isDone = taskListItem.dataset.isDone === 'true';
    const radio = taskListItem.querySelector('.statusRadio');
    const span = taskListItem.querySelector('span');
    if (isDone) {
        taskListItem.style.textDecoration = 'line-through';
        taskListItem.style.opacity = '0.662';
        radio.classList.add('checked');
        
    } else {
        taskListItem.style.textDecoration = 'none';
        taskListItem.style.opacity = '1';
        radio.classList.remove('checked');
    }

    const isImportant = taskListItem.classList.contains('task-important');
    if (isImportant) {
        if (!isDone) {
            radio.style.right = '2.54%';
            span.style.position = 'relative';
            span.style.marginRight = '5%';
            moveTaskToTop(taskListItem);
        }
    } else {
        radio.style.right = '0';
        span.style.marginRight = '0';
    }
}

function moveTaskToTop(taskListItem) {
    const currentIsDone = taskListItem.dataset.isDone === 'true';

    if (!currentIsDone && taskListItem !== taskList.firstElementChild) {
        taskList.prepend(taskListItem);
    }
}

function showContextMenu(x, y, taskListItem) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'contextMenu';
    contextMenu.innerHTML = `
        <p>☀️ Add to My Day </p>
        <p id="important">⭐ Mark as Important </p>
        <p>✔️ Mark as Completed </p>
        <hr style="margin-top: 4px; margin-bottom: 4px; ">
        <p>📅 Due Today </p>
        <p>📅 Due Tomorrow </p>
        <p>📅 Pick a Date </p>
        <hr style="margin-top: 4px; margin-bottom: 4px; ">
        <p id="delete">🗑️ Delete Task</p>
        <p id="edit">📝 Edit Task </p>
    `;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    document.body.appendChild(contextMenu);

    currentContextMenu = contextMenu;

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target))
            contextMenu.remove();
    });

    const deleteBtn = contextMenu.querySelector('#delete');
    deleteBtn.addEventListener('click', () => {
        taskListItem.remove();
        contextMenu.remove();
        currentContextMenu = null;
    });
    deleteBtn.style.color = 'red';
    deleteBtn.style.cursor = 'pointer';

    const editBtn = contextMenu.querySelector('#edit');
    editBtn.addEventListener("click", () => {
        editTask(taskListItem)
    });

    const importantBtn = contextMenu.querySelector('#important');
    importantBtn.addEventListener('click', () => {
        taskListItem.classList.toggle('task-important');
        updateTaskStyles(taskListItem);
    });
}

function editTask(taskListItem){
        editingTask = taskListItem;
        input.value = taskListItem.querySelector('span').textContent;
        contextMenu.remove();
        input.focus();
}

function removeCurrentContextMenu() {
    if (currentContextMenu) {
        currentContextMenu.remove();
        currentContextMenu = null;
    }
}

function removeCurrentTaskInfo(){
    if(currentTaskInfo){
        currentTaskInfo.remove();
        currentTaskInfo = null;
    }
}

function showThemeMenu() {
    if (themeMenuOpen) {
        const themeMenu = document.querySelector('.theme');
        if (themeMenu) {
            themeMenu.remove();
            themeMenuOpen = false;
        }
    } else {
        const themeMenu = document.createElement('div');
        themeMenu.className = 'theme';
        themeMenu.innerHTML = `
            <p class="colours" id="colour1" onclick = "changeBgColor('aquamarine')"></p>
            <p class="colours" id="colour2" onclick = "changeBgColor('rgb(56, 56, 196)')"></p>
            <p class="colours" id="colour3" onclick = "changeBgColor('rgb(243, 255, 79)')"></p>
            <p class="colours" id="colour4" onclick = "changeBgColor('rgb(159, 0, 0)')"></p>
            <p class="colours" id="colour5" onclick = "changeBgColor('rgb(14, 19, 34)')"></p>
            <p class="colours" id="colour6" onclick = "changeBgColor('rgb(0, 0, 67)')"></p>
            <p class="colours" id="colour7" onclick = "changeBgColor('rgb(0, 119, 79)')"></p>
            <p class="colours" id="colour8" onclick = "changeBgColor('rgb(114, 114, 114)')"></p>
            <p class="colours" id="colour9" onclick = "changeBgColor('rgb(247, 102, 102)')"></p>
        `;

        themeMenu.style.position = 'absolute';
        themeMenu.style.float = 'right';
        themeMenu.style.top = '100px';

        document.body.appendChild(themeMenu);
        themeMenuOpen = true;

    }
}

theme.addEventListener('click', ()=>{
    showThemeMenu();
});


function changeBgColor(color){
    container.style.transition = 'background-color 0.5s ease'
    container.style.backgroundColor = color;

}

darkBtn.addEventListener('click', ()=>{
    if(isDark){
        sideContent.style.backgroundColor = 'white';
        input.style.backgroundColor = 'white';
        input.style.color = '';
        input.style.transition = 'background-color 0.5s ease';
        container.style.backgroundColor = 'rgb(247, 102, 102)';
        container.style.transition = 'background-color 0.5s ease';
        sideContent.style.color = '';
        darkBtn.style.backgroundColor = '';
        darkBtn.style.borderRadius = '';
        darkBtn.style.transition = '';
        sideContent.style.transition = 'background-color 0.5s ease';
        search.style.boxShadow = '';
        search.style.backgroundColor = 'white';
        search.style.transition = 'background-color 0.5s ease';
        taskInfo.style.transition = 'background-color 0.5s ease';
        taskInfo.style.backgroundColor = 'white';
        taskInfo.style.border = '';
    }
    else{
        sideContent.style.backgroundColor = 'rgb(0,0,0)';
        input.style.backgroundColor = 'rgb(13,13,14)';
        input.style.color = 'white';
        input.style.transition = 'background-color 0.5s ease';
        sideContent.style.color = 'white';
        container.style.backgroundColor = 'rgb(24,24,24)';
        container.style.transition = 'background-color 0.5s ease';
        darkBtn.style.backgroundColor = '#cccfff';
        darkBtn.style.borderRadius = '5px';
        darkBtn.style.transition = 'background-color 0.5s ease';
        sideContent.style.transition = 'background-color 0.5s ease';
        search.style.boxShadow = '0px 1px 1px 0px white';
        search.style.backgroundColor = 'rgb(30,30,30)';
        search.style.transition = 'background-color 0.5s ease';
        taskInfo.style.transition = 'background-color 0.5s ease';
        taskInfo.style.backgroundColor = 'rgb(0,0,0)';
        taskInfo.style.border = 'none';
    }
    isDark = !isDark;
})

function addSteps(){
    const addStepListItems = document.createElement('li');
    const addStepInput = document.createElement('input');
            addStepListItems.className = 'addStepListItem';
            addStepListItems.style.listStyleType = 'none';
            addStepInput.style.position = 'relative';
            addStepInput.style.width = '170%';
            addStepInput.style.left = '18px';
            addStepInput.style.border = '1px solid rgb(180,180,180)';
            addStepInput.style.borderRadius = '5px';
            addStepInput.style.height = '20px';
            taskItemDivHeight += 35;
            taskItemDiv.style.height = `calc(${taskItemDivHeight}px)`;
            addStep.appendChild(addStepListItems);
            addStepListItems.appendChild(addStepInput);
            addStepInput.focus();
            stepTasks.textContent = `0 of ${addStepCount}`;
            console.log(stepTasks)
            addStepCount++;
            if(addStepCount > 0){
                taskListItem.appendChild(stepTasks);
                }
            console.log(addStepCount);
            addStepListItems.addEventListener('keydown', handleKeyPressForTaskInfo);
}

function setTaskInfoTask(){
    const addStepListItemInfo = document.createElement('li');
    addStepListItemInfo.className = 'addStepListItem';
    addStepListItemInfo.style.borderColor = 'rgb(220,220,220)';
    const addStepRadio = document.createElement('input');
    addStepRadio.type = 'radio';
    addStepRadio.className = 'addStepRadio'; 
    addStepRadio.style.position = 'absolute';
    addStepRadio.style.bottom = `${addStepRadioBottom}px`;
    addStepRadioBottom -= 35;
    addStepRadio.style.float = 'left';
    addStepRadio.style.right = '330px';
    addStepRadio.style.height = '14px';
    addStepRadio.style.width = '14px';  
    addStepRadio.style.marginRight = '5px';
    taskInfo.appendChild(addStepListItemInfo);
    addStepListItemInfo.appendChild(addStepRadio);
    // addSteps(addStep);
}



