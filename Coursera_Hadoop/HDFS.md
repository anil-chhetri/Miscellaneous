## HDFS

HDFS stands for hadoop distributed file system. A distributed file system is a file system that is distributed on multiple file servers and allow programmers to access or store files from any network or computer. HDFS is the storage layer of Hadoop. HDFS works by splitting the files into blocks, then creating replicas of the blocks, and storing them on different machines. HDFS is build to access streaming data seamlessly. *Streaming means that HDFS provides a constant bitrate when transferring data rather than having the data being transferred in waves.* <br>

**The Keys features of HDFS are**
- *Cost Efficient*: the storage hardware is not expensive.
- *Large amount of data*: HDFS can store up to petabytes of data. It splits these large amount of data into small chunks called blocks.
- *Replication*: Make copies of the data on multiple machines.
- *Fault tolerant*: If one machine crahes, a copy of the data can be found somewhere else and work continues.
- *Scalable*: One cluster can be sscaled into hundreds of nodes.
- *Protable*: can easily move across multiple platforms.

## HDFS Concepts and terminologies.
- **Blocks**: 
A block is the mimimum amoount of data that can be read or written and provides fault tolerance. Depending on the system configuration, the default size of a block could be 64 or 128 megabytes. For example, if we had a 500MB file, with a default size of 128MB, the file will be divided into 3 blocks of 128MB and 1 block of 116MB. Therefore each file stored doesn't have take up the storage of the pre-configured block size. 

- **Node**: 
A Node is a single system which is responsible for storing and processing data. Hdfs follows the primary and secondary concepts. HDFS has two types of nodes: The *primary node* know as the node, regulates file access to the clients and maintains, manages, and assigns tasks to the *secondary node*, also know as *data node*. There can be hundred of data nodes in the HDFS that manages the storage system. They perform read and writes request at the instruction of the name node.

- **Rack awareness in HDFS**
When performing operations like read and write, it is important that the name node maximize performance by choosing the data nodes closest to themselves. This could be by choosing data nodes on the same rack or in nearby racks. This is called rack awareness. *A rack is the collection of about forty to fifthy data nodes using the same network switch.* Rack awareness is use to reduce the network traffic and imporve cluster performance. To achieve rack awarenes, the name node keep thr rack ID information. Replication is done by rack awarenesss as well. It is done by making sure replicas of data node are in different racks. so **if a rack is down, we can still obtain the data from another rack.**. Replication is done by rack awareness as well. It is done by making sure replicas of a data node are in different racks. **HDFS uses the rack awareness concept to create a replicas to make sure that the data is reliable and available, and that the network bandwidth is properly utilized.

- **Replication**
Replication is creating a copy of the data block. When crashes happen, replication provides backup of the data blocks. *Replication factor is defined as the number of times you make a copy of the data block.*

- **Read and write operations**
HDFS allows "write once, read many" operations. This means that you cannot edit files that are already stored in HDFS, but you can append new data to them. Assuming we have a text file, the vlient will send a request to the primary node, which is the name node, to get the location of the data nodes containing blocks. The name node will verify that the client has the correct privileges and provide the client with the locations. A client in HDFS insteracts with the primary and secondary nodes to fulfill user's request. The client will then send a request to the closet data nodes through an FS data input stream object by calling the read method to read all the files. And when the client is done, the client will use the close method to end the session. Next Just like read operation, the name node confirms that the client has the right privileges. The name node makes sure to check that the file doesn't exist in the system. if the file alreacy exists, the client will receive an IO exception. If the file doesn't exists, the client receives a write permission together with the data node. once the client is done, the data nodes start creating replicas and sends a confirmation to the client.