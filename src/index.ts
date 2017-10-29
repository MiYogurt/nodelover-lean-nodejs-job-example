import * as Kue from 'kue';

const queue = Kue.createQueue();

queue.on( 'error', function( err ) {
    console.log( 'Oops... ', err );
});

const job = queue.createJob('email', {
    title: 'welcome email for someone',
    to: 'vip@qq.com',
    template: 'welcome-email'
}).save((err) => {
    if(!err) {
        console.log(job.id);
    }
});

job.on('complete', function(result){
    console.log('Job completed with data ', result);
  
  }).on('failed attempt', function(errorMessage, doneAttempts){
    console.log('Job failed');
  
  }).on('failed', function(errorMessage){
    console.log('Job failed');
  
  }).on('progress', function(progress, data){
    console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
  });

process.once( 'SIGTERM', () => {
    queue.shutdown( 5000, function(err) {
        console.log( 'Kue shutdown: ', err||'' );
        process.exit( 0 );
    });
});

queue.process('email', 2, (job, done) =>　{
    new Promise((resolve, reject) => {
        console.log(job);
        resolve(job)
    }).then((job) => done(null, job)).catch(done)
})

// process.once('uncaughtException', function(err){
//     console.error( 'Something bad happened: ', err );
//     queue.shutdown( 1000, function(err2){
//     console.error( 'Kue shutdown result: ', err2 || 'OK' );
//         process.exit( 0 );
//     });
// });

Kue.Job.rangeByState( 'complete', 0, 1, 'asc', function( err, jobs ) {
    jobs.forEach( function( job ) {
      job.remove( function(){
        console.log( 'removed ', job.id );
      });
    });
  });
  

  Kue.app.listen(3000);

