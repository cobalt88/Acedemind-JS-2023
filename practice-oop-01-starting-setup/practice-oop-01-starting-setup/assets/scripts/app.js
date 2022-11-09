class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true)
    element.replaceWith(clonedElement)
    return clonedElement
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector)
    destinationElement.append(element)
  }
}

class ToolTip {
  constructor(closeNotifierFunction) {
    this.closeNotifier = closeNotifierFunction
  }

  closeTooltip = () => {
    this.detach();
    this.closeNotifier();

  }

  detach = () => {
    this.element.remove();
  }
  attach() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    tooltipElement.textContent = "dummy content";
    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
    document.body.append(tooltipElement);
    
  }
}

class ProjectItem {
  hasActiveTooltip = false

  constructor(id, updateProjectListsFunction, type){
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectSwitchButton();
    this.connectMoreInfoButton(type);
  }

  showMoreInfoButtonHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const toolTip = new ToolTip(() => {
      this.hasActiveTooltip = false;
    }) 
    toolTip.attach();
    this.hasActiveTooltip = true;
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoButton = projectItemElement.querySelector('button:first-of-type');
    moreInfoButton.addEventListener('click', this.showMoreInfoButtonHandler);
  };

  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchButton = projectItemElement.querySelector('button:last-of-type');
    switchButton = DOMHelper.clearEventListeners(switchButton)
    switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
    switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id))
  };

  update(updateProjectListsFunction, type) {
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectSwitchButton(type);
  }
} 

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);

    for (const prjItem of prjItems) {
      this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type));
    }
    console.log(this.projects)
  }

  setSwitchHandlerFunction(switchHandlerFunction){
    this.switchHandler = switchHandlerFunction;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type)
  }
  switchProject(projectId) {
    // const projectIndex = this.projects.findIndex(p => p.id === projectId)
    // this.projects.splice(projectIndex, 1)
    this.switchHandler(this.projects.find(p => p.id === projectId))
    this.projects = this.projects.filter(p => p.is !== projectId);

  }
}

class App {
  static init() {
    const activeProjectsLists = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
    activeProjectsLists.setSwitchHandlerFunction(finishedProjectsList.addProject.bind(finishedProjectsList));
    finishedProjectsList.setSwitchHandlerFunction(activeProjectsLists.addProject.bind(activeProjectsLists));
  }
}

App.init()