
# Careg

<img src="UI/src/assets/images/Logo.png" alt="Logo">

## Introduction

This project is made as a final exam for subject INT3306 21. We produce a platform for Vietnam Register (Cục đăng kiểm Việt Nam) and Register Centers to storing, updating, and modifying car information. 
## Technical description

As a team seeking practical and modern technology, we used the MERN stack as our main technology to build this application. ReactJS for the front-end, ExpressJs and NodeJs for the back-end, routing, and calling REST APIs


In terms of a database, we used MongoDB to store information as JSON. While storing locally is a reliable option, we instead chose MongoDB Atlas and stored the cars on the cloud. This decision made us feel comfortable generating and accessing data. There is no need to duplicate databases for each device in the development process.


In fact, to demonstrate the effectiveness and functionality of our statistical and predictive features, we have to collect a huge amount of data. Obviously, the real data is strictly prohibited for normal people to access, so we made a tool that generated all the register centers and cars (each car also has its own history of registration information). It was written using Python.


In summary, this is a list of programming languages, frameworks, and libraries that we used: HTML, CSS, JavaScript, ReactJS, ExpressJS, NodeJS, MongoDB, and Python.


## Features

There are lots of features in our application, including but not limited to:
- Upload an existing file to Dababase
- Sign up accounts for register centers
- Track cars registered based on month, quarter, or year in every register center, region, or country.
- Track cars that are going to expire every month
- Predict the new car registration and monthly renewal registrations in every registration center, region, or country.
- Record the registry information and provide the certification.

## How to install

These steps below will help you install and run this web application. You should have nodejs installed on your machine. 

Step 1: Clone this repository: `git clone https://github.com/hoangbros03/phatTrienWebProject.git`

Step 2: Open a new terminal, change directory to server and install npm modules:

```
cd server

npm i
```

Step 3: Prepare the `.env` file. Please refer to Environment Variables below for details.

Step 4: Run the back-end server. You can choose:

`npm run dev` for debuging and editing. Server will automatically detect change and restarting.

`npm start` for testing

Step 5: go to UI folder, install the modules and start the front-end:

```
cd ../UI

npm i

npm start
```

Step 6: Go to the URL of the front-end and enjoying.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file to run back-end:

```
PORT //choose port for server
DATABASE_URL //where nosql database is stored
ACCESS_TOKEN_SECRET //for auth purposes
REFRESH_TOKEN_SECRET //for auth purposes
SERVER_URL
SECRET_KEY_INIT
DEFAULT_PASSWORD_TTDK_CREATION
```

Remember to place it inside 'server' folder
## Usage

<<todo: add usage>>
## Citations
There are resources that helpful:
 - [RegistryTotal](https://itest.com.vn/lects/webappdev/mockproj/registry-total.htm)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)



## Demo

<<Todo: add demo>>


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

<<todo: Add screenshot>>


## Authors

- [@hoangbros03](https://github.com/hoangbros03) : Trần Bá Hoàng
- [@NguyenVanHung24](https://github.com/NguyenVanHung24) : Nguyễn Văn Hùng 
- [@Duongsuny](https://github.com/Duongsuny) : Lê Quý Dương


## Contributing

Trần Bá Hoàng: Create 90% of the APIs and ensure they are logic error-free, handle the back-end with ExpressJS and NodeJS, design and setting Database with documents (something like table in SQL), create the middlewares, generate big data for DB, deploy to URL that can access online.

Nguyễn Văn Hùng: Test the APIs, handle the front-end with ReactJS, routing the website; create car tracking features, car searching, and renewal registration. Make website reload optimally, handle the authentication and authorization.

Lê Quý Dương: Test the APIs, design all the assets for website, handle the front-end with ReactJS, design and create statistic and prediction features. Fix the UI to look glance and responsive.

Percentage (approximately): 33%/33%/33%
## License

[MIT](https://choosealicense.com/licenses/mit/)

