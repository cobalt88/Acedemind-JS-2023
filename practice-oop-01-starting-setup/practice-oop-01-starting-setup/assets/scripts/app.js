class ToolTip {}

class ProjectItem {
  constructor(id){
    this.id = id;
    this.connectSwitchButton();
    this.connectMoreInfoButton();
  }

  connectMoreInfoButton() {};
  connectSwitchButton() {
    const projectItemElement = document.getElementById(this.id);
    const switchButton = projectItemElement.querySelector('button: last-of-type');
    switchButton.addEventListener('click', )
  };
} 

class ProjectList {
  projects = [];

  constructor(type) {
    const prjItems = document.querySelectorAll(`#${type}-projects li`);

    for (const prjItem of prjItems) {
      this.projects.push(new ProjectItem(prjItem.id));
    }
    console.log(this.projects)
  }
  addProject() {

  }
  switchProject(projectId) {
    // const projectIndex = this.projects.findIndex(p => p.id === projectId)
    // this.projects.splice(projectIndex, 1)
    this.projects = this.projects.filter(p => p.is !== projectId);
  }
}

class App {
  static init() {
    const activeProjectsLists = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
  }
}

App.init()