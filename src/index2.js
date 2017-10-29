import * as  Arena from 'bull-arena';
import * as Queue from 'bull';


import * as express from 'express';

const app = express();

const router = express.Router();
const queues = new Queue('pdf transcoding');

const arena = Arena({ queues });

router.use('/queue', arena);

// queues.process((job) => {
//     console.log(job);
//     return Promise.resolve(20);
// })

queues.add({some:"123"});

queues.add({"sjlj": 2123})

queues.on('completed', function(job, result){
    // Job completed with output result!
    console.log(result);
})

// app.use('/', router);
// app.listen(3000);

process.on("SIGTERM", () => {
    process.exit(0);
})

process.on("SIGKILL", () => {
    process.exit(0);
})