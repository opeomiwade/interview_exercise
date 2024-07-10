# Unibuddy Engineering Exercise

This exercise is based on the deployed Unibuddy Chat service. The chat service is a core component in our product suite. 
We've based our interview exercise on this code so you can get a feel of the code and products you'd been working on, and we can understand how you would adapt to working with our code base! 


## Chat Service

Chat service provides GraphQL and Rest interfaces to our chat API. We mostly use GraphQL for interacting with it. 

The service is built on [Nest](https://github.com/nestjs/nest), using TypeScript.
We use [Jest](https://jestjs.io/docs/getting-started) for testing and encourage Test Driven Development. 


## Prep
You'll want the following tools installed to help in the exercise:

| Dependency  | Install link |
|------|-----|
|Docker | https://docs.docker.com/get-docker/ |
|Nodejs | https://nodejs.org/en/download/package-manager|
|Nvm | https://github.com/nvm-sh/nvm/blob/master/README.md |

### Usage

cd to the repo (you'll fork and clone this in the exercise itself.)

First, get the supporting services running:

```bash
$ docker compose up -d
```

next, switch to the right versions of node, etc

```bash
$ nvm use
```

Finally, install the require dependencies

```bash
$ npm install
```

Once this is complete, you should be good the run the code - check package.json for examples of what functions are alreasy defined. 

e.g.

```bash
$ npm run test
```

# Interview Exercise

The exercise is broken into 3 parts. To attempt the exercise, we'd like you to fork this repo, making the changes to your own version of the code. 
We encourage you to submit solutions to each part of the exercise as seperate commits, back to your fork, so that it's easier to follow and discuss. 

When you've completed the exercise, please add the following github handles to your fork, so we can review your submission:

https://github.com/davidbebb
https://github.com/RichUnibuddy
https://github.com/anlauren

We encourage pair programming, but do want the exercise to be fair, so please make sure you can complete the exercise solo and explain your work. 

## Part 1

The service fails to start - ```npm run start:dev``` -  Use the messages to fix the code, so that the service runs successfully

## Part 2

A test is failing - ```npm run test``` - implement the code necessary to pass the test

## Part 3 - Strech

Currently, we allow tags to be added to a conversation, so we can help users to find things they're interested in.

We would like to extend the functionality, to allow the sender of a message to add or update tags on a single message, and allow other users to find messages based on these tags.

While we don't expect everyone to complete this part of the exercise, it will form the basis of disucssion in an interview. Please make as much progress with this, as you feel comfortable doing. Don't allow it to be all-consuming. A couple of hours at most for all parts of the exercise. 

We'd love to hear about
* How you would go about implementing the solution
  
  The first thing I did when it came to implementing the functionality for update tags and find message with tags, was look through the codebase. I wanted to ensure I had an             understanding of teh codebase and what the various methods in the DAOs, DTOs and Service layer were responsible for , so I could make informed decisions on what methods
  would help me implement my solution.

  After reading through the code base, I began implementing the functionality for find tags and update tags methods. I ensurec tags for the message were kept at message
  level to ensure that they were different from the tags used for conversations. I also made used of the `throwForbiddenErrorIfNotAuthorized()` method to ensure only users with
  valid permissions can update/add/remove tags on the message. All teh business logic for the updates tags was handled in the `message.logic.ts` file, I ensured to check if the
  user wanted add new tags or wanted to removed tags via providing an two array params in the method defintion. A `tagsToRemove` and `tags` array parameters, both are optional,
  therefore if tagsToRemove id provided when the method is called the `message.logic.ts`(service layer) `updateTags()` method handles the logic for removing tags and then passes
  the updated tags to `message.data.ts`(DAO) to persist the change and same goes for if the `tags` is provided in the method call.

  The find message with tags was implemented using the mongodb `$in` operator to create a query. `{ tags: { $in: tags } }`, if the tags field in the document contains values that are 
  match any of the values in provided tags array parameter then add the document to the result. All messages are the transformed using `chatMessagToObject()` and then returned. The 
  `message.logic.ts` method just check user is authorized for   the action and call the DAO method.

  After implementing the methods, I proceeded to write unit tests for both and made necessary changes to my implementations when test failed.
  
* What problems you might encounter
  
    The main challenge was my unfamiliarity with jest, I did not understand the syntax initially but I was able to grasp it quickly after looking through multiple tests as I have 
    experience using another testing framework JUnit in Java, which follows similar principles. It made it easier for me to understand it.
  
* How you would go about testing
  
    I wrote unit tests for my newly implememnted find tags and update tags method to ensure they perist as they should. To test the business logic for both methods, I would
    have written tests for the business logic methods to ensure they work as they should. This is ometjing I am yet to do but plan on doing.

* What you might do differently
  
  The main thing I would have done differently is taking a test driven development approach rather than iterative development.I would have written the tests first
  before jumping into the implementation of teh functionality. It would have helped me identify issues wth my solution earlier on and potentially have sped up the
  implementation process.

# Additional
The following docs are from the live service repo. You may find them helpful. 


# development
$ npm run start:dev
```

You are now able to make requests to the api.
There are two interfaces; a [rest interface](http://localhost:3000/api), and a [graphql interface](http://localhost:3000/graphql).


The rest interface allows a client to set up a new conversation, and to manage who has access to it.

The graphql interface allows users to send and recieve messages in the conversations that they are in.


You can create a conversation through the [Swagger UI](http://localhost:3000/api) to attain a conversationId (to use with the graphql end points). Some of the requests require authorization. Select the `Authorize` button (top right of the screen) and enter the key `ssssh`. To create a conversation select `Try it out` in POST /conversation.

## Structure

The code in each module is separated into 3 layers
1) controllers and/or resolvers: These provide the external interfaces for the REST and Graphql interfaces respectively, and passes the request to the logic layer
2) logic: This implements common business rules, and can make requests to other modules and the repository layer to fulfil the request.
3) repository: This manages hwo data is stored in the module. It should only be used directly by the logic layer.


my-app/
├─ src/                             
│  ├─ example-graphql/              # Example module
│    ├─ example-graphql.module.ts
│    ├─ example-graphql.repository.spec.ts
│    ├─ example-graphql.repository.ts --------- Controls how the data is stored
│    ├─ example-graphql.resolver.spec.ts
│    ├─ example-graphql.resolver.ts ----------- Provides the external interface for the service
│    ├─ example-graphql.logic.spec.ts
│    ├─ example-graphql.logic.ts -------------- Implements common business logic
│  ├─ app.module.ts
│  ├─ main.ts

## Testing

- Unit test file of each file is created in the same path under name of <fileName>.spec.ts
- E2e tests are in test folder
- Jest is used for creating these tests.

To run the unit tests you wil need to have the databases running - run `docker compose up -d`

```bash
# unit tests
$ npm run test
$ npm run test:watch

# e2e tests - the service needs to be running - see Running the app
$ npm run test:e2e
$ npm run test:e2e:watch

```


## Mocking the unibuddy_api end point (e.g /api/v1/users/)

You may want to mock data from the ub_internal_api end points. We can do this using [Mock Server](https://www.mock-server.com/)


For `/api/v1/users/{$userId}` an example would be 

url: /api/v1/users/599ebd736a1d100004aeb744

```
{
"account_role": "university",
"email": "edinburgh+admin@unibuddy.co",
"first_name": "Uni",
"id": "599ebd736a1d100004aeb744",
"last_name": "Admin",
"profile_photo": null
}
```
