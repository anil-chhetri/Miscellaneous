## Spark Architecture

# What is a Cluster? 
   - A pool of computer working together but viewed as a single system.

# how pyspark code executes in spark.
Let's assume that we submit the pyspark code to spark application using spark-submit and spark application to cluster. The request will than be received my resource manager {yarn, mesos}. The application master conatiner(AMC) on a worker node and start main method in pyspark code in the conatiner. 

A container is an isolated virtual runtime environment, it comes with some CPU and memory allocation, all this allocation is done by resource manager.

Now inside the container, the main method of pyspark spark application is running there, since we are submitting our application in python, the code will start the JVM application with the help of py4j connection. And the pyspark code is using py4j to call java wrapper and execute the spark api codes.

pyspark main method is pyspark driver and JVM application (wrapper) is called application driver. 

Now the dirver is ready when it is able to run 2 driver, pyspark and application driver, the driver will go back to the resource manager and ask for some more containers. On receiving the request from driver, Resouce manager will create some more conatiners on worker nodes and give them to the driver.

Now when the diver recieved the details of the worker nodes provided by resouce manager, now driver will start the spark executor in thses containers, each container will run one spark executor and spark executer is a JVM application.


# Spark jobs : 




# terminology
- Application master contianer.
- worker node
- application driver
- JVM
- py4j
- pyspark Driver
- python worker
