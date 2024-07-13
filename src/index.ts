import { Discipline, IProject, IToDo, IssueStatus, ToDo, Type, status } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";


// This document is provided by the browser and its purpose is to interact with the web site
//funcion para activar o desactivar un project form
function toggleModal(id: string, action: boolean) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        (action == true) ? modal.showModal() : modal.close()
    } else {
        console.warn("The provided modal wasn't found. ID: ", id)
    }
}

// The project card is created
const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)
// Default project card
const defaultProjectData: IProject = {
    name: "Default Project Name",
    description: "Default Project Description",
    type: "Residential",
    status: "Active",
    finishdate: new Date("2000/1/1"),
    backgroundColor: "#ca8134",
    ToDoList: []
}
projectsManager.newProject(defaultProjectData)

// This document object is provided by the browser, and its main purpose is to help us interact



//Botones de sidebar *****************************************************************************************
const newProjectBtn = document.getElementById("new-project-btn")
const projectsPageBtn = document.getElementById("projects-page-btn")
const usersPageBtn = document.getElementById("users-page-btn")
const editProjectBtn = document.getElementById("edit-project-btn")
const addToDoBtn = document.getElementById("add-ToDo-btn")

const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")
const usersPage = document.getElementById("users-page")


if (projectsPageBtn) {
    projectsPageBtn.addEventListener("click", () => {
        if (!projectsPage || !detailsPage || !usersPage) {return}
        detailsPage.style.display = "none"
        projectsPage.style.display = "flex"
        usersPage.style.display = "none"
    })
} else {
    console.warn("Projects page button was not found")
}
if (usersPageBtn) {
    usersPageBtn.addEventListener("click", () => {
        if (!projectsPage || !detailsPage || !usersPage) {return}
        detailsPage.style.display = "none"
        projectsPage.style.display = "none"
        usersPage.style.display = "flex"
    })
} else {
    console.warn("Users page button was not found")
}

//NEW PROJECT BUTTON*****************************************************************************************
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal",true)})
} else {
    console.warn("New projects button was not found")
}

// Sumbit form from add new project
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement){
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const initialsColor = ["#57CCB7","#CC5650","#CC8213","#82CC08","#BC67CC",]
        const formData = new FormData(projectForm)
        let defaultDate = (formData.get("finishdate")=="")? new Date("2000-1-1"): new Date(formData.get("finishdate") as string + 'T00:00:00')
        const ProjectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            type: formData.get("type") as Type,
            status: formData.get("status") as status,
            finishdate: defaultDate,
            backgroundColor: initialsColor[Math.floor(Math.random() * 5)],
            ToDoList: []

        }
        try {
            const project = projectsManager.newProject(ProjectData)
            projectForm.reset()
            toggleModal("new-project-modal",false)
            console.log(project)

        } catch (err) {
            window.alert(err) //Window is a global object and the method alert can be used without window.
        }
    })
    const cancelBtn = document.getElementById("cancel-btn")
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            projectForm.reset
            toggleModal("new-project-modal",false)})
    } else {
        console.warn("cancel button was not found")
    }
} else {
    console.warn("The project form was not found. Check the ID!")
}

// Edit project button*******************************************************

if (editProjectBtn) {
    editProjectBtn.addEventListener("click", () => {
        if (detailsPage) {
            toggleModal("edit-project-modal",true)
            var ActiveProject = projectsManager.activeProject()
            if (ActiveProject){projectsManager.PrePopForm(ActiveProject)}
        }
    })

} else {
    console.warn("Edit project button was not found")
}

// Sumbit form from edit project
const editProjectForm = document.getElementById("edit-project-form")
if (editProjectForm && editProjectForm instanceof HTMLFormElement){
    editProjectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const initialsColor = ["#57CCB7","#CC5650","#CC8213","#82CC08","#BC67CC",]
        const formData = new FormData(editProjectForm)
        console.log ("el form data es : " + formData)
        let defaultDate = (formData.get("finishdate")=="")? new Date("2000-1-1"): new Date(formData.get("finishdate") as string + 'T00:00:00')
        const ProjectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            type: formData.get("type") as Type,
            status: formData.get("status") as status,
            finishdate: defaultDate,
            backgroundColor: initialsColor[Math.floor(Math.random() * 5)],
            ToDoList: []

        }
        try {
            if (detailsPage) {var ProjectName = detailsPage.querySelector("[data-project-info='name']")?.textContent}
            if (ProjectName && typeof ProjectName === "string") {var ActiveProject = projectsManager.getProjectByName(ProjectName)}
            if (ActiveProject){
                projectsManager.editProject(ActiveProject,ProjectData)  // Se edito bien pero no se actualizo el UI
                editProjectForm.reset()
                toggleModal("edit-project-modal",false)
            } // active project variable doesnt exist in this block

        } catch (err) {
            window.alert(err) //Window is a global object and the method alert can be used without window.
        }
    })
    const cancelBtn = document.getElementById("cancel-btn-edt")
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            editProjectForm.reset
            toggleModal("edit-project-modal",false)})
    } else {
        console.warn("cancel button was not found")
    }
} else {
    console.warn("The project form was not found. Check the ID!")
}

