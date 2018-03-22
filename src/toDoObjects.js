/* Module Containing Factories */
const Factory = {

  createProject: function(name) {

    let project = {

      name: name,
      toDoList: [],

      /* Returns first element of an array of all matching toDoItems */
      getToDoItem: function(toDoItem){
        return this.toDoList.filter(i => i === toDoItem)[0];
      },

      /* Adds a new item if it isn't already on the list */
      addNewToDoItem: function(toDoItem) {
        if (this.getToDoItem(toDoItem) == undefined) {
         this.toDoList.push(toDoItem);
        }
      },

      /* Deletes an element if it's on the list */
      deleteToDoItem: function(toDoItem) {
        let index = this.toDoList.indexOf(toDoItem);
        if (index > -1) toDoList.splice(index);
      }
    }
    return project;
  },

  createToDoItem: function(title="",
                           dueDate= new Date(),
                           location="", 
                           duration=0,
                           description="",
                           priority=0,
                           checked=false) {


    let toDoItem = {
      title: title,
      dueDate: dueDate,
      location: location,
      duration: duration,
      description: description,
      priority: priority,
      checked: checked
    }

    return toDoItem;
  }
}

export default Factory;

