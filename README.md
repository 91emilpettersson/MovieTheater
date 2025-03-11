# Movie Theater Booking System - Technical Assessment

## Overview

This is an application for a simplified movie theater booking system. Frontend is built using React and Typescript and backend is built using .NET Framework 4.8.1.

## Core Implementation

### Backend (.NET Framework)

The two core endpoints *api/theater/seats* and *api/theater/book* are accessed through the [TheaterController](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/API/Controllers/TheaterController.cs). A mediator pattern, using the MediatR-nuget, sends the requests to the [TheaterService](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/Domain/Services/TheaterService/TheaterService.cs) which is responsible for the domain logic (aka business logic). This in turn accesses and saves data in the [TheaterDataService](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/Data/Data/TheaterDataService/TheaterDataService.cs), which takes the place of a database. The TheaterDataService is a mock of a database and is not much more than a dictionary that is kept alive through the lifetime of the application. Dependency Injection is setup using the Autofac-nuget.

Using a ConcurrentDictionary implementing rollback on colliding bookings was considered to use for the mock database. But in the end a lock was chosen to deal with concurrent bookings. This is slower than the ConcurrentDatabase, but in a solution using a ConcurrentDatabase with rollback there could be a scenario where a booking that should go through does not. See for example:

User A books seats 1,2,3  
User B books seats 3,4,5  
User C books seats 5,6,7  
Assume C books seat 5 before B. The rollback then frees up 3 and 4 from B's booking.  
But B had already reserved 3 when A reaches it, so A is not allowed to book 1,2,3 even if the seats would be available in the end.  

Therefore the lock-solution is used instead and it should not be a bottleneck for a theater booking system, since it is unlikely that so many users try to book seats for the same movie at the same time that it slows down the application noticeably.

Splitting up the application in these many layers would be excessive for such a simple application, but the goal is rather to show a small example of how a bigger project could be designed. A real application would of course also use a real database.
    
### Frontend (React)
The frontend uses yarn for package managing and vite to get a development server with hot module replacement. ESLint is used to keep the code consistent (default rules).

