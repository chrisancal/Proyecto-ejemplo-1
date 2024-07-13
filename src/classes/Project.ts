import { v4 as uuidv4 } from "uuid"
export type Type = "Residential" | "Comercial" | "Infrastructure" | "Industrial"
export type status = "Pending" | "Active" | "Finished"
export type IssueStatus = "Open" | "Solved" | "In Progress" | "Closed"
export type Discipline = "Architecture" | "Structure" | "Mechanical" | "Electrical" | "HVAC" | "Infrastructure"

export interface IProject {
    name: string
    description: string
    type: Type
    status: status
    finishdate: Date
    backgroundColor: string
    ToDoList: ToDo []
}

export interface IToDo {
    ID: string
    description: string
    discipline: Discipline
    status: IssueStatus
    DueDate: Date
    color: string
}

export class Project implements IProject {
    //To satisfy Iproject
    name: string
    description: string
    type: Type
    status: status
    finishdate: Date
    backgroundColor: string

    //Class internals
    ui: HTMLDivElement
    id: string
    ToDoList: ToDo []

    constructor (data: IProject){
        //Project data definition
        for (const key in data){
            if (key != "ui" && key != "ToDoList" ) {
                this[key] = data[key]
                //console.log("The key: "+ String(key) + " Se agrego exitosamente")
            }
        }
        this.ToDoList = []
        if (typeof(this.finishdate) == "string"){this.finishdate = new Date(this.finishdate)}

        if (!this.id) {this.id = uuidv4()}
        this.setUI()


        
    }
    setUI () {
        //Project card UI
        if (this.ui) {return}
        
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.updateUI()

    }
    

    updateUI () {
        //Project card UI
        console.log("Updating UI")
        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: ${this.backgroundColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${this.name.slice(0,2).toUpperCase()}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Type</p>
                <p>${this.type}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Finish date</p>
                <p>${this.finishdate.toLocaleDateString("es-CO")}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
        </div>`

    }
}


export class ToDo implements IToDo {
    //To satisfy Iproject
    ID: string
    description: string
    discipline: Discipline
    status: IssueStatus
    DueDate: Date
    color: string

    //Class internals
    ui: HTMLDivElement
    id: string

    constructor (data: IToDo){
        //To-Do data definition
        for (const key in data){
            if (key != "ui") {
                this[key] = data[key]
            }
        }
        if (!this.id) {this.id = uuidv4()}
        if (typeof(this.DueDate) == "string"){this.DueDate = new Date(this.DueDate)}
        this.setToDoUI()

        
    }


    setToDoUI () {
        //To-Do card UI
        this.ui = document.createElement("div")
        this.ui.className = "todo-item"
        this.updateToDoUI()
    }

    updateToDoUI () {
        // To-Do card UI
        this.ui.innerHTML = `
            <div style="display: flex; column-gap: 15px; align-items: center; justify-content: space-between;">
                <p style="padding: 10px; background-color: ${this.color}; border-radius: 10px;">${this.ID}</p>
                <p>${this.description}</p>
                <p style="text-wrap: nowrap; margin-left: 10px;">${this.DueDate.toLocaleDateString("es-CO")}</p>
            </div>`
    
    }

}