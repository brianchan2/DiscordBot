import hapi, { server } from "@hapi/hapi"

export default class {

    constructor() {

    }

    async create() {
        this.server = hapi.server({
            port: "3000"
        })

        await this.server.start();

        console.log("Server is running on http://localhost:%s", this.server.settings.port)

        return this
    };

    async addRoutes(method, path, handler) {
        try {
            this.server
        }
        catch {
            console.log("You must use create method first!")
            return
        }

        this.server.route({
            method: method,
            path: path,
            handler: handler
        })
    }
}