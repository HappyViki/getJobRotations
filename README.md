# getJobRotations
Have a bunch of chores or tasks you want to distribute across a team of people? This is the program for you!

This program is a command line tool. Built with `node v14`.

Just put in the jobs, people, starting week, and number of weeks you want.

And you're all set!

### Please feel free to send requests if you want to add/fix anything in my code :)

## Usage

Usage: `node getJobRotations.js [starting week number] [number of rotations (optional)]`

### Example Command Line Input: `node getJobRotations.js 0 3`

Example Output:

```
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
```

### Example Command Line Input: `node getJobRotations.js 10`

Example Output:

```
Rotation for week 10:
{
  job1: [ 'person3', 'person2' ],
  job2: [ 'person4', 'person1' ],
  job3: [ 'person5', 'person8' ]
}
```

## Customization
- Edit jobs.txt/people.txt to change the names of the jobs/people.
- You may add as many jobs/people as you like, as long as the number of people is twice as many as number of jobs.
- Each person/job name needs to be on a new line.
- Look inside runApp() comments to see more customization examples.

### Formatting Examples
```
INPUT:

{
    job1: [ 'person1', 'person8' ],
    job2: [ 'person2', 'person7' ],
    job3: [ 'person3', 'person6' ]
}
```

### Example for Excel and Google Sheets usage

```
OUTPUT:

=SPLIT("job1","person1","person8")
=SPLIT("job2","person2","person7")
=SPLIT("job3","person3","person6")
```

### Example for Slack usage

```
OUTPUT:

:eyes: Job Rotation!!!
job1: @person1 & @person8
job2: @person2 & @person7
job3: @person3 & @person6
```
