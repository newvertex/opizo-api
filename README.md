# opizo-api
[![NPM](https://nodei.co/npm/opizo-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/opizo-api/)  

 opizo.com shortener api module for node.js. (client)  
 All functions return a promise  

[Persian version of readme](http://newvertex.blog.ir/post/%D8%A7%D9%86%D8%AA%D8%B4%D8%A7%D8%B1-%D9%85%D8%A7%DA%98%D9%88%D9%84-opizo-api-%D8%A7%D8%B3%D8%AA%D9%81%D8%A7%D8%AF%D9%87-%D8%B1%D8%A7%D8%AD%D8%AA-%D8%AA%D8%B1-%D8%A7%D8%B2-%D8%B3%D8%A7%DB%8C%D8%AA-%DA%A9%D9%88%D8%AA%D8%A7%D9%87-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%DB%8C-%D9%84%DB%8C%D9%86%DA%A9-%D8%A7%D9%BE%DB%8C%D8%B2%D9%88-%D8%AF%D8%B1-Node-js)

## Installation
with npm:
```bash
$ npm install --save opizo-api   

```
or with yarn:  
```bash
$ yarn add opizo-api
```
## Example
**Request to get short url:**
```js
const opizo = require('opizo-api');

// Not need to setUsername you can use without login

// Just request to short a url
opizo('http://example.com')
  .then((result) => {
    console.log(`Short url: ${result.shortUrl}\nRequested url: ${result.url}`);
  })
  .catch((err) => {
    console.log(err.message, err.rp.message); console.log(`Requested url: ${err.result.url}`);
  });
```
**Request to get short url and file info:**
```js
const opizo = require('opizo-api');

// Optional (you can leave it blank or just don't call this function)
// username on here or set as environment varialbe
opizo.setUser('')

// Request to short a url and get file name and size info
opizo.extra('http://bayanbox.ir/thumb/8633283754319788500/GitHub-Logo.jpg')
  .then(result => {
    console.log(`Short url: ${result.shortUrl}\nRequested url: ${result.url}`);
    console.log(`fileName: ${result.fileInfo.name}\nfileSize: ${result.fileInfo.sizeInMB}`);
  })
  .catch(err => {
    console.log(err.message, err.rp.message);
    console.log(`Requested url: ${err.result.url}`);
  });

```
## functions
Use main function, when you require module you can use it as function like below(opizo is the variable name but after required it is main function):  
```js
const opizo = require('opizo-api');
```
  * `opizo(your-url)`: request short link
  * `opizo.extra(your-url)`: request short link & file info
  * `opizo.setUse(your-username)`: optional, set the username to make your link manageable, you can also use environment variable like this:
  ```bash
  $ export OPIZO_USERNAME='your-user-name-here'
  ```
  or just don't call this function.

## Result object
On main function returned result object have below property:  
  * `url`: Requested url
  * `shortUrl`: short url if request not failed

On extra function returned result object have below property:  
  * `url`: Requested url
  * `shortUrl`: Short url if request not failed
  * `fileInfo`: File info if request not failed
    * `name`: File name if exists
    * `sizeInMB`: File size in pretty format
    * `contentLength`: File size in kb

## `err` object
Error object on catch have below property:
  * `code`: Internal error code
  * `message`: Internal error message
  * `result`: This is result object
  * `rp`: More details
    * `code`: Error code
    * `message`: Error message
