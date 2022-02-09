# Introduction to mapReduce 

## What is MapReduce?
MapReduce is a programming pattern that enables massive scalability across hundreds or thousands of servers in haddop cluster. MapReduce is a processing technique and a program model for distributed computing which is based on Java. Distributed computing is a system or machine with multiple components located on differents machines. Each components has its own job but the component communicate with each other to run as one system to end user.
<br>

Map Reduce algorith consists of two important task Map and Reduce. Map takes in an input file and performs some mapping tasks by processing and extracting important data information into a key value pairs and these are the preliminary output list. Some more reorganizations goes on before the preliminary output is sent to Reducer. The reducer works with multiple map functions and aggregates the pairs using their keys to produce a final output. MapReduce keeps tracks of its task by creating unique keys to ensure that all the process are solving the same problem.

