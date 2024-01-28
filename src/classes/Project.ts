import { v4 as uuidv4 } from "uuid"

export type Type = "Residential" | "Comercial" | "Infrastructure" | "Industrial"
export type status = "Pending" | "Active" | "Finished"

export interface IProject {
    name: string
    description: string
    type: Type
    status: status
    finishdate: Date
}

export class Project implements IProject {
    //To satisfy Iproject
    name: string
    description: string
    type: Type
    status: status
    finishdate: Date

    //Class internals
    ui: HTMLDivElement
    id: string

    constructor (data: IProject){
        //Project data definition
        for (const key in data){
            if (key != "ui") {
                console.log(key)
                this[key] = data[key]
            }
        }
        if (!this.id) {this.id = uuidv4()}
        this.setUI()

        
    }
    //<p>${this.finishdate.getUTCDay() + "/" + (this.finishdate.getUTCMonth()+1) + "/" + this.finishdate.getUTCFullYear()}</p>
    setUI () {
        //Project card UI
        if (this.ui) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
        <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">MH</p>
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
                <p>${this.finishdate}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
        </div>`

    }
}