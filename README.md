# Microrandom
### Optimizing the randomization process.

Microrandom is an intelligent group generator web application intended to promote diversity in a typically 'random' process. 

It is targeted to be used by teachers and professors in a classroom environment - after registering their class members through a custom link provided to each student, should they wish to conduct a group activity or project for their class, they can simply input the desired grouping details (such as the number of groups) into the app and receive a recommended list of groupings.

The web application is built using Bootstrap, Node and MongoDB, and is currently in the process of being hosted on Heroku - currently, it can be run after installation on http://localhost:8000/.

**Features**
* Allows for users to create groups and provide a custom group link from which new members can join.
* Provides a short survey to new members, asking for basic demographic details which are stored securely.
* Utilizes a genetic algorithm to determine optimal groupings that demonstrate the highest degree of diversity.
* Employs secure user and password authentication via Passport.
* Utilizes MongoDB Atlas for cloud database storage.

**App Interface**

<img src="assets/screenshots/Home.png" width="450"> <img src="assets/screenshots/Groups.png" width="450">
<img src="assets/screenshots/Creation.png" width="450"> <img src="assets/screenshots/List.png" width="450">
<img src="assets/screenshots/Groupings.png" width="450">
