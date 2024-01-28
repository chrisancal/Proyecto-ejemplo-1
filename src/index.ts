import { IProject, Type, status } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";


// This document is provided by the browser and its purpose is to interact with the web site

function toggleModal(id: string, action: boolean) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        (action == true) ? modal.showModal() : modal.close()
    } else {
        console.warn("The provided modal wanst found. ID: ", id)
    }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)
// Default project card
const defaultProjectData: IProject = {
    name: "Default Project Name",
    description: "Default Project Description",
    type: "Residential",
    status: "Active",
    finishdate: new Date("2000-1-1"),
}
projectsManager.newProject(defaultProjectData)

// This document object is provided by the browser, and its main purpose is to help us interact
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal",true)})
} else {
    console.warn("New projects button was not found")
}
const projectsPageBtn = document.getElementById("projects-page-btn")
if (projectsPageBtn) {
    projectsPageBtn.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!projectsPage || !detailsPage) {return}
        detailsPage.style.display = "none"
        projectsPage.style.display = "flex"
    })
} else {
    console.warn("New projects button was not found")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement){
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectForm)
        const ProjectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            type: formData.get("type") as Type,
            status: formData.get("status") as status,
            finishdate: new Date(formData.get("finishdate") as string),
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

const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", () => {
        projectsManager.exportToJSON()
    })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {
        projectsManager.importFromJSON()
    })
}
