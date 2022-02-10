# Hadoop

## what is hadoop: 
- set of open-source programs and procedures
- Used for processing large amounts of data
- Servers run applications on clusters(A hadoop cluster is a collection of computer working together to perform task)
- hadoop is not database but an ecosystem that handles parallel jobs or processes


## Challenges of hadoop

- processing transaction (lack of random access)
- when work cannot be parallelized
- when there are dependecies in the data 
- low latency data access
- processing lots of small files 
- intensive calculation with little data

To deal with shortcoming of hadoop, new tools like Hive, were build on top of hadoop. hive provided SQL-like query and provided users with strong statistical functions. Pig was popular for its multi query approach to cut down the number of time that the data is scanned. 


## Core components of Hadoop

- HDFS 
- MapReduce
- YARN
- Hadoop Common


## Hadoop Environment

- *hadoop-env.sh* Serves as a master file to configure YARN, HDFS, MapReduce, and Hadoop-related project settings.
- *core-site.xml* Defines HDFS and Hadoop core properties
- *hdfs-site.xml* Governs the location for storing node metadata, fsimage file and log file.
- *mapred-site-xml* Lists the parameters for MapReduce configuration.
- *yarn-site.xml* Defines settings relevant to YARN. It contains configurations for the Node Manager, Resource Manager, Containers, and Application Master.



