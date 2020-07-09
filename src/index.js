const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4')

const app = express()

app.use(cors())

app.use(express.json())

const projects = []

function validateProjectId(request, response, next) {

    const { id } = request.params

    if (!isUuid(id)) {
        return response.status(400).json({
            message: "Invalid project ID!"
        })
    }

    return next()
}

function logRequest(request, response, next) {

    const { method, url } = request

    console.time(`> Server Log 👀: ${method} -> ${url}`)

    next()

    console.timeEnd(`> Server Log 👀: ${method} -> ${url}`)

    return
}

app.use(logRequest)

app.use('/project/:id', validateProjectId)

app.get('/project', (request, response) => {

    const { title } = request.query

    const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects

    response.status(200)

    return response.json(results)

})

app.post('/project', (request, response) => {

    const { title, owner } = request.body

    const project = {
        id: uuid(),
        title,
        owner
    }

    projects.push(project)

    return response.json({
        message: "Susscessfully added",
        id: project.id
    })
})

app.put('/project/:id', (request, response) => {

    const { id } = request.params
    const { title, owner } = request.body

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return response.status(400).json({
            message: 'Project not found.'
        })
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project

    return response.json({
        message: "Successfully altered."
    })
})

app.delete('/project/:id', (request, response) => {
    const { id } = request.params

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return response.status(400).json({
            message: 'Project not found.'
        })
    }

    projects.splice(projectIndex, 1)

    return response.status(204).send()
})

app.listen(3333, () => {
    console.log('> Server ⬆: Listening on Port 3333')
})