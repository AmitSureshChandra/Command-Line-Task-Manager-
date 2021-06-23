const EventEmitter = require('events')

class Server extends EventEmitter{
    constructor(client){
        super()
        this.tasks = {}
        this.taskId = 0;
        process.nextTick(() => {
            this.emit(
                'response',
                'Type a command(help to list commands)'
            )
        })

        this.client = client
        client.on('command', (command, args) =>{
            // help add ls delete
            switch (command) {
                case 'help':
                case 'add':
                case 'ls':
                case 'delete':
                    this[command](args)
                    break
                default:
                    this.emit('response','Unknown Command')
                    break;
            }
        })
    }

    help(){
        this.emit('response', `Available Commands: 
- add task 
- ls 
- delete :id`)
    }

    add(args){
        this.tasks[this.taskId++] =  args.join(' ')
        this.emit('response',`Added task ${this.taskId}`)
    }

    ls(){
        this.emit('response', `Tasks: \n${this.taskString()}`)
    }

    delete(args){
        delete(this.tasks[args[0]])
        this.emit('response', `Deleted Task ${args[0]}`)
    }

    taskString(){
        let tasks = Object.keys(this.tasks);
        if (tasks.length === 0) {
            return `No tasks`
        }

        return tasks.map(key => {
            return `${key + 1}: ${this.tasks[key]}`
        }).join("\n")
    }
}

module.exports = (client) => new Server(client)