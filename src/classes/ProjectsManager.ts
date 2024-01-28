import {IProject, Project} from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui:HTMLElement

    constructor (container: HTMLElement){
        this.ui = container
    }

    newProject (data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with the name " ${data.name} " is already in use`)
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project

    }

    private setDetailsPage (project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) {return}
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
        if (finishdate) {finishdate.textContent = project.finishdate.getUTCDate() + "/" + (project.finishdate.getUTCMonth()+1) + "/" + project.finishdate.getUTCFullYear()}
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
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }
        })
        input.addEventListener("change", () => {
            const filesList = input.files
            if (!filesList) {return}
            reader.readAsText(filesList[0])
        })
        input.click()
    }
}