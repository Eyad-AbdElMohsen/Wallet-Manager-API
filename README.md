# Starting Project 🚀
### A ready-to-use template to kickstart your Node.js projects with minimal setup.

## Project Features
* Basic Node.js Setup with Express.
* Essential dependencies and scripts for a smooth start.
* Define some middlewares that any project need
* Handle errors
* Update package.json

## How to Use
* Clone the Repository

```
git clone <https://github.com/Eyad-AbdElMohsen/Starting-project> your-project-name
cd your-project-name
```
* Remove Old Git History  <br>
Delete the .git folder to remove the link to the original repository:

```
rm -rf .git
```
* Create New Repository <br>
&nbsp;&nbsp;&nbsp; 1. Go to GitHub. <br>
&nbsp;&nbsp;&nbsp; 2. Create a new repository.<br>
&nbsp;&nbsp;&nbsp; 3. Add it as the remote origin for your project:

> ```bash
> git init
> git remote add origin <new-repository-url>
> git branch -M main
> git add .
> git commit -m "Initial commit"
> git push -u origin main
> ```


* Install Dependencies
Install all necessary Node.js dependencies:

```
npm install
```
* Environment Variables  <br>
Add your .env file for environment-specific configurations. <br>
Example:
```
PORT=3000
DB_URL=mongodb://localhost:27017/your-database
```

* Start Coding <br>
You’re ready to go! Modify the project structure and dependencies as needed for your application.

