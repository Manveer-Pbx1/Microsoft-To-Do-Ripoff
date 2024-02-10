    const input = document.getElementById('taskId');
    const taskList = document.getElementById('taskList');
    const theme = document.getElementById('more'); 
    const container = document.getElementById('mainContainer');
    const darkBtn = document.getElementById('darkBtn');
    const sideContent = document.getElementById('sideContent');
    const sideContainer = document.querySelector('.sideContainer');
    const search = document.getElementById('search');
    const taskInfo = document.createElement('div');
    const doneContainer = document.querySelector('.doneContainer');
    const doneBtn = document.querySelector('.done');
    taskInfo.style.overflowY = 'auto';
    let currentContextMenu = null;
    let editingTask = null;
    let currentTaskInfo = null;
    let themeMenuOpen = false;
    let isDark = false;
    let isClosed = true;
    let isTaskDone = false;
    let lastDisplayedInput = null;
    let taskItemDivHeight = 78;
    let addStepRadioBottom = 485;
    let addStepCount = 0;
    let addStepClicked = false;
    let taskAudio = new Audio('./Audio files/click-124467.mp3');
    let menuClick = new Audio('./Audio files/message-124468.mp3');
    let reminderAudio = new Audio('./Audio files/ambient-flute-notification-3-185275.mp3');
    let taskInfoIsOpen = true;
    let displayReminder = document.createElement('p');
    let reminderInterval;
    let taskCameFromtaskList = true;
    const addStep = document.createElement('p');
    const stepTasks = document.createElement('p');
    function handleKeyPress(event){
        if(event.key === 'Enter'){

            menuClick.play();
            if(editingTask){
                editingTask.querySelector('span').textContent = input.value.trim();
                editingTask = null;
                input.value = '';   
                
            } else {
                addTasks();    
                saveTasks();
            }
        }
    }

    function toggleTaskInfo(){
        if(taskInfo.style.visibility === 'hidden'){
            taskInfo.style.visibility = 'visible';
        }else{
            taskInfo.style.visibility = 'hidden';
            taskList.style.width='94%'; 
            input.style.width = '90%';
            darkBtn.style.float = 'right';
            darkBtn.style.right = '10%';
            theme.style.float = 'right';
            theme.style.right = '5%';
            clearInterval(reminderInterval)
                    remindMeInput.value = '';
            
        }
    }

    function handleKeyPressForTaskInfo(event){
        if(event.key === 'Enter' && !addStepClicked){
            addSteps();  
            setTaskInfoTask();
            addStepClicked = true;
            if(addStepClicked){
                const stepTasks = document.createElement("p");
                stepTasks.style.fontSize = '12px';
                stepTasks.style.color = 'rgb(150,150,150)';
                stepTasks.style.marginTop = '35px';
                stepTasks.style.position = 'absolute';
                stepTasks.style.marginLeft = '25px';
                stepTasks.textContent = `0 of ${addStepCount}`;
                console.log(stepTasks);
                console.log(addStepCount);
                taskListItem.appendChild(stepTasks);
                }   
        }
    }

    input.addEventListener('keydown', handleKeyPress);

    function saveTasks(){
        const taskListArray  = Array.from(document.querySelectorAll('.taskListItem')).map(task=>({
            text: task.querySelector('span').textContent,
            isDone: task.dataset.isDone === 'true'
        }));
        localStorage.setItem('taskList', JSON.stringify(taskListArray));
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadTasksFromLocalStorage();
        input.addEventListener('keydown', handleKeyPress);
    });
    
    function loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem('taskList');
        if (savedTasks) {
            const taskListArray = JSON.parse(savedTasks);
            taskListArray.forEach(task => {
                const taskListItem = createTaskListItem(task.text, task.isDone);
                taskList.appendChild(taskListItem);
            });
        }
        return taskListItem;
    }
    function removeTask(taskIndexToRemove) {
        const savedTasks = localStorage.getItem('taskList');
        if (savedTasks) {
            let taskListArray = JSON.parse(savedTasks);
            const indexToRemove = taskListArray.findIndex(task=>task.id === taskIndexToRemove);
            if(indexToRemove !== -1){
                taskListArray.splice(indexToRemove, 1);
                localStorage.setItem('taskList', JSON.stringify(taskListArray));
            }
        }
    }
      
      function randomId(){
        return '_' + Math.random().toString(36).substring(2, 9);
      }

    function createTaskListItem(taskText, isDone) {
        const taskListItem = document.createElement('li');
        taskListItem.className = 'taskListItem';
        taskListItem.dataset.isDone = isDone ? 'true' : 'false';
    
        const span = document.createElement("span");
        span.textContent = taskText;
        span.addEventListener('click', () => {
            editTask(taskListItem);
        });
    
        const radio = document.createElement('button');
        radio.name = "status";
        radio.className = "statusRadio";
        radio.style.zIndex = '5';
        
    
        

        taskListItem.dataset.isDone = 'false';
        

        
        radio.addEventListener('click', (event) => {
            console.log(taskCameFromtaskList);
            event.stopPropagation();
            if(taskCameFromtaskList){
            moveToDone(taskListItem);
            taskCameFromtaskList = false;
            console.log(taskCameFromtaskList);
            } else{
        radio.classList.remove('checked');
        span.style.textDecoration = 'none';
        taskList.prepend(taskListItem);
        taskCameFromtaskList = true;
        console.log(taskCameFromtaskList);
            }  
            // taskCameFromtaskList = true;
            taskAudio.play();
            displayReminder.style.visibility = 'hidden';
            const currentIsDone = taskListItem.dataset.isDone === 'true';
            taskListItem.dataset.isDone = !currentIsDone ? 'true' : 'false';
            radio.classList.toggle('checked');
            if(!taskCameFromtaskList)
            span.style.textDecoration = 'line-through';
            taskListItem.style.opacity = '0.662';
            updateTaskStyles(taskListItem);
        });
            taskListItem.addEventListener('click', ()=>{
                
                menuClick.play();
                toggleTaskInfo();
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
                <li class="taskListItem" id="addFile">
<label for="fileInput" style="cursor: pointer">🧷 Add a file</label>
<input type="file" id="fileInput" style="display: none;" accept="image/*, video/*, application/pdf, .pdf, .doc, .docx, .txt">
</li>

                <br/>
                <textarea class = "taskListItem" id="addNote">Add a Note</textarea>
                `

                    const fileInput = taskInfo.querySelector('#fileInput');
                    let imageContainer = taskInfo.querySelector('#addFile');
                    const fileInfo = document.createElement('p');
                    const displayImage = document.createElement('img');
                    const displayVideo = document.createElement('video');
                    const remove = document.createElement('button');
                    let image = document.createElement('img');
                    let video = document.createElement('video');
                    let imageOpened = false;
                    let existingImage;
                    fileInput.addEventListener('input', () => {
                        if(!imageOpened){
                        remove.innerText = 'Remove';
                        remove.id = 'remove';
                        remove.style.height = '20px';   
                        remove.style.width = '40px';
                        remove.style.border = 'none';
                        remove.style.borderRadius = '5px';
                        remove.style.cursor = 'pointer';
                        remove.style.position = 'relative';
                        remove.style.left = '220px';    
                        remove.style.bottom = '160px';    
                        remove.style.color = 'white';
                        remove.style.fontSize = '8px';
                        remove.style.backgroundColor = 'red';
                        remove.style.padding  = '5px';
                        remove.style.zIndex = '4';
                        
                        taskInfo.append(remove);
                        console.log("button appended");
                        
                        const file = fileInput.files[0];
                        if (file) {
                            if(existingImage){
                                existingImage.remove();
                            }
                            remove.addEventListener('mouseenter', ()=>{
                                console.log("bsdk")
                                remove.style.backgroundColor = 'rgb(247, 102, 102)';
                            })
                            remove.addEventListener('mouseleave', ()=>{
                                remove.style.backgroundColor = 'red';
                            })
                            
                           
                            // if(isValidFileType(file.type)){
                            //     fileInfo.innerHTML = `${file.name}
                            //     <br> ${file.type}
                            //     <br> ${(file.size / 1024 / 1024).toFixed(2)} MB`;
                            //     fileInfo.style.fontSize = '80px';
                            //     // fileInfo.style.border = '1px solid';
                            //     fileInfo.style.backgroundColor = 'white';
                            //     fileInfo.style.color = 'skyblue';
                            //     fileInfo.style.width = '90px';
                            //     fileInfo.style.zIndex = '10';
                            // }
                            if(file.type.startsWith('image')){

                            
                                
                                image.src = URL.createObjectURL(file);
                                image.style.height = '35px';
                                image.style.position = 'absolute';
                                image.style.left = '300px';
                                image.style.float = 'right';
                                image.style.width = 'auto';
                                image.style.border = '1px solid';
                                imageContainer.appendChild(image);
                                imageOpened = true;
                                existingImage = image;
                                
                                remove.addEventListener('click', ()=>{
                                    image.remove();
                                    remove.remove();
                                    imageOpened = false;
                                })
                                image.addEventListener('click', ()=>{
                                    const dialog = document.createElement('dialog');
                                    dialog.style.height = '650px';
                                            dialog.style.width = '650px';
                                            dialog.style.display = 'flex';
                                            dialog.style.marginLeft = 'auto';
                                            dialog.style.marginRight = 'auto';
                                            
                                    
                                    displayImage.src = URL.createObjectURL(file);
                                    displayImage.style.width = '100%';
                                    displayImage.style.height = '100%';
                                    displayImage.style.display = 'flex';
                                    displayImage.style.marginRight = 'auto';    
                                    displayImage.style.marginLeft = 'auto';   
                                        const closeBtn = document.createElement('button');
                                        closeBtn.textContent = "X";
                                        closeBtn.style.height = '30px';
                                        closeBtn.style.width = '30px';
                                        closeBtn.style.textAlign = 'center';
                                        closeBtn.style.cursor = 'pointer';
                                        closeBtn.style.padding = '5px';
                                        closeBtn.style.position = 'absolute';
                                        closeBtn.style.left = '93.5%';
                                        closeBtn.style.backgroundColor = 'red';
                                        closeBtn.style.color = 'white';
                                        closeBtn.style.borderRadius = '3px';
                                        closeBtn.addEventListener('click', ()=>{
                                            dialog.remove();
                                        })
                                        document.body.append(dialog);   
                                        dialog.appendChild(displayImage);
                                        displayImage.appendChild(fileInfo);
                                        dialog.appendChild(closeBtn);
                                dialog.showModal();
                                        
                                    })
                                }
                         else if(file.type.startsWith('video')){
                            if(!imageOpened){
                            video.src = URL.createObjectURL(file);
                            video.style.height = '35px';
                            video.style.position = 'absolute';
                            video.style.left = '300px';
                            video.style.float = 'right';
                            video.style.width = 'auto';
                            video.style.border = '1px solid';
                            console.log(imageContainer);
                            imageContainer.appendChild(video);
                            imageOpened = true;
                            existingImage = video;
                            remove.addEventListener('click', ()=>{
                                video.remove();
                                remove.remove();
                                imageOpened = false;
                            })
                            video.addEventListener('click', ()=>{
                                const dialog = document.createElement('dialog');
                                dialog.style.height = '650px';
                                        dialog.style.width = '650px';
                                        dialog.style.display = 'flex';
                                        dialog.style.marginLeft = 'auto';
                                        dialog.style.marginRight = 'auto';
                                        
                                displayVideo.src = URL.createObjectURL(file);
                                displayVideo.controls = true;
                                displayVideo.style.display = 'flex';
                                displayVideo.style.position = 'absolute';
                                displayVideo.style.marginLeft = 'auto';
                                displayVideo.style.marginRight = 'auto';
                                displayVideo.style.width = '96%';
                                displayVideo.style.height = '96%';
                                
                                const closeBtn = document.createElement('button');
                                        closeBtn.textContent = "X";
                                        closeBtn.style.height = '30px';
                                        closeBtn.style.width = '30px';
                                        closeBtn.style.textAlign = 'center';
                                        closeBtn.style.cursor = 'pointer';
                                        closeBtn.style.padding = '5px';
                                        closeBtn.style.position = 'absolute';
                                        closeBtn.style.left = '93.5%';
                                        closeBtn.style.backgroundColor = 'red';
                                        closeBtn.style.color = 'white';
                                        closeBtn.style.borderRadius = '3px';
                                        closeBtn.style.zIndex = '99';
                                        closeBtn.addEventListener('click', ()=>{
                                            dialog.remove();
                                        })
                                        document.body.append(dialog);   
                                        dialog.appendChild(closeBtn);
                                        dialog.appendChild(displayVideo);
                                        displayVideo.appendChild(fileInfo);
                                        dialog.showModal();
                                        

                            })
                        }
                    }
                    
                    // if file is an image, create a link to it and add
                        else if(file.type.startsWith('application/pdf')){
                            remove.style.visibility = 'visible';
                                const documentName = document.createElement('a');
                                documentName.target = '_blank';
                                documentName.style.fontSize = '8px';
                                documentName.style.textDecoration = 'none';
                                documentName.href = URL.createObjectURL(file);
                                documentName.innerText = `${file.name}`;
                                documentName.style.position = 'absolute';
                                documentName.style.left = '300px';
                                documentName.style.float = 'right';
                                documentName.style.width = '55px';
                                documentName.addEventListener('mouseenter', ()=>{
                                    documentName.style.color = 'skyblue';
                                })
                                documentName.addEventListener('mouseleave', ()=>{
                                    documentName.style.color = '';
                                })
                                // imageContainer.innerHTML += `<br>`;
                                imageContainer.appendChild(documentName);
                                remove.addEventListener('click', ()=>{
                                    documentName.remove();
                                    remove.style.visibility = 'hidden';
                                })
                                

                        }
                        else{
                            const docx = document.createElement('a');
                            docx.href = URL.createObjectURL(file);
                            docx.target = '_blank';
                            docx.style.fontSize = '8px';
                            docx.style.textDecoration = 'none';
                            docx.innerText = `${file.name}`;
                            docx.style.position = 'absolute';
                            docx.style.left = '300px';
                            docx.style.float = 'right';
                            docx.style.width = '55px';
                            docx.addEventListener('mouseenter', ()=>{
                                    docx.style.color = 'skyblue';
                                })
                                docx.addEventListener('mouseleave', ()=>{
                                    docx.style.color = '';
                                })
                                // imageContainer.innerHTML += `<br>`;
                                imageContainer.appendChild(docx);
                                remove.addEventListener('click', ()=>{
                                    docx.remove();
                                    remove.style.visibility = 'hidden';
                                })
                        }
                        fileInput.addEventListener('click', ()=>{
                            fileInput.value = null;
                        })
                        }
                    }
                    });
                    
            
            //closeBtn styling
            const closeBtn = taskInfo.querySelector('#close');  
            closeBtn.style.float= 'right';
            closeBtn.style.background = 'none';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'red';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '18px';

            
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
                displayReminder.style.visibility = 'hidden';
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
            addStep.addEventListener('click', (e)=>{
                menuClick.play();
                addStepClicked = true;
                e.stopPropagation();
                addSteps();
                setTaskInfoTask();
                // if(addStepClicked){
                    
                //     const stepTasks = document.createElement("p");
                //     stepTasks.style.fontSize = '12px';
                //     stepTasks.style.color = 'rgb(150,150,150)';
                //     stepTasks.style.marginTop = '35px';
                //     stepTasks.style.position = 'absolute';
                //     stepTasks.style.marginLeft = '25px';
                //     addStepCount++;
                //     stepTasks.textContent = `0 of ${addStepCount}`;
                //     console.log(addStepCount);
                //     taskListItem.appendChild(stepTasks);
                // }
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
                <p id = "remindMe" name="remindMe">⏰<button id="remindMeButton"> Remind me</button> </p>
                <p style = "color: rgb(220, 220, 220)"> _____________________________________</p>
                <p id="addDueDate">📅<button id="addDueDateButton"> Add due date</button></p>
                <p style = "color: rgb(220, 220, 220)"> _____________________________________</p>
                <p id="repeat">🔁 Repeat </p>
                `
                dates.style.display = 'grid';
                dates.style.fontWeight = '300';
                dates.style.height = '250px';
                let currentDate = new Date();
                const remindMe = dates.querySelector('#remindMe');
                const remindMeButton = dates.querySelector('#remindMeButton');
                remindMeButton.style.padding = '5px';
                remindMeButton.style.border = 'none';
                remindMeButton.style.background = 'none';
                remindMeButton.style.cursor = 'pointer';
                remindMeButton.style.fontSize = '16px';
                displayReminder = document.createElement('p');
                displayReminder.style.fontSize = '10px';    
                displayReminder.style.position = 'absolute';
                displayReminder.style.right = '0';
                displayReminder.style.top = '30px';
                displayReminder.style.color = 'rgb(65, 147, 255)';
                taskListItem.style.position = 'relative';
                taskListItem.insertAdjacentElement('beforeend', displayReminder);
                const remindMeInput = document.createElement('input');
                remindMe.addEventListener('click', ()=>{
                    let remindMeInputOpen = true;
                    remindMeInput.type = 'time';
                    if(remindMeInputOpen){
                    remindMeButton.addEventListener('click', ()=>{
                        
                        remindMeInput.classList.toggle('hidden');
                        remindMeInputOpen = !remindMeInputOpen;
                        
                        function updateReminderText(){
                            displayReminder.textContent = '';
                            displayReminder.textContent = `⏰ ${remindMeInput.value}`;
                        }
                        updateReminderText();
                        remindMeInput.addEventListener('input', updateReminderText);
                        
                        function checkReminder() {
                            const currentTime = new Date();
                            const enteredTime = new Date(currentTime.toDateString() + ' ' + remindMeInput.value);
                    
                            if (
                                currentTime.getHours() === enteredTime.getHours() &&
                                currentTime.getMinutes() === enteredTime.getMinutes()
                            ) {
                                reminderAudio.play();
                            }
                        }
                        reminderAudio.addEventListener('playing', function(){
                            
                            setTimeout(function() {
                                alert(`Reminder: ${taskText}`);
                                clearInterval(reminderInterval);
                            }, 100);
                        })
                    
                        reminderInterval = setInterval(checkReminder, 1000); 
                    })
                }
                    remindMeInput.id='ReminderTime';
                    remindMeInput.style.padding = '5px';
                    remindMeInput.style.cursor = 'pointer';
                    remindMeInput.style.borderRadius = '5px';
                    remindMeInput.style.border = '1px solid';
                    remindMeInput.style.boxShadow = '1px 0px 2px';
                    remindMe.insertAdjacentElement('beforebegin', remindMeInput);
                    remindMe.appendChild(remindMeInput);
                    
                    window.addEventListener('change', ()=>{
                        if(remindMeInput.value === `${currentDate.getHours()}:${currentDate.getMinutes()}`){
                            reminderAudio.play();
                            alert(`Reminder:  ${taskText}`);
                        }
                    })
                }, {once: true})
                    
                const addDueDate = dates.querySelector('#addDueDate');
                const addDueDateButton = dates.querySelector('#addDueDateButton');
                addDueDateButton.style.padding = '5px';
                addDueDateButton.style.border = 'none';
                addDueDateButton.style.background = 'none';
                addDueDateButton.style.cursor = 'pointer';
                addDueDateButton.style.fontSize = '16px';
                const addDueDateInput = document.createElement('input');
                addDueDateInput.type = 'date';
                addDueDate.addEventListener('click',() => {
                    let addDueDateInputOpen = true;
                    if(addDueDateInputOpen){
                        addDueDateButton.addEventListener('click', ()=>{
                            addDueDateInput.classList.toggle('hidden');
                            addDueDateInputOpen = !addDueDateInputOpen;
                        })
                    }
                    addDueDateInput.style.padding = '5px';
                    addDueDateInput.style.cursor = 'pointer';
                    addDueDateInput.style.borderRadius = '5px';
                    addDueDateInput.style.background = 'none';
                    addDueDateInput.style.border = '1px solid';
                    addDueDateInput.style.boxShadow = '1px 0px 2px';
                addDueDate.insertAdjacentElement('afterbegin', addDueDateInput);
                addDueDate.appendChild(addDueDateInput);
                }, {once: true})

            const addFile = taskInfo.querySelector('#addFile');
            addFile.style.fontWeight = '300';
            addFile.style.color = 'rgb(120,120,120)';
            addFile.style.borderColor = 'rgb(220, 220, 220)';


            const addNote = taskInfo.querySelector('#addNote');
            // let addNoteContent = addNote.value.trim();
            addNote.style.fontWeight = '300';
            addNote.style.color = 'rgb(120,120,120)';
            addNote.style.borderColor = 'rgb(220,220,220)';
            addNote.style.height = '78px';
            addNote.style.width = '347px';
            // addNote.textContent = addNoteContent;

            closeBtn.addEventListener('click', (e)=>{
                menuClick.play();
                let taskInfoIsOpen = true;
                let addNoteContent = addNote.value.trim();
                // addStepCount = 0;
                e.stopPropagation();
                if(taskInfoIsOpen){
                taskInfo.style.visibility = 'hidden';
                if(!taskInfo.classList.contains('hidden')){
                    addNote.textContent =  addNoteContent;
                }
                taskList.style.width='94%'; 
                input.style.width = '90%';
                darkBtn.style.float = 'right';
                darkBtn.style.right = '10%';
                theme.style.float = 'right';
                theme.style.right = '5%';
                currentTaskInfo = null;
                taskInfoIsOpen = !taskInfoIsOpen;
                addNote.textContent = addNoteContent;
                clearInterval(reminderInterval)
                remindMeInput.value = '';
                }
                
            })

            container.appendChild(taskInfo);
            taskInfo.appendChild(radioDiv);
            taskInfo.appendChild(span2);
            taskInfo.appendChild(addStep);
            
            
        })



        
            taskListItem.appendChild(radio);
            taskListItem.appendChild(span);
            taskList.prepend(taskListItem);
        input.value = '';

        taskListItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            removeCurrentContextMenu();
            showContextMenu(e.clientX, e.clientY, taskListItem);
        });

        taskList.prepend(taskListItem);
        return taskListItem;
    } 
    
        
    


    const taskListItem = document.createElement('li');

    function isValidFileType(fileType) {
        const acceptedTypes = ['image', 'video', 'application/pdf'];
        return acceptedTypes.some(type => fileType.startsWith(type));
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
        deleteBtn.addEventListener('click', (task) => {
            
            taskListItem.remove();
            contextMenu.remove();
            currentContextMenu = null;
            removeTask();
            
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
    //Dark Mode  functionality
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
                addStepListItems.addEventListener('keydown', handleKeyPressForTaskInfo, {once: true});


            
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
    }

    let doneToggled = true;
function moveToDone(taskListItem){
    doneContainer.appendChild(taskListItem);
}
doneBtn.addEventListener('click', ()=>{
    if(doneToggled){
    doneContainer.style.visibility = 'visible';
    doneBtn.textContent = 'Done <';
    doneToggled = false;
    } else{
        doneContainer.style.visibility = 'hidden';
        doneBtn.textContent = 'Done >';
        doneToggled = true;
    }
})
