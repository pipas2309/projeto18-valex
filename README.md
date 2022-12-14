<h1 align="center">Welcome to Valex 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.9.5-blue.svg?cacheSeconds=2592000" />
</p>

## This is a backend project <sub style="font-size:14"><em>#18</em></sub>
> It is a project for learning, its main functions are:<br /><br />
> Learn to use Typescript;<br />
> Implement a benefit card API;<br />
> API must follow the Layered Architecture;<br />
> API will be responsible for creating, reloading, activating, as well as processing purchases;<br />

### 🏠 [Homepage](https://github.com/pipas2309/projeto18-valex#readme)

<br>

## Usage


### <strong>Card</strong> routes

*  /create-card
    * req. headers: 'x-api-key'
    * req. body: { employeeId, type }
    * <em>res.send(<strong>card info</strong> and <strong>card securit code(cvc)</strong></em>* 
*  /activate-card
    * req. body: { id, cvc, password }
*  /card-view/:id
*  /block-card
    * req. body: { id, password }
*  /unblock-card
    * req. body: { id, password }
    
<br>*used only for testing
### <strong>Payment</strong> routes

*  /recharge/:id
    * req. headers: 'x-api-key'
    * req. body: { amount }
*  /payment
    * req. body: { cardId, businessId, amount, password }
*  /online-payment
    * req. body: { number, cardholderName, expirationDate, securityCode, businessId, amount }

## Bugs

"errorHandler" needs to be fixed as it is having problems with promises.
If you want to test it, use:
    
``` 
throw new CustomError(
                'message', 
                statusCode, 
                'aditional info'
                );
```
and
```
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
```
for tracking.<br>
<strong>Errors are currently being handled, but they only appear in the console.log</strong>

# 

## Author

👤 **Lucas Palharini**

* Website: [LinkedIn](https://www.linkedin.com/in/lucas-palharini-749799166/)
* Github: [@pipas2309](https://github.com/pipas2309)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Lucas Palharini](https://github.com/pipas2309).<br />
This project is [ISC](https://github.com/pipas2309/projeto18-valex/blob/master/LICENSE) licensed.
