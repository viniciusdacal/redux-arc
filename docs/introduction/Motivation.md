# Motivation
More and more, applications has been developed using redux as its state manager. But, redux doesn't deal with side effects out of box. When we need to make async requests, in the most cases we use another libs such as [redux-saga](https://github.com/redux-saga/redux-saga), [observables](https://github.com/redux-observable/redux-observable), [cycles](https://github.com/cyclejs-community/redux-cycles), etc... The problem is that we end up writing and repeating a lot of code to make our request across the application.

There are approaches you can follow to make your experience better with them. But none of them makes you been productive or are flexible enough to work on different scenarios.

Arc was created to eliminate the pain of doing requests in redux apps. It is powerful by itself, but it lets you take full control when you need it!
