/**
 * [P]ara[W]orker
 */
var cluster = require("cluster");

function getRandWorker(max) {
    max--;
    var result = Math.floor(Math.random() * (max - 1 + 1)) + 1;
    console.log('Worker #'+result);
    return result;
}

if(cluster.isMaster)
{
    var cp = require('child_process');
    var numCPUs = require('os').cpus().length;
    var workers = [];
    console.log("CPU number: "+numCPUs);

    /**
     * Create the threads
     */
    for(var i = 0; i < numCPUs;i++)
    {
        /**
         * Fork the thread
         */
        var worker = cluster.fork();
        /**
         * Insert the thread into an array
         * to be acessed later
         */
        workers.push(worker);
    }

    /**
     * This is an example function that send some data to the worker
     */
    console.log('Send some data to some worker');
    workers[getRandWorker(workers.length)].send({message: 'Hello worker'});

    /**
     * Each time you execute workers[getRandWorker(workers.length)] it returns a rand worker process
     */
    console.log('Send some data to random workers');
    for(var i = 0; i < 10;i++)
    {
        workers[getRandWorker(workers.length)].send({message: 'Hello worker'});
    }
    


    cluster.on('online', function(worker) {
        //console.log('Worker #'+worker.id+' online!');
    });
    cluster.on('exit',function(worker) {
        //console.log('Worker #'+worker.id+' died :(');
    });
    
    
}else if(cluster.isWorker) {
    process.on('message',function(data) {
        console.log('Recived data: '+data.message);
    });
}
