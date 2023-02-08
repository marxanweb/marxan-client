# marxan-client
See also [marxan-server](https://github.com/marxanweb/marxan-server).  
Hosted version at [https://app.marxanweb.org](https://app.marxanweb.org)

## Architecture
![marxan-client architecture](architecture_client.png)

## Deployment
Git clone into the web root directory (e.g. for Apache2 on Ubuntu - /var/www/html).  
```
git clone https://github.com/marxanweb/marxan-client.git
```
The Marxan Client will be available at the following address:  
https://\<host>:8080/index.html  


## DOCKER   
This is a standalone Docker image intended to be used with a standalone marxan-server image and a local database, though the database can be changed by updating the relevant env/dat files. 

The Dockerfile contained uses the node:alpine base image.  
The instructions in the dockfile copy the package.json to the image, and then install them. 
There might be some errors with `node-gyp` but these do not seem to have any effect on the running of the app as far as I can tell. 
The app is then built. 

The image then uses the nginx image to run and host the app. 
The built app is copied over to the nginx immage to the default html folder.  
PORT 80 is exposed and nginx is started.  


To build the image go into the `marxan-client/` folder and run:  
`docker build -t repo_name:image_name .`  
This instruction builds an image using the tag option (`-t`). This gives the image a name in the format `repo_name:image_name`. If you dont provide an image_name it will default to `latest`  
The final part of the command is the path to the directory we want to build from. Given we are in the directory we want to build from we use `.`  

example:  
`docker build -t openmarxclient:test .`

Docker build options can be found here: https://docs.docker.com/engine/reference/commandline/build/

### Linux
The command for running the docker container is:  
`docker run -dp 5000:80 --name omc openmarxclient:update`  
This runs the docker container.  
 - `-d` is detatched mode, so you can use your terminal afterwards  
 - `-p` is the port command. In this instance we are using PORT 5000 on our local machine and matching that to PORT 80 in the docker image. The Dockerfile exposes port 80 so thats the port our container is expecting to run on. The marxan-server image is set to run on PORT 80 locally so we use PORT 5000 to run the client (or any port that you would like) 
 - you can combine `-d` and `-p` together into `-dp`  
 - `--name` gives the container a name of your choice to make interacting with the container easier.  
 - The final item is the name of the image you want to start the container from.  