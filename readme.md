# Swapi Challenge

### Usage
```sh
npm install
npm start
```
By default server will listen on port 3000 at localhost: `http://localhost:3000`

###  Available endpoints
```http://localhost:3000/people/``` To get every Star Wars character.
```http://localhost:3000/people/:id``` To get an specific character using its id number.

### Logging
Is implemented in three different levels with `winston`, one level for use case.
For every request received some data will be logged to `./log/requests.log` using `info` level. If `warn` level is used on this logger instance, message will also be printed into console.
A `debug` level is used to output into the console every error for debugging purposes.
And an `error` level to dump into a file each error `./log/error.log`.

### Metrics
Usage statistics and metrics could be collected using a [StatsD](https://github.com/statsd/statsd) or a compatible service such as [Datadog](https://www.datadoghq.com/), and then have status dashboards with timelines, graphs and monitors for alarming anomalies, error spikes or simple analysing traffic and service usage.
Implemented (and commented) there are a few custom metrics (with custom tags) that together with other metrics provided by either a third party integrated service or the cloud host (such as [Cloudwatch](https://aws.amazon.com/cloudwatch/) for AWS) would give visibility over:
- Cache usage per endpoint.
- Amount of request getting a single character.
- Total characters in API over time.
- Spikes in errors, divided into status codes.

### Deployment
Could be done using feature branching during development and having a Continuos Integration & Continuos Deployment (CI/CD) service such as [Codeship](https://codeship.com/) and having different steps trigger once a merge is done against master.
Ideally, once a push is made into any branch a CI build will be started to verify code integrity, that is, complies with the linting and styling standard, has unit & integration tests and code coverage is above the minimun required (if applies).
Only then, and with the required code reviewers approvals, the PR will be able to be merged into a master or production branch.
When merging into master another build will be triggered and this time a new step for deployment will be executed, if we have a serverless stack such as [AWS Lambdas](https://aws.amazon.com/lambda/) it could be done with [Serverless Framework](https://serverless.com/) having a bash command similar to `sls package` `sls deploy` be executed and our Infrastructure as code configuration (Serverless yml) will determine what will be deployed. Or [AWS CodePipeline](https://aws.amazon.com/codepipeline/).
Other resources could also be deployed in this CD step using frameworks like [Terraform](https://www.terraform.io/) or [AWS CloudFormation](https://aws.amazon.com/cloudformation/).