The frontend consists of three main React components; [SeatGrid](https://github.com/91emilpettersson/MovieTheater/blob/main/frontend/src/components/SeatGrid.tsx), [SeatButton](https://github.com/91emilpettersson/MovieTheater/blob/main/frontend/src/components/SeatButton.tsx) and [BookButton](https://github.com/91emilpettersson/MovieTheater/blob/main/frontend/src/components/BookButton.tsx).
- SeatGrid represent the seat selection grid of the movie theater keep track of states and logic.
- SeatButton represents an individual seat, that is clickable when making a booking. The state of booking is represented by it's color; green for available, red for unavailable and blue for selected by user for booking. When it is unavaiable it will also display an X-character on it as a way to easier tell difference betweeen available and unavilable for color blind users.
- BookButton is a button that books the selected seats. A user may not book more than 6 seats per booking. A confirmation of a booking is shown as a toast. And if the booking would fail, the toast shows that.

## Part 2: Testing

### Backend

#### Unit tests
[Unit tests](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/Domain.Test/Services/TheaterServiceTest.cs) are added for the TheaterService to cover the domain logic. TheaterDataService is mocked using the Moq-nuget when constructing TheaterService in the test class.

#### Integration tests
There are two [integration tests](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/API.Test/Integration/TheaterIntegrationTest.cs), one that covers only a happy case and one that tests concurrent booking.

### Frontend

#### Unit tests
The frontend unit tests use vitest. Consideration to include the jest-dom library was made, since it would make the tests a bit more readable, but was in the end decided against since it did not feel right to mix vitest and jest. It could be confusing for a new developer as to which test framework is used in the application. All the unit tests follow the naming convention *theComponentBeingTested.test.tsx*.

There is a unit test for each react componenet mentioned above. They do not contain any advanced logic, but they at least tests that the components exist and behave in the way they are expected (e.g. SeatButton behaves like a button and can be clicked). There are also unit tests for the utility functions.

Run the test by running ´´´yarn test´´´ in command line.

#### Integration test

There is one integration test where the whole app is created and the happy case flow of the application is tested. Api calls to the backend are mocked.

Run the test by running ´´´yarn test´´´ in command line.

#### User interaction test
User interactions are tested using the [Playwright](https://playwright.dev/) library. There is again only one test for this, testing a happy case flow. This test is kept in the folder *playwright-tests* and is called *bookSeat.spec.ts*.

When running playwright first make sure to run your backend application and your front end application (see further instruction below).
Then you can run the playwright test with a user interface by running 

´´´yarn playwright test --ui´´´

in command line. This will also save a video of the test in test-results (a folder generated by playwright). This video is very short but can be stepped through to show the steps that are happening.

## Setting up and running the application.

### Backend
Open [MovieTheaterBackend.sln](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/MovieTheaterBackend.sln) from Visual Studio and run it, using API as the startup project. Take note of which URL your application is using (e.g. https://localhost:5000).

### Frontend
- Set the URL above as the BASE_URL in the config.json file.
- Install yarn. 
- Go to the [frontend](https://github.com/91emilpettersson/MovieTheater/tree/main/frontend) folder and run ´´´yarn install´´´ in command line.
- Run ´´´yarn dev´´´ in command line. And take note of which URL the application is using.
- Go to that URL in your favorite web browser.

## Testing strategy

### Unit tests
I want my unit tests to cover as small a part of the code as possible, so that it is obvious what part and functionality of the code has failed when the test fails.

### Integration tests
I have in this project made mostly made integration tests that cover the best case scenario in the user flow, but it tests that the different components of the code (in frontend and backend respectively) work well together

The exception is the ConcurrentBookings test in [TheaterIntegrationTest](https://github.com/91emilpettersson/MovieTheater/blob/main/BackEnd/API.Test/Integration/TheaterIntegrationTest.cs) where I do a lot of calls at the same time to an endpoint to see that there are no issues of concurrency, e.g. that many calls would result in booking the same theater seat. I would have liked to set an automatic repeat of this, since a test could pass once in a while by "luck" even if no measures against this was taken in the code (i.e. having a lock). This would require a more modern unit testing framework than the default one I used though, so my solution has been to manually repeat the ConcurringBookings test multiple times.

## Architecture explanation

### Frontend
For the frontend I have tried to keep error handling in the [API-class](https://github.com/91emilpettersson/MovieTheater/blob/main/frontend/src/api/Api.ts). In a larger project, or if this one would grow, it could be better to move it out to the components that are calling the API. This would make it possible to customize the error handling and error messages etc depending on the situation. Most of the logic has been placed in the [SeatGrid-component](https://github.com/91emilpettersson/MovieTheater/blob/main/frontend/src/components/SeatGrid.tsx) because it feels like the most natural representation of the movie theater as a whole. Where possible, logic has been extracted to utility functions in the [utils-folder](https://github.com/91emilpettersson/MovieTheater/tree/main/frontend/src/utils), this allows easy unit testing of it. CSS is done through StyledComponents to allow some dynamical styling and because it gives a nice overview of the component.
Unit tests are kept in a single folder [test](https://github.com/91emilpettersson/MovieTheater/tree/main/frontend/src/test) since the project is small enough that it is not hard to navigate it.

### Backend
The backend is split up in seperate projects to clarify their different areas of concern. The controller is kept in the API-project and is responsible for acccepting calls to the endpoints. This is also the startup project. Mediator-requests and handlers transfer data from the controller to the domain-layer. This makes it possible to change where the data is sent without changing the controller directly. These are kept in the Application-project. The domain logic is kept in the Domain-project and it makes calls to the mock-database that is in the Data-project. There is a lock to make sure that there are no concurrent operations on the database.

The project uses dependency injection, making use of public interfaces and internal classes that implement them. This makes it possible to switch out the implementation without changing the place where it is used and decreases coupling within the project. It also makes the project more secure and allows us to mock up classes by using the interfaces they implement.

There are two test projects. Domain.Test holds unit tests for the Domain logic. And API.Test holds the Integration Tests, it was chosen because the controller is the starting point of the Integration tests.

## Improvements if had more time
- I would have used a more modern .NET unit testing framework like NUnit or xUnit (if it is available outside of .NET Core). This would for example have allowed automatic repetition of the integration test.
- Building a more advanced database, associating bookings with some kind of User Id and seperating bookings between different movies.
- More integration -and user interaction tests, testing more complex scenarios; like selecting and unselecting seats or trying to book already booked seats, or trying to book too few (zero) or too many seaets.
- Playwright is not completely correctly setup, a test will not reset the test environment. So the happy case test will book the first seat, but if it is run directly again, the seat will already be booked and unavailable so the test will fail the second time.
- Deploying the application to Azure Static Web Application (frontend) and Azure App Service (backend).
- Some kind of simple CI/CD pipeline, running tests and deploying.
- Putting some time into figuring out how not to set json serialization to camelcase in two spots in backend code. Now it is done directly in the controller, this is not nice.
- Other color for the seats that are just booked by a user, to seperate them from previously booked seats and give the user an indication of succesful booking.
- More flexible CSS for movie theaters of different size and layout, now it forces columns of ten.

## How I would mentor junior developers

I would encourage pair programming and try to promote discussion of how we both think while developing code. Try to explain why we make the choices we do, and asking each other why the other does what they do when it is not obvious. I would also try to influence them in considering the whole code base when making changes; will the part that is changed affect the whole? In that case, how? Hopefully I could also make them feel comfortable in asking me questions by being nice and pleasant when asked, and giving them my time and attention. And if I could not spare my time or attention at a certain moment, try to defer them to another colleague or another time. This is also true for giving comments on code reviews.

## AI tools have been used in the following way:
The AI tools ChatGPT and DeepSeak have been used in the following cases:
- Asking for CSS that corresponds to a certain styling. 
- Aksing for some react functionality (e.g. "Can I catch specific errors in react?")
- Asking for a skeleton template of a vitest unit test.
- Asking for mocking of toast.
- Asking for how to setup the integration test to start running the Web App automatically.
- Asking about the use cases for lock compared to ConcurrentDictionary to deal with concurrent calls to the endpoints. In the end the opposite method of what was suggested by DeepSeak was used, since the AI's suggestion didn't seem appropriate or trustworthy for the case of this application. However asking the AI aided in coming to a conclusion of what to do.
