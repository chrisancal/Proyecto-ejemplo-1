import {IProject, Project, IToDo, ToDo} from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui:HTMLElement
    toDoUI:HTMLElement


    constructor (container: HTMLElement){
        this.ui = container
        this.toDoUI = document.getElementById("To-Do-List") as HTMLElement
    }
// *********************************************************************PROJECTS************************************************************************
    newProject (data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name " ${data.name} " is already in use`)
        }
        if (data.name.length < 5) {
            throw new Error(`The project's name must be at least 5 characters long`)
        }
        //console.log(data)

        const project = new Project(data)
        if (data.ToDoList.length > 0) {
            for (const y of data.ToDoList){
                this.newToDo(project,y)
            }
            //console.log(project.ToDoList)
        }
        else {project.ToDoList = []}

        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
            //console.log(project.ToDoList)
            var currentProject = this.activeProject()
            if (currentProject){this.RenderToDoItems(currentProject)}
        })
        
        this.ui.append(project.ui)
        this.list.push(project)
        return project

    }

    OverrideProject (project: Project, data: IProject) {
        const indexofProject = this.list.indexOf(project)
        console.log(typeof(project.finishdate))
        console.log(typeof(data.finishdate))
        project.name = data.name
        project.description = data.description
        project.type = data.type
        project.status = data.status
        if (typeof(data.finishdate) == "string"){project.finishdate = new Date(data.finishdate)}
        else{project.finishdate = data.finishdate}
        project.updateUI()
        this.list[indexofProject] = project
        this.setDetailsPage(project)
        return project
    }

    editProject (project: Project, data: IProject) {
        
        const projectNames = this.list.map((project) => {
            return project.name
        })
        if (data.name != project.name) {
            const nameInUse = projectNames.includes(data.name)
            if (nameInUse) {
                throw new Error(`A project with the name " ${data.name} " is already in use`)
            }
        }
        if (data.name.length < 5) {
            throw new Error(`The project's name must be at least 5 characters long`)
        }
        
        const editedProject = this.OverrideProject(project,data)

        return editedProject
    }

    PrePopForm (project: Project){
        if (!project) {return}
        var InputName = document.querySelector("#edit-project-form input[name='name']")
        if (InputName){
            InputName.setAttribute("value", project.name)
        }
        var InputDescription = document.querySelector("#edit-project-form textarea[name='description']")
        if (InputDescription && InputDescription instanceof HTMLTextAreaElement){
            InputDescription.value = project.description
        }
        var InputType = document.querySelector("#edit-project-form select[name='type']")
        if (InputType && InputType instanceof HTMLSelectElement){
            InputType.value = project.type
        }
        var InputStatus = document.querySelector("#edit-project-form select[name='status']")
        if (InputStatus && InputStatus instanceof HTMLSelectElement){
            InputStatus.value = project.status
        }
        var InputDate = document.querySelector("#edit-project-form input[type='date']")
        if (InputDate && InputDate instanceof HTMLInputElement){
            InputDate.value = project.finishdate.toLocaleDateString('en-CA')
        }
    
    }

    private setDetailsPage (project: Project) {
        const detailsPage = document.getElementById("project-details")
        const projectInitials = document.getElementById("project-initials")
        if (!detailsPage) {return}
        const initials = detailsPage.querySelector("[data-project-info='initials']")
        if (initials && projectInitials) {
            initials.textContent = project.name.slice(0,2).toUpperCase()
            projectInitials.style.backgroundColor= project.backgroundColor
        }
        const name = detailsPage.querySelector("[data-project-info='name']")
        if (name) {name.textContent = project.name}
        const name2 = detailsPage.querySelector("[data-project-info='name2']")
        if (name2) {name2.textContent = project.name}
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) {description.textContent = project.description}
        const description2 = detailsPage.querySelector("[data-project-info='description2']")
        if (description2) {description2.textContent = project.description}
        const type = detailsPage.querySelector("[data-project-info='type']")
        if (type) {type.textContent = project.type}
        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) {status.textContent = project.status}
        const finishdate = detailsPage.querySelector("[data-project-info='finishdate']")
        if (finishdate) {finishdate.textContent = project.finishdate.toLocaleDateString('es-CO')
        }

    }

    RenderProjectList(){
        console.log("Se anadio ui")
        this.ui.innerHTML= ''; // Clear existing content
        this.list.forEach(item => {
            console.log(item.ui)
            this.ui.append(item.ui);
            console.log("indicador for each")
        })
    }


    activeProject () {
        const detailsPage = document.getElementById("project-details")
        if (detailsPage) {
            var ProjectName = detailsPage.querySelector("[data-project-info='name']")?.textContent
            if (ProjectName && typeof ProjectName === "string") {var ActiveProject = this.getProjectByName(ProjectName)}
        }
        return ActiveProject
    }


    getProject (id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName (name: string ) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    deleteProject (id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }
// ******************************************   TO-DOs ***********************************************


    newToDo (project: Project, data:IToDo){
        const toDo = new ToDo(data)
        toDo.ui.addEventListener("click", () => {
            const modal = document.getElementById("ToDo-details-modal")
            if (modal && modal instanceof HTMLDialogElement) {
                modal.showModal()
            } else {
                console.warn("The provided modal wasn't found. ID: ToDo-details-modal")
            }
            this.setToDoDetails(toDo)
        })
        project.ToDoList.push(toDo)
        const currentProject = this.activeProject()
        if (currentProject){
            this.RenderToDoItems(currentProject)}
        return toDo
    }

    editToDo (indexoftoDo: number, data: IToDo) {
        var activeProject = this.activeProject()
        if (activeProject){const toDo = activeProject.ToDoList[indexoftoDo]
            toDo.status = data.status
            toDo.description = data.description
            toDo.discipline = data.discipline
            toDo.DueDate = data.DueDate
            toDo.color = data.color
            activeProject.ToDoList[indexoftoDo] = toDo
            this.setToDoDetails(toDo)
            return toDo
        }   
    }
//Method to render To-Do list 
    RenderToDoItems(project: Project){
        this.toDoUI.innerHTML= ''; // Clear existing content
        project.ToDoList.forEach(item => {
            console.log(item.ui)
            this.toDoUI.appendChild(item.ui);
        })
    }

    setToDoDetails (task: ToDo) {
        const todoPopUp = document.getElementById("ToDo-details-form")
        if (!todoPopUp) {return}
        const tID = todoPopUp.querySelector("[data-form-info='Todo-ID']")
        if (tID) {tID.textContent = task.ID}
        var InputDescription = document.querySelector("#ToDo-details-form textarea[name='description']")
        if (InputDescription && InputDescription instanceof HTMLTextAreaElement){
            InputDescription.value = task.description
        }
        var InputType = document.querySelector("#ToDo-details-form select[name='team']")
        if (InputType && InputType instanceof HTMLSelectElement){
            InputType.value = task.discipline
        }
        const todoPopUpHeader = document.getElementById("Todo-Header")
        if (todoPopUpHeader && todoPopUpHeader instanceof HTMLDivElement){
            todoPopUpHeader.style.backgroundColor = task.color
        }
        var InputStatus = document.querySelector("#ToDo-details-form select[name='Istatus']")
        
        if (InputStatus && InputStatus instanceof HTMLSelectElement){
            InputStatus.value = task.status
        }
        var InputDate = document.querySelector("#ToDo-details-form input[type='date']")
        if (InputDate && InputDate instanceof HTMLInputElement){
            InputDate.value = task.DueDate.toLocaleDateString('en-CA')
        }
    }

//*******************************************Import/Export *********************************************************************************** */
    exportToJSON (fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], {type:'application/json'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON () {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) {return}
            const projects: IProject[] = JSON.parse(json as string)
            console.log(projects)
            for (const project of projects) {
                try {
                    const projectNames = this.list.map((project) => {
                        return project.name
                    })
                    const nameInUse = projectNames.includes(project.name)
                    if (nameInUse) {
                        const ExistingProject = this.getProjectByName(project.name);
                        if (ExistingProject) {
                            this.OverrideProject(ExistingProject, project)
                            console.log("El proyecto sobreescrito es: ")
                            console.log(ExistingProject)
                        }
                        
                    }
                    else {
                        this.newProject(project)
                    }
                    console.log("Proyecto agregado:")
                    
                } catch (error) {
                    window.alert(err) //Window is a global object and the method alert can be used without window.
                }
                
            }
            console.log(this.list)
        })
        input.addEventListener("change", () => {
            const filesList = input.files
            if (!filesList) {return}
            reader.readAsText(filesList[0])
        })
        input.click()
        
    }
}