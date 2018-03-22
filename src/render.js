import {format, compareAsc} from 'date-fns';

let Render = {

  currentExpandedView: undefined, 

  newProjectForm: function() {

    Render.clearExpandedView();

    let f = document.createElement('form');

    let field = document.createElement('div');

    let name = document.createElement('input');
    name.setAttribute('id', 'new-project-name');
    name.setAttribute('type', 'name');
    name.setAttribute('name', 'name');
    let nameLabel = document.createElement('label');
    nameLabel.textContent = "project name:";
    nameLabel.setAttribute('for', 'name');

    field.append(nameLabel);
    field.append(name);
    f.append(field);
    field = document.createElement('div');

    let createBtn = document.createElement('div');
    createBtn.setAttribute('id', 'new-project-btn');
    createBtn.setAttribute('class', 'btn');
    createBtn.textContent= "CREATE PROJECT";

    f.append(createBtn);

    let ev = document.querySelector('#current-expanded');
    ev.append(f);
  },

  clearCurrentListView: function(){
    let currentList = document.querySelector('#current-list');
    while(currentList.firstChild){
      currentList.removeChild(currentList.firstChild);
    }
    this.displayHeaders();
  },

  renderProject: function(project){
    console.log('hello');
    this.clearCurrentListView();
    project.toDoList.forEach(toDoItem => this.condensedToDoItem(toDoItem));
  },

  projectContent: function(projects){
    
    let projectContainer = document.querySelector('#project-content');
    while (projectContainer.firstChild){
      projectContainer.removeChild(projectContainer.firstChild);
    }

    let projectsLabel = document.createElement('span');
    projectsLabel.textContent = "Select a project: ";

    let projectsSelect= document.createElement('select');
    projectsSelect.setAttribute('id', 'project-select');
    let index = 0;
    projects.forEach( project => {
        let projectOption = document.createElement('option');
        projectOption.setAttribute('value', index);
        projectOption.textContent= project.name;
        projectsSelect.append(projectOption);
        index++;
    });

    projectsSelect.addEventListener('click', (e)=>{
      if (projectsSelect.value) Render.renderProject(projects[projectsSelect.value]);
    });

    let delProjectBtn = document.createElement('div');
    delProjectBtn.setAttribute('id', 'del-project-btn');
    delProjectBtn.setAttribute('class', 'btn');
    delProjectBtn.textContent = "X DELETE PROJECT";
    delProjectBtn.style.fontSize = '0.6rem';
    delProjectBtn.style.marginLeft= '10px';


    let newProjectBtn = document.createElement('div');
    newProjectBtn.setAttribute('class', 'btn');
    newProjectBtn.textContent = "+ NEW PROJECT";
    newProjectBtn.addEventListener('click', Render.newProjectForm);

    projectContainer.append(projectsLabel);
    projectContainer.append(projectsSelect);
    projectContainer.append(delProjectBtn);
    projectContainer.append(document.createElement('br'));
    projectContainer.append(newProjectBtn);

  },

  clearExpandedView:  function(){
    let currentDesc = document.querySelector('#current-expanded');
    /* clear expanded view */
    while (currentDesc.firstChild){
      currentDesc.removeChild(currentDesc.firstChild);
    }
  },

  addHeader: function(header, to){
    let element = document.createElement('span');
    element.setAttribute('class', 'cell');
    element.textContent = header;
    element.style.fontWeight = 'bold';
    element.style.fontSize = '2rem';

    to.append(element);
  },

  displayHeaders: function(){
    let currentList = document.querySelector('#current-list');
    let headers = document.createElement('div');
    headers.setAttribute('class', 'to-do-item');

    this.addHeader("WHEN", headers);
    this.addHeader("WHAT", headers);
    this.addHeader("WHERE", headers);
    console.log(headers);
    currentList.append(headers);
  },

  addPropertyToParent: function(parent, item,  name, type, additionalClasses="") {
    let property = document.createElement(type);
    let classes = name + " " + additionalClasses
    property.setAttribute('class', classes);
    /* this is a little ugly */
    if (name != "dueDate") property.textContent = item[name];
    else property.textContent = format(item[name], 'MM/DD/YYYY/ - hh:mm');
    parent.appendChild(property);
  },

  addExpandedPropertyToParent: function (label, parent, item, name, type, additionalClasses=""){
    let property = document.createElement('div');
    property.setAttribute('class', 'expanded-property');

    let labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.setAttribute('class', "cell2");

    property.append(labelElement);

    this.addPropertyToParent(property, item, name, "span", "cell2");
    parent.append(property);

  },

  condensedToDoItem: function(toDoItem) {
    let item = document.createElement('div');
    item.setAttribute('class', 'to-do-item');
    item.style.position = 'relative';

    
    this.addPropertyToParent(item, toDoItem, "dueDate", "span", "cell");
    this.addPropertyToParent(item, toDoItem, "title", "span", "cell");
    this.addPropertyToParent(item, toDoItem, "location", "span", "cell");

    let currentList = document.querySelector('#current-list');

    item.addEventListener('click', () => this.expandedToDoItem(toDoItem));
    item.addEventListener('mouseenter', () => item.style.opacity="0.5" );
    item.addEventListener('mouseleave', () => item.style.opacity="1" );

    /* shouldn't be touching the model here, but everything is a mess
     * anyhow.. 
     */
    item.addEventListener('dblclick', () =>{
      toDoItem.checked= !toDoItem.checked;
      this.expandedToDoItem(toDoItem);

      if (toDoItem.checked){
        let strike = document.createElement('div');
        strike.setAttribute('class', 'strike');
        item.append(strike);
      } 
      else {
        item.removeChild(item.lastChild);
      }
    });

    if (toDoItem.checked){
      let strike = document.createElement('div');
      strike.setAttribute('class', 'strike');
      item.append(strike);
    } 

    currentList.append(item);

  },
  
  expandedToDoItem: function(toDoItem) {
    Render.currentExpandedView = toDoItem;

    let currentDesc = document.querySelector('#current-expanded');
    this.clearExpandedView();
  


    let labels = ["title:",
                  "due date:",
                  "location:",
                  "duration:",
                  "description:",
                  "priority:",
                  "checked?"];

    this.addExpandedPropertyToParent(labels[0], currentDesc, toDoItem, "title", "span", "cell2");
    this.addExpandedPropertyToParent(labels[1], currentDesc, toDoItem, "dueDate", "span", "cell2");
    this.addExpandedPropertyToParent(labels[2], currentDesc, toDoItem, "location", "span", "cell2");
    this.addExpandedPropertyToParent(labels[3], currentDesc, toDoItem, "duration", "span", "cell2");
    this.addExpandedPropertyToParent(labels[4], currentDesc, toDoItem, "description", "span", "cell2");
    this.addExpandedPropertyToParent(labels[5], currentDesc, toDoItem, "priority", "span", "cell2");
    this.addExpandedPropertyToParent(labels[6], currentDesc, toDoItem, "checked", "span", "cell2");

    let deleteToDoBtn= document.createElement('div');
    deleteToDoBtn.setAttribute('id', 'del-todo-btn');
    deleteToDoBtn.setAttribute('class', 'btn');
    deleteToDoBtn.textContent = 'X DELETE'
    deleteToDoBtn.style.float = 'right';


    currentDesc.append(deleteToDoBtn);


  },

  newItemForm: function(){
    Render.clearExpandedView();
    let f = document.createElement('form');

    let field = document.createElement('div');

    let title = document.createElement('input');
    title.setAttribute('id', 'title-option');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    let titleLabel = document.createElement('label');
    titleLabel.textContent = "title:";
    titleLabel.setAttribute('for', 'title');

    field.append(titleLabel);
    field.append(title);
    f.append(field);
    field = document.createElement('div');

    let dueDate = document.createElement('input');
    dueDate.setAttribute('id', 'dueDate-option');
    dueDate.setAttribute('type', 'datetime-local');
    dueDate.setAttribute('name', 'date');
    let dueDateLabel = document.createElement('label');
    dueDateLabel.textContent = "due date:";
    dueDateLabel.setAttribute('for', 'dueDate');

    field.append(dueDateLabel);
    field.append(dueDate);
    f.append(field);
    field = document.createElement('div');

    let location = document.createElement('input');
    location.setAttribute('id', 'location-option');
    location.setAttribute('type', 'text');
    location.setAttribute('name', 'location');
    let locationLabel = document.createElement('label');
    locationLabel.textContent = "location:";
    locationLabel.setAttribute('for', 'location');

    field.append(locationLabel);
    field.append(location);
    f.append(field);
    field = document.createElement('div');
    
    let duration = document.createElement('input');
    duration.setAttribute('id', 'duration-option');
    duration.setAttribute('type', 'number');
    duration.setAttribute('name', 'duration');
    let durationLabel = document.createElement('label');
    durationLabel.textContent = "duration:";
    durationLabel.setAttribute('for', 'duration');

    field.append(durationLabel);
    field.append(duration);
    f.append(field);
    field = document.createElement('div');

    let description = document.createElement('input');
    description.setAttribute('id', 'description-option');
    description.setAttribute('type', 'textarea');
    description.setAttribute('name', 'description');
    let descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = "description:";
    descriptionLabel.setAttribute('for', 'description');
    
    field.append(descriptionLabel);
    field.append(description);
    f.append(field);
    field = document.createElement('div');

    let priorityLabel = document.createElement('label');
    priorityLabel.textContent = "priority:";
    priorityLabel.setAttribute('for', 'priority');

    let priority1 = document.createElement('input');
    priority1.setAttribute('type', 'radio');
    priority1.setAttribute('name', 'priority');
    priority1.value = "1";
    let priority1Label = document.createElement('label');
    priority1Label.textContent = "low";
    priority1Label.setAttribute('for', 'priority1');
    
    let priority2 = document.createElement('input');
    priority2.setAttribute('type', 'radio');
    priority2.setAttribute('name', 'priority');
    priority2.value = "2";
    let priority2Label = document.createElement('label');
    priority2Label.textContent = "medium";
    priority2Label.setAttribute('for', 'priority2');

    let priority3 = document.createElement('input');
    priority3.setAttribute('type', 'radio');
    priority3.setAttribute('name', 'priority');
    priority3.value = "3";
    let priority3Label = document.createElement('label');
    priority3Label.textContent = "high";
    priority3Label.setAttribute('for', 'priority3');

    field.append(priorityLabel);
    field.append(priority1Label);
    field.append(priority1);
    field.append(priority2Label);
    field.append(priority2);
    field.append(priority3Label);
    field.append(priority3);

    f.append(field);
    field = document.createElement('div');

    let checkbox = document.createElement('input');
    checkbox.setAttribute('id', 'checked-option');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'checked');
    let checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = "checked?";
    checkboxLabel.setAttribute('for', 'checked');
  
    field.append(checkboxLabel);
    field.append(checkbox);
    f.append(field);
    field = document.createElement('div');

    let createBtn = document.createElement('div');
    createBtn.setAttribute('id', 'new-todo-btn');
    createBtn.setAttribute('class', 'btn');
    createBtn.textContent= "CREATE TODO";

    f.append(createBtn);

    let ev = document.querySelector('#current-expanded');
    ev.append(f);
  }
}

export default Render;
