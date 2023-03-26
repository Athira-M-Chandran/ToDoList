//script.js


const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const taskDescription = document.getElementById('description');
const categoryInput = document.getElementById('category');
const addTaskButton = document.getElementById('add-task');
const filterCategory = document.getElementById('filterCategory');
const searchTask = document.getElementById('search-task');
const table = document.querySelector('table');



let draggedRow;



function saveTasks() {
    // Get the table rows
    const rows = table.querySelectorAll('tr');
    
    // Create an array to hold the tasks
    let tasks = [];
    
    // Loop through the rows and create a task object for each row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
     
    
    const taskname=[];
      const tdElement = row.querySelector('td:nth-child(1)');
      if (tdElement) {
        const spanElement = tdElement.querySelectorAll('span');
        
            spanElement.forEach(item => {
                taskname.push(item.textContent);
            })
       
      }
      
      const taskNote = row.querySelector('td:nth-child(3)').textContent;
      const categoryName = row.querySelector('td:nth-child(4)').textContent;
      const checkbox = row.querySelector('td:first-child input[type="checkbox"]');
      const completed = checkbox.checked;
      const tagsName = row.querySelector('td:nth-child(1) div');
    const tag =[];
    if (tagsName) {
        const tagItems = tagsName.querySelectorAll('label');
        tagItems.forEach(item => {

            tag.push(item.innerText);
                        
        });
    }
     
      const subTasks = []; 
      const subNotes=[];
      const subTaskCompleted =[];
      // Loop through the subtask list items and add them to the subTasks array
      const subtaskList = row.querySelector('td:nth-child(2) div');
      if (subtaskList) {
        const subtaskItems = subtaskList.querySelectorAll('span');
        const subtaskNoteItems = subtaskList.querySelectorAll('label');
        const subtaskCheckboxes = subtaskList.querySelectorAll('input[type="checkbox"]');
        subtaskItems.forEach((item, index) => {
            subTasks.push(item.innerText);
            subTaskCompleted.push(subtaskCheckboxes[index].checked);
            
        });
        subtaskNoteItems.forEach(item => {
            let a = item.innerText;
            let res = a.slice(0,-1)
            subNotes.push(res);
        });
        
    }

        const task = {
        completed: completed,
        name: taskname,
        tags: tag,
        note: taskNote,
        category: categoryName,
        subtasks:{
            subTaskCompleted:subTaskCompleted,
            subtasks: subTasks,
            subTaskNote: subNotes

        }
      };
      tasks.push(task);
    }
    // Save the tasks array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  

