import Factory from './toDoObjects.js';
import Render from './render.js';

document.addEventListener('DOMContentLoaded', (e) => {

  let projects = [];


  /* can only use strings in local storage, so must reconstruct the 
   * objects from their JSON form 
   */
  if (localStorage['projects']){
    let p;
    let projectsObjects= JSON.parse(localStorage['projects']);
    projectsObjects.forEach( object => {
        p = Factory.createProject(object.name);
        object.toDoList.forEach( todo => {
            p.addNewToDoItem(Factory.createToDoItem(
                todo.title,
                todo.dueDate,
                todo.location,
                todo.duration,
                todo.description,
                todo.priority,
                todo.checked));
        });
        projects.push(p);
    });
  } 
  let delProjectBtn;
  let currentProject;
  let currentToDo;

  console.log(projects);



  function testSetUp(){
    let p = Factory.createProject('test');

    let i = Factory.createToDoItem(
        "Walk the Dog",
        new Date(),
        "home",
        "1 hour",
        "Take him around the block",
        1,
        false); 

    let m = Factory.createToDoItem(
        "Mail Letter",
        new Date(),
        "post office",
        "30 minutes",
        "Need gas on the way",
        1,
        false); 

    let o = Factory.createToDoItem(
        "Renew lisecne",
        new Date(),
        "automobile agency",
        "1 hour",
        "Better looks good for new photo",
        1,
        true); 
    
    p.addNewToDoItem(i);
    p.addNewToDoItem(m);
    p.addNewToDoItem(o);


    let p2 = Factory.createProject('sample1');
    let p3 = Factory.createProject('sampe2');

    p2.addNewToDoItem(i);
    p3.addNewToDoItem(o);

    projects.push(p,p2,p3);
  }

  function setUp(){
    if (projects[0]) {
      currentProject = projects[0];
    }
    else {
      currentProject = Factory.createProject('default');
      projects.push(currentProject);
    }

    Render.projectContent(projects);
    Render.displayHeaders();
    let newBtn = document.querySelector('#new-btn');
    newBtn.addEventListener('click',Render.newItemForm);
    let newProjectBtn = document.querySelector('#new-project-btn');
    delProjectBtn = document.getElementById('del-project-btn');
    delProjectBtn.addEventListener('click', deleteProject);

    let select = document.getElementById('project-select');
    select.addEventListener('change',() => {
      currentProject = projects[select.value];
      Render.renderProject(currentProject);
    });

  }


  /* Button is dynamically created, so check every click to see if
   * it's target is the button. This seems like a poor solutin as it
   * checks EVERY click, but should be fine in small cases. 
   */
  document.addEventListener('click', e => tryAdd(e));
  function tryAdd(e) {
    addProject(e);
    addToDo(e);
    deleteToDo(e);
  }

  function addProject(e) {
    if (e.target && e.target.id == 'new-project-btn') {
      let name = document.getElementById('new-project-name').value;
      let p = Factory.createProject(name);
      projects.push(p);
      Render.projectContent(projects);
      let select = document.getElementById('project-select');
      select.value = projects.length-1;
      Render.renderProject(p);
      Render.clearExpandedView();
      currentProject = p;
      delProjectBtn = document.getElementById('del-project-btn');
      delProjectBtn.addEventListener('click', deleteProject);

      localStorage.projects = JSON.stringify(projects);
    }
  }

  function addToDo(e){

    if (e.target && e.target.id == 'new-todo-btn') {

      let title = document.getElementById('title-option').value;
      let dueDate = document.getElementById('dueDate-option').value;
      let location = document.getElementById('location-option').value;
      let duration = document.getElementById('duration-option').value;
      let description = document.getElementById('description-option').value;
      let priority;
      let priorityElement = document.querySelector('input[name="priority"]:checked');
      if (priorityElement == null) priority = 1;  
      else priority = priorityElement.value;
      let checked = document.querySelector('#checked-option').value;

      let toDo = Factory.createToDoItem( title,
                                         dueDate,
                                         location,
                                         duration,
                                         description,
                                         priority,
                                         checked);
                                       

      Render.clearExpandedView();
      console.log(currentProject);
      currentProject.addNewToDoItem(toDo);
      Render.renderProject(currentProject);


      localStorage.projects = JSON.stringify(projects);
    }
  }

  function deleteToDo(e){

    if (e.target && e.target.id == 'del-todo-btn') {
      let index = currentProject.toDoList.indexOf(Render.currentExpandedView);
      currentProject.toDoList.splice(index, 1);
      Render.renderProject(currentProject);
      Render.clearExpandedView();


      localStorage.projects = JSON.stringify(projects);
    }


  }

  function deleteProject() {
    console.log('test');
    let select = document.getElementById('project-select');
    projects.splice(select.value, 1);
    Render.projectContent(projects);
    if (projects.length != 0) currentProject = projects[0];
    else{
      currentProject = Factory.createProject('default');
      projects.push(currentProject);
    } 
    Render.renderProject(projects[0]);
    delProjectBtn = document.getElementById('del-project-btn');
    delProjectBtn.addEventListener('click', deleteProject);


    localStorage.projects = JSON.stringify(projects);
  }


  //testSetUp();
  setUp();
  console.log(projects);
  console.log(currentProject);
  

});