//*************************************************************TO DOs ***************************************************************************** */
// The To Do is created
const newtodoForm = document.getElementById("new-ToDo-form")

if (newtodoForm && newtodoForm instanceof HTMLFormElement){
    newtodoForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const toDoformData = new FormData(newtodoForm)
        console.log(toDoformData.get("DueDate"))
        let defaultToDoDate = (toDoformData.get("DueDate")=="")? new Date("2000-1-1"): new Date(toDoformData.get("DueDate") as string + 'T00:00:00')
        console.log(defaultToDoDate)
        var ActiveProject = projectsManager.activeProject()
        if (ActiveProject) {
            let Todoindex = ActiveProject.ToDoList.length+1
            const ToDoData: IToDo = {
                ID: "ID"+Todoindex.toString(),
                description: toDoformData.get("description") as string,
                discipline: toDoformData.get("Discipline") as Discipline,
                status: "Open",
                DueDate: defaultToDoDate,
                color: "#B5180B",
            }
            try {
                const ToDo = projectsManager.newToDo(ActiveProject,ToDoData)
                newtodoForm.reset()
                toggleModal("new-ToDo-modal",false)
                console.log(ToDo)
            } catch (err) {
                window.alert(err) //Window is a global object and the method alert can be used without window.
            }
        }
    })
    const ToDocancelBtn = document.getElementById("ToDo-cancel-btn")
    if (ToDocancelBtn) {
        ToDocancelBtn.addEventListener("click", () => {
            newtodoForm.reset
            toggleModal("new-ToDo-modal",false)})
    } else {
        console.warn("cancel button was not found")
    }
} else {
    console.warn("The form was not found. Check the ID!")
}


// Sumbit form from edit ToDo
const toDoDetailsForm = document.getElementById("ToDo-details-form")
if (toDoDetailsForm && toDoDetailsForm instanceof HTMLFormElement){
    toDoDetailsForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const toDoformData = new FormData(toDoDetailsForm)
        let selDate = (toDoformData.get("DueDate")=="")? new Date("2000-1-1"): new Date(toDoformData.get("DueDate") as string + 'T00:00:00')
        switch (toDoformData.get("Istatus") as IssueStatus){
            case "Open":
                var IssueColor = "#B5180B";
                break;
            case "Solved":
                var IssueColor = "#13A007";
                break;
            case "In Progress":
                var IssueColor = "#E5DE0D";
                break;
            case "Closed":
                var IssueColor = "#B3B5B4";
                break;
            
        }
        if (detailsPage) {var ActiveTodoID = detailsPage.querySelector("[data-form-info='Todo-ID']")?.textContent}
        const ToDoData: IToDo = {
            ID: ActiveTodoID as string,
            description: toDoformData.get("description") as string,
            discipline: toDoformData.get("team") as Discipline,
            status: toDoformData.get("Istatus") as IssueStatus,
            DueDate: selDate,
            color: IssueColor,

        }
        console.log(ToDoData)
        try {
            
            if (ActiveTodoID && typeof ActiveTodoID === "string") {
                var IDnum = parseInt(ActiveTodoID?.split('D')[1])
                //console.log(IDnum)
                const updatedTodo = projectsManager.editToDo(IDnum-1,ToDoData)  
                if (updatedTodo){
                //console.log(updatedTodo.DueDate.toLocaleDateString('es-CO'))
                updatedTodo.updateToDoUI()
                toDoDetailsForm.reset()
                toggleModal("ToDo-details-modal",false)
            }} // active project variable doesnt exist in this block

        } catch (err) {
            window.alert(err) //Window is a global object and the method alert can be used without window.
        }
    })
} else {
    console.warn("The project form was not found. Check the ID!")
}



// Boton de agregar ToDo ***************************************************
if (addToDoBtn) {
    addToDoBtn.addEventListener("click", () => {toggleModal("new-ToDo-modal",true)})
    }

else {
    console.warn("Add To Do button was not found")
}

const ToDoItem = document.getElementById("To-Do-List")
if (ToDoItem) {
    ToDoItem.addEventListener("click", () => {
        toggleModal("ToDo-details-modal",true)
    })
}

//Programar listener para exportar projectos
const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", () => {
        projectsManager.exportToJSON()
    })
}
//Programar listener para importar projectos
const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {
        projectsManager.importFromJSON()
    })
}