window.addEventListener('load', () => {
    
    const tasksJson = localStorage.getItem('tasks');
    if (tasksJson) {
      const tasks = JSON.parse(tasksJson);
      const table1 = document.querySelector('tbody');
      tasks.forEach(task => {
        const tableRow = table1.insertRow();
        const taskNameCell = tableRow.insertCell(0);
        const subTaskCell = tableRow.insertCell(1);       
        const noteCell = tableRow.insertCell(2);
        const categoryNameCell = tableRow.insertCell(3);
        const tagCell = tableRow.insertCell(4);
        const editButtonCell = tableRow.insertCell(5);
        const deleteButtonCell = tableRow.insertCell(6);
               
       const addSubTask = document.createElement('button');
       const taskNoteCell = document.createElement('label');
       taskNoteCell.innerText = task.note;
       const categorySpan = document.createElement('span');
       categorySpan.innerText = task.category;
      
        const addTagBtn = document.createElement('button');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        const divSubTask = document.createElement('div');
        const divTag = document.createElement('div');
       
        addSubTask.innerText = 'Add';
        addTagBtn.innerText='Add Tag';
        deleteButton.innerText = 'Delete';
        editButton.innerText = 'Edit';

        const checkButton = document.createElement('input');
        checkButton.type = 'checkbox';
        checkButton.checked = task.completed;
        checkButton.addEventListener('change', () => {
            task.completed = checkButton.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        taskNameCell.appendChild(checkButton);
        
        task.name.forEach(item=>{
                
            const span = document.createElement('span');
            span.innerText = item;
            taskNameCell.appendChild(span);
        });
      
        task.subtasks.subtasks.forEach((item, index) => {

                const subtaskList = document.createElement('li');
                const subtaskcheckButton = document.createElement('input');
                subtaskcheckButton.type='checkbox';
                subtaskcheckButton.checked = task.subtasks.subTaskCompleted[index];
                subtaskcheckButton.addEventListener('change', () => {
                    task.subtasks.subTaskCompleted[index] = subtaskcheckButton.checked;
                    saveTasks();
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });
                const subtaskSpan = document.createElement('span');
                subtaskSpan.innerText = item;
                const deleteSubTask = document.createElement('button');
                const addSubTaskNotesBtn = document.createElement('button');
                // const 
                subtaskList.appendChild(subtaskcheckButton);
                subtaskList.appendChild(subtaskSpan);
                divSubTask.appendChild(subtaskList);   

                deleteSubTask.setAttribute('class','deleteTag');
                addSubTaskNotesBtn.setAttribute('class','addSubTaskNotesBtn');
                deleteSubTask.innerText='x';
                addSubTaskNotesBtn.innerText ='+';
                subtaskList.appendChild(deleteSubTask);
                subtaskList.appendChild(addSubTaskNotesBtn);
                
                deleteSubTask.addEventListener('click',()=>{
                    subtaskList.remove();
                    saveTasks();
                 });
                 
                 task.subtasks.subTaskNote.forEach((item,noteIndex)=>{
                    if (noteIndex === index) {
                
                    const addsubTaskNotesLabel = document.createElement('label');
                    const deleteSubTaskNotes = document.createElement('button');
                    addsubTaskNotesLabel.innerText = item;
                    
                    addsubTaskNotesLabel.setAttribute('class','content');                            
                    deleteSubTaskNotes.setAttribute('class','deleteTag');
                    deleteSubTaskNotes.innerText='x';
                    addsubTaskNotesLabel.appendChild(deleteSubTaskNotes);
                    subtaskList.append(addsubTaskNotesLabel);
                    subtaskList.classList.add('collapsible');
                    deleteSubTaskNotes.addEventListener('click',()=>{
                        addsubTaskNotesLabel.remove();
                        task.subtasks.subTaskNote[index] = subtaskList.innerText.trim();
                        saveTasks();
                        
                    });
                }
                });
                  
            
                addSubTaskNotesBtn.addEventListener('click',()=>{
                    const subTaskNotes = document.createElement('textarea');
                    
                    subtaskList.appendChild(subTaskNotes);
                    subtaskList.classList.add('collapsible'); 
                    subTaskNotes.addEventListener('keypress',function(e){
                        if (e.key === 'Enter') {
                            subTaskNotes.remove();
                            const addsubTaskNotesLabel = document.createElement('label');
                            const deleteSubTaskNotes = document.createElement('button');
                            addsubTaskNotesLabel.innerText = subTaskNotes.value;
                            addsubTaskNotesLabel.setAttribute('class','content');                            
                            deleteSubTaskNotes.setAttribute('class','deleteTag');
                            deleteSubTaskNotes.innerText='x';
                            addsubTaskNotesLabel.appendChild(deleteSubTaskNotes);
                            subtaskList.append(addsubTaskNotesLabel);
                            saveTasks();
                            
                            deleteSubTaskNotes.addEventListener('click',()=>{
                                addsubTaskNotesLabel.remove();
                                saveTasks();
                                
                            });


                        }
                    });
                });
                subtaskList.addEventListener('click', () => {
                    subtaskList.classList.toggle('active'); 

            });

            });

        task.tags.forEach(item => {
            const addTagLabel = document.createElement('label');
            
            addTagLabel.innerText = item;
            divTag.appendChild(addTagLabel);
            const deleteTag = document.createElement('button');
            deleteTag.setAttribute('class','deleteTag');
            deleteTag.innerText='x';
            divTag.appendChild(deleteTag);     


            deleteTag.addEventListener('click',()=>{
                divTag.removeChild(addTagLabel);
                divTag.removeChild(deleteTag);
                saveTasks();
            });
                

        });   
   
        taskNameCell.appendChild(divTag);
        subTaskCell.appendChild(addSubTask);
        subTaskCell.appendChild(divSubTask);
        noteCell.appendChild(taskNoteCell);
        categoryNameCell.appendChild(categorySpan);
        tagCell.appendChild(addTagBtn);
        editButtonCell.appendChild(editButton);
        deleteButtonCell.appendChild(deleteButton);
        
        deleteButton.addEventListener('click', () => {
            tableRow.remove();
            saveTasks();
            
            
        });

        addSubTask.addEventListener('click',()=>{

            function insertSubTask(){
                
                    const subtaskList = document.createElement('li');
                    const subtaskcheckButton = document.createElement('input');
                    subtaskcheckButton.type='checkbox';
                    subtaskcheckButton.addEventListener('change', () => {
                        task.subTaskCompleted = subtaskcheckButton.checked;
                        saveTasks();
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                    });
                    const subtaskSpan = document.createElement('span');
                    const newSubtaskInput = addSubTaskValue.value;
                    const deleteSubTask = document.createElement('button');
                    const addSubTaskNotesBtn = document.createElement('button');
                    subtaskSpan.innerText = newSubtaskInput;
                    subtaskList.appendChild(subtaskcheckButton);
                    subtaskList.appendChild(subtaskSpan);
                    divSubTask.appendChild(subtaskList);  
    
                    deleteSubTask.setAttribute('class','deleteTag');
                    addSubTaskNotesBtn.setAttribute('class','addSubTaskNotesBtn');
                    deleteSubTask.innerText='x';
                    addSubTaskNotesBtn.innerText ='+';
                    subtaskList.appendChild(deleteSubTask);
                    subtaskList.appendChild(addSubTaskNotesBtn);
                    addSubTaskValue.value = '';
                    saveTasks();
                    
                    deleteSubTask.addEventListener('click',()=>{
                        subtaskList.remove();
                    saveTasks();
                });
                addSubTaskNotesBtn.addEventListener('click',()=>{
                    
                    const subTaskNotes = document.createElement('textarea');
                    
                    subtaskList.appendChild(subTaskNotes);
                    subtaskList.classList.add('collapsible');
                    subTaskNotes.addEventListener('keypress',function(e){
                        if (e.key === 'Enter') {
                            subTaskNotes.remove();
                            const addsubTaskNotesLabel = document.createElement('label');
                            const deleteSubTaskNotes = document.createElement('button');
                            addsubTaskNotesLabel.innerText = subTaskNotes.value;
                            
                            addsubTaskNotesLabel.setAttribute('class','content');                            
                            deleteSubTaskNotes.setAttribute('class','deleteTag');
                            deleteSubTaskNotes.innerText='x';
                            addsubTaskNotesLabel.appendChild(deleteSubTaskNotes);
                            subtaskList.append(addsubTaskNotesLabel);
                            saveTasks();
                            
                            deleteSubTaskNotes.addEventListener('click',()=>{
                                addsubTaskNotesLabel.remove();
                                saveTasks();
                                
                            });
                        }
                    });
            });
            subtaskList.addEventListener('click', () => {
                subtaskList.classList.toggle('active'); 
            });
                

            }
            const addSubTaskValue = subTaskCell.querySelector('input[type="text"]');
            
            if (!addSubTaskValue) {
                        
                const addSubTaskValue = document.createElement('input');
                addSubTaskValue.setAttribute('type','text');
                subTaskCell.appendChild(addSubTaskValue);
            }else{
                insertSubTask(); 
            }
        });
        addTagBtn.addEventListener('click',()=>{
               
            let addTagInput = tagCell.querySelector('input');
            
            function addTasks(){
                const addTagLabel = document.createElement('label');
                    addTagLabel.innerText = addTagInput.value ;
                    divTag.appendChild(addTagLabel);
                    const deleteTag = document.createElement('button');
                    deleteTag.setAttribute('class','deleteTag');
                    deleteTag.innerText='x';
    
                    deleteTag.addEventListener('click',()=>{
                        divTag.removeChild(addTagLabel);
                        divTag.removeChild(deleteTag);
                    });
                    divTag.appendChild(deleteTag);
                    addTagInput.value = '';
                    saveTasks();
    
            }
            if (!addTagInput) {
                addTagInput = document.createElement('input');
                tagCell.appendChild(addTagInput);
                addTagInput.addEventListener('keypress',function(e){
                    if (e.key === 'Enter') {
                        addTasks();
                    }
                });
            }else{
                addTasks();
            }
    
        });
        editButton.addEventListener('click',()=>{
            const editTask = document.createElement('INPUT');
            const span = document.createElement('span');
            const editNotes = document.createElement('textarea');
            const editCategorySelect = document.createElement('SELECT');
            const saveEditButton = document.createElement('button');
            const cancelEditButton = document.createElement('button');
            const br = document.createElement('br');
    
            const editTaskNameCell = document.createElement('td');
            const editNotesCell = document.createElement('td');
            const editCategoryNameCell = document.createElement('td');
            const editSaveCell = document.createElement('td');
            const editCancelButtonCell = document.createElement('td');
    
            editTask.setAttribute('type','text');

            task.name.forEach(item=>{
                const checkButton = document.createElement('input');
                checkButton.type = 'checkbox';
                checkButton.checked = task.completed;
                checkButton.addEventListener('change', () => {
                    task.completed = checkButton.checked;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });
                editTask.value = item;
                editTaskNameCell.appendChild(checkButton);
                editTaskNameCell.appendChild(editTask);
          
            });
            
            if(task.note!=''){
                editNotes.innerText = task.note;
            }
            saveEditButton.innerText = 'Save';
            cancelEditButton.innerText = 'Cancel';
            availableCategories = categories();
                    
                   
            for (let i = 0; i < availableCategories.length; i++) {
                const option = document.createElement('option');
                option.value = availableCategories[i];
                option.innerText = availableCategories[i];
                editCategorySelect.appendChild(option);
            }
            // set selected option to current category value
            editCategorySelect.value = task.category;
            editNotesCell.appendChild(editNotes);
            editCategoryNameCell.appendChild(editCategorySelect);
            editSaveCell.appendChild(saveEditButton);
            editCancelButtonCell.appendChild(cancelEditButton);
    
            tableRow.replaceChild(editTaskNameCell, taskNameCell);
            //tableRow.insertBefore(checkButton,editTaskNameCell)
            tableRow.replaceChild(editNotesCell,noteCell);
            tableRow.replaceChild(editCategoryNameCell, categoryNameCell);
            tableRow.replaceChild(editSaveCell, editButtonCell);
            tableRow.replaceChild(editCancelButtonCell, deleteButtonCell);
     
            function saveEditedValues(){
               
                const taskName = editTask.value;
                const categoryName = editCategorySelect.value;
                const taskNote = editNotes.value;
                span.innerText= taskName;
                
                taskNoteCell.innerText=taskNote;
                categorySpan.innerText = categoryName;
                // Get the first and second span elements under the taskNameCell element
                const firstSpan = taskNameCell.querySelector('span:first-of-type');
                const secondSpan = span;
            
                // Replace the first span with the second span
                taskNameCell.replaceChild(secondSpan, firstSpan);
             
                
                tableRow.replaceChild(taskNameCell,editTaskNameCell);
                tableRow.replaceChild(noteCell,editNotesCell);
                tableRow.replaceChild(categoryNameCell,editCategoryNameCell);
                tableRow.replaceChild(editButtonCell,editSaveCell);
                tableRow.replaceChild(deleteButtonCell,editCancelButtonCell);
                saveTasks();
    
            }
            cancelEditButton.addEventListener('click', () => {
                //taskNameCell.insertBefore(checkButton);
                saveEditedValues();
                
    
            });
            
            saveEditButton.addEventListener('click',() => {
                
                saveEditedValues();
                
                
            })
        });


    });
}
});



function categories(){
        
    const availableCategories =[];
    for(let i = 0;i< categoryInput.length; i++){
        if (categoryInput[i].value!=''){
            availableCategories.push(categoryInput[i].innerText);
            
        }
    }
    return availableCategories;
}


addTaskButton.addEventListener('click', () => {
    
const checkButton = document.createElement('INPUT');
checkButton.setAttribute('type','checkbox');
const noteCell = document.createElement('td')
const taskNameCell = document.createElement('td');
const subTaskCell = document.createElement('td');
const categoryNameCell = document.createElement('td');
const tagCell = document.createElement('td');
const editButtonCell = document.createElement('td');
const deleteButtonCell = document.createElement('td');
const tableRow = document.createElement('tr');


// const main_span = document.createElement('span');
const span = document.createElement('span');
taskNameCell.setAttribute('class','task-name');
const divTag = document.createElement('div');
const addSubTask = document.createElement('button');
const divSubTask = document.createElement('div');
const categorySpan = document.createElement('span');
const taskNoteCell = document.createElement('label');
const addTagBtn = document.createElement('button');
const deleteButton = document.createElement('button');
const editButton = document.createElement('button');
const br = document.createElement('br')


    const taskName = newTaskInput.value;
    const taskNote = taskDescription.value;
    const categoryName = categoryInput.value;
    if (categoryInput.value===''){
        alert('choose category');
    };
  if (taskName && categoryInput.value) {
    
    span.innerText = taskName;
    addSubTask.innerText = 'Add';
    taskNoteCell.innerText = taskNote;
    categorySpan.innerText = categoryName;
    addTagBtn.innerText='Add Tag';
    deleteButton.innerText = 'Delete';
    editButton.innerText = 'Edit';

    taskNameCell.appendChild(checkButton);
    taskNameCell.appendChild(span);
    taskNameCell.appendChild(divTag);
    noteCell.appendChild(taskNoteCell);
    subTaskCell.appendChild(addSubTask);
    subTaskCell.appendChild(divSubTask);
    categoryNameCell.appendChild(categorySpan);
    tagCell.appendChild(addTagBtn);
    editButtonCell.appendChild(editButton);
    deleteButtonCell.appendChild(deleteButton);

    checkButton.addEventListener('click', () => {
        checkButton = checkButton.checked;
        saveTasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });
    deleteButton.addEventListener('click', () => {
        tableRow.remove();
        localStorage.setItem('tasks', JSON.stringify(taskList));
        saveTasks();
    });
    let subtaskIndex = 0;
    
    addSubTask.addEventListener('click',()=>{
                
        function insertSubTask(){
                subtaskIndex++;
                 const subtaskList = document.createElement('li');
                const subtaskcheckButton = document.createElement('input');
                subtaskcheckButton.type='checkbox';
                subtaskcheckButton.addEventListener('change', () => {
                    subTaskCompleted = subtaskcheckButton.checked;
                    saveTasks();
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });
                const subtaskSpan = document.createElement('span');
                const newSubtaskInput = addSubTaskValue.value;
                
                const deleteSubTask = document.createElement('button');
                const addSubTaskNotesBtn = document.createElement('button');
                subtaskSpan.innerText = newSubtaskInput;
                subtaskList.setAttribute('id', 'subtask-' + subtaskIndex);
                subtaskList.appendChild(subtaskcheckButton);
                subtaskList.appendChild(subtaskSpan);
                divSubTask.appendChild(subtaskList);   

                deleteSubTask.setAttribute('class','deleteTag');
                addSubTaskNotesBtn.setAttribute('class','addSubTaskNotesBtn');
                deleteSubTask.innerText='x';
                addSubTaskNotesBtn.innerText ='+';
                subtaskList.appendChild(deleteSubTask);
                subtaskList.appendChild(addSubTaskNotesBtn);
                addSubTaskValue.value = '';
                
                saveTasks();
   
            
                deleteSubTask.addEventListener('click',()=>{
                    subtaskList.remove();
                    saveTasks();
                });


            addSubTaskNotesBtn.addEventListener('click',()=>{
                    
                    
                const subTaskNotes = document.createElement('textarea');
                
                subtaskList.appendChild(subTaskNotes);
                subtaskList.classList.add('collapsible'); // add the 'collapsible' class to the subtask list
                subTaskNotes.addEventListener('keypress',function(e){
                    if (e.key === 'Enter') {
                        subTaskNotes.remove();
                        const addsubTaskNotesLabel = document.createElement('label');
                        const deleteSubTaskNotes = document.createElement('button');
                        addsubTaskNotesLabel.innerText = subTaskNotes.value;
                        
                        addsubTaskNotesLabel.setAttribute('class','content');                            
                        deleteSubTaskNotes.setAttribute('class','deleteTag');
                        deleteSubTaskNotes.innerText='x';
                        addsubTaskNotesLabel.appendChild(deleteSubTaskNotes);
                        subtaskList.append(addsubTaskNotesLabel);
                        saveTasks();
                        

                        deleteSubTaskNotes.addEventListener('click',()=>{
                            addsubTaskNotesLabel.remove();
                            saveTasks();
                            
                        });


                    }
                });
                });
                subtaskList.addEventListener('click', () => {
                    subtaskList.classList.toggle('active'); // toggle the 'active' class to show/hide the notes section

            });
            

        }
        const addSubTaskValue = subTaskCell.querySelector('input[type="text"]');
        

        if (!addSubTaskValue) {
                    
            const addSubTaskValue = document.createElement('input');
            addSubTaskValue.setAttribute('type','text');
            subTaskCell.appendChild(addSubTaskValue);
        }else{
            
            insertSubTask(); }

    });
    addTagBtn.addEventListener('click',()=>{
           
        let addTagInput = tagCell.querySelector('input');
        
        function addTasks(){
            const addTagLabel = document.createElement('label');
                addTagLabel.innerText = addTagInput.value ;
                divTag.appendChild(addTagLabel);
                const deleteTag = document.createElement('button');
                deleteTag.setAttribute('class','deleteTag');
                deleteTag.innerText='x';
                saveTasks();

                deleteTag.addEventListener('click',()=>{
                    divTag.removeChild(addTagLabel);
                    divTag.removeChild(deleteTag);
                });
                divTag.appendChild(deleteTag);
                addTagInput.value = '';

        }
        if (!addTagInput) {
            addTagInput = document.createElement('input');
            tagCell.appendChild(addTagInput);
            addTagInput.addEventListener('keypress',function(e){
                if (e.key === 'Enter') {
                    addTasks();
                }
            });
        }else{
            addTasks();
        }

       // Attach an event listener to the document object
        document.addEventListener('click', (event) => {
            
            // Check if the click event originated from within the column
            const isClickWithinColumn =     addTagBtn.contains(event.target);
            const isClickWithinColumn1 =    addTagInput.contains(event.target);
        
            // If the click did not originate from within the column, hide it
            if (!isClickWithinColumn && !isClickWithinColumn1) {
                addTagInput.style.display = 'none';
            }
            
        });
               

    });
    editButton.addEventListener('click',()=>{
        const editTask = document.createElement('INPUT');
        //const editSubTaskList = document.createElement('li');
        const editNotes = document.createElement('textarea');
        const editCategorySelect = document.createElement('SELECT');
        const saveEditButton = document.createElement('button');
        const cancelEditButton = document.createElement('button');
        const br = document.createElement('br');

        const editTaskNameCell = document.createElement('td');
        const editNotesCell = document.createElement('td');
        const editCategoryNameCell = document.createElement('td');
        const editSaveCell = document.createElement('td');
        const editCancelButtonCell = document.createElement('td');

        editTask.setAttribute('type','text');
        editTask.value = taskName;
        if(taskNote!=''){
            editNotes.innerText = taskNote;
        }
        saveEditButton.innerText = 'Save';
        cancelEditButton.innerText = 'Cancel';
        availableCategories = categories();
                
               
        for (let i = 0; i < availableCategories.length; i++) {
            const option = document.createElement('option');
            option.value = availableCategories[i];
            option.innerText = availableCategories[i];
            editCategorySelect.appendChild(option);
        }
        // set selected option to current category value
        editCategorySelect.value = categoryName;
        //taskNameCell.appendChild(checkButton);
        editTaskNameCell.appendChild(checkButton);
        editTaskNameCell.appendChild(editTask);
        editNotesCell.appendChild(editNotes);
        editCategoryNameCell.appendChild(editCategorySelect);
        editSaveCell.appendChild(saveEditButton);
        editCancelButtonCell.appendChild(cancelEditButton);

        tableRow.replaceChild(editTaskNameCell, taskNameCell);
        //tableRow.insertBefore(checkButton,editTaskNameCell)
        tableRow.replaceChild(editNotesCell,noteCell);
        tableRow.replaceChild(editCategoryNameCell, categoryNameCell);
        tableRow.replaceChild(editSaveCell, editButtonCell);
        tableRow.replaceChild(editCancelButtonCell, deleteButtonCell);
 
        function saveEditedValues(){
            
            const taskName = editTask.value;
            const categoryName = editCategorySelect.value;
            const taskNote = editNotes.value;
            span.innerText = taskName;
            taskNoteCell.innerText=taskNote;
            categorySpan.innerText = categoryName;
            taskNameCell.insertBefore(checkButton,span);
            tableRow.replaceChild(taskNameCell,editTaskNameCell);
            tableRow.replaceChild(noteCell,editNotesCell);
            tableRow.replaceChild(categoryNameCell,editCategoryNameCell);
            tableRow.replaceChild(editButtonCell,editSaveCell);
            tableRow.replaceChild(deleteButtonCell,editCancelButtonCell);
            

        }
        cancelEditButton.addEventListener('click', () => {
            //taskNameCell.insertBefore(checkButton);
            saveEditedValues();
            

        });
        
        saveEditButton.addEventListener('click',() => {
            
            saveEditedValues();
            
            
        })
    });


    tableRow.appendChild(taskNameCell);
    
    tableRow.appendChild(subTaskCell);
    tableRow.appendChild(noteCell);
    tableRow.appendChild(categoryNameCell);
    tableRow.appendChild(tagCell);
    tableRow.appendChild(editButtonCell);
    tableRow.appendChild(deleteButtonCell);

    taskList.appendChild(tableRow);
    saveTasks();

   
    newTaskInput.value='';
    taskDescription.value='';
   categoryInput.value ='';
    
      }   
    
    });



  




function filterTasksByCategory(category) {
    const taskElements = taskList.querySelectorAll('td:nth-child(1) span');
    const categoryElements = taskList.querySelectorAll('td:nth-child(4)');
    
    for (let i = 0; i < taskElements.length; i++) {
        const searchTasks = taskElements[i].innerText.toLowerCase();
        const taskCategory = categoryElements[i].innerText.toLowerCase();
  
        if (category === '' || category === taskCategory || category === searchTasks ) {
         
            taskElements[i].parentElement.parentElement.style.display = 'table-row';
    
        }
        else{
            
            taskElements[i].parentElement.parentElement.style.display = 'none';
    
        }
        
    }

    
  }



  filterCategory.addEventListener('change', () => {
    
    const selectedCategory = filterCategory.value.toLowerCase();

    filterTasksByCategory(selectedCategory);
  });




  searchTask.addEventListener('keypress',function (e){
    if (e.key === 'Enter') {
        const searchTaskValue = searchTask.value.toLowerCase();
        filterTasksByCategory(searchTaskValue);
        
      }

  });


  table.addEventListener('dragstart', (event) => {
    
    draggedRow = event.target.closest('tr');
  });
  
  table.addEventListener('dragover', (event) => {
    
    event.preventDefault();
  });
  
  table.addEventListener('drop', (event) => {
    
    const dropTarget = event.target.closest('tr');
  
    // Make sure we are dropping on a td element and not the table itself
    if (dropTarget && draggedRow !== dropTarget) {
       
      const parent = draggedRow.parentNode;
      const nextSibling = draggedRow.nextSibling === dropTarget ? draggedRow : draggedRow.nextSibling;
      parent.insertBefore(draggedRow, dropTarget);
      parent.insertBefore(dropTarget, nextSibling);
    }
  });
  
  