/*

Usage: node getJobRotations.js [starting week number] [number of rotations (optional)]

Example Command Line Input: node getJobRotations.js 0 3

Example Output:
Rotation for week 0:
{
  job1: [ 'person1', 'person8' ],
  job2: [ 'person2', 'person7' ],
  job3: [ 'person3', 'person6' ]
}
Rotation for week 1:
{
  job1: [ 'person2', 'person1' ],
  job2: [ 'person3', 'person8' ],
  job3: [ 'person4', 'person7' ]
}
Rotation for week 2:
{
  job1: [ 'person3', 'person2' ],
  job2: [ 'person4', 'person1' ],
  job3: [ 'person5', 'person8' ]
}

Example Command Line Input: node getJobRotations.js 10

Example Output:
Rotation for week 10:
{
  job1: [ 'person3', 'person2' ],
  job2: [ 'person4', 'person1' ],
  job3: [ 'person5', 'person8' ]
}

Docs for customizing:
- Edit jobs.txt/people.txt to change the names of the jobs/people.
- You may add as many jobs/people as you like, as long as the number of people is twice as many as number of jobs.
- Each person/job name needs to be on a new line.
- Look inside runApp() comments to see more customization examples.

*/

const fs = require('fs').promises;
const path = require('path');

const secondsInADay = 24 * 60 * 60 * 1000;

Date.prototype.getWeekNumber = function () {
    const now = new Date();
    const dayNum = now.getUTCDay() || 7;
    now.setUTCDate(now.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    return Math.ceil((((now - yearStart) / secondsInADay) + 1) / 7)
}

Array.prototype.getItem = function (num) {
    return num < 0 ? this[this.length + num] : this[num]
}

const currentWeekNum = new Date().getWeekNumber();

const rotateArray = (arr) => {
    arr.push(arr.shift());
    return arr;
}

const createRotation = (weekNum, people, jobs) => {
    if (people.length < (jobs.length * 2)) {
        throw "There's not enough people"
    }
    let sortedPeople = [];

    while (weekNum > people.length) {
        weekNum -= people.length;
    }

    let i = weekNum;

    while (sortedPeople.length < people.length) {
        console.log(people.length - i);
        
        if (people[i]) {
            sortedPeople.push(people[i]);
            i++;
        } else {
            i = 0;
        }
    }

    return jobs.reduce((rotation, job, index) => {
        rotation[job] = [sortedPeople.getItem(index), sortedPeople.getItem(-index - 1)];
        return rotation;
    }, {});
}

async function getPeopleAndJobs() {
    try {
        return await Promise.all(
            ["people.txt", "jobs.txt"].map(async fileName => await fs.readFile(path.join(__dirname, fileName), { encoding: 'utf-8' }, function (err, text) {
                if (err) throw err;
                return text;
            }).then(text => text.split("\n")))
        );
    } catch (err) {
        console.log(err);
    }
}

async function getRotations(weekNumStart, numOfWeeks) {
    try {
        let rotations = [];

        const [people, jobs] = await getPeopleAndJobs();

        for (let i = 0; i < numOfWeeks; i++) {
            const weekNum = weekNumStart + i;
            const rotation = createRotation(weekNum, people, jobs);

            rotations.push({ weekNum, rotation });
        }
        
        return rotations;
    } catch (err) {
        console.log(err);
    }
}

async function runApp() {
    const weekNumStart = Number(process.argv[2]);
    const numOfWeeks = Number(process.argv[3]) || 1;
    
    const result = await getRotations(weekNumStart, numOfWeeks);

    for (item of result) {
        console.log("Rotation for week " + item.weekNum + ":");

        /* Simple Rotation, delete if you want to use formatted rotation */
        console.log(item.rotation);

        /* Delete below code if you want to use the basic version mentioned at the top. */

        /*

        This is where you get to decide what you want to do with the rotation.

        Format to your heart's content!

        Example for Excel and Google Sheets usage:

        INPUT:

        {
            job1: [ 'person1', 'person8' ],
            job2: [ 'person2', 'person7' ],
            job3: [ 'person3', 'person6' ]
        }

        OUTPUT:

        =SPLIT("job1","person1","person8")
        =SPLIT("job2","person2","person7")
        =SPLIT("job3","person3","person6")

        */
        console.log('\n');

        const formattedRotation = Object.keys(item.rotation).map(
            job => `=SPLIT("${job}","${item.rotation[job].join('","')}")`
        );
        formattedRotation.forEach(item=>console.log(item));

        /*

        Example for Slack usage:

        INPUT:

        {
            job1: [ 'person1', 'person8' ],
            job2: [ 'person2', 'person7' ],
            job3: [ 'person3', 'person6' ]
        }

        OUTPUT:

        :eyes: Job Rotation!!!
        job1: @person1 & @person8
        job2: @person2 & @person7
        job3: @person3 & @person6

        */

        console.log('\n');
        
        const formattedRotation2 = Object.keys(item.rotation).map(
            job => `${job}: @${item.rotation[job].join(' & @')}`
        );
        console.log(":eyes: Job Rotation!!!");
        formattedRotation2.forEach(item => console.log(item));
        
    }
}
runApp()