## External Table

An External table points to data located in Hadoop, Azure Storage blob, or Azure Data Lake Storage. External table are used to read data from files or wirte data to files in azure storage. *With synapse SQL, we can use external tables to read extrenal data using dedicated SQL pool or Serverless SQL Pool*

### steps to create External Table

- Authorize to use data lake storage account.
- Define the format of the external file.
- create external table.

### Details steps using polybase to query extrenal table.

```sql
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'P@ssw0rd@123';

CREATE DATABASE SCOPED CREDENTIAL token_name
WITH IDENTITY='**',
SECRET = '**';

```

- Before we connect to the data source we should store the credential to connect to datasource. For that we create scoped credentail, a database scoped credential is a record that contains the authentication information that is requried to connect to a resources outside SQL Server.  Before creating a database scoped credential, the database must have a master key to protect the credential. In our case **Azure Synapse Analytics uses database scoped credential to acces non-public azure blob storage with polybase**, *Identity specifies the name of the account to be used when connection outside the server*. for eg: **to import the file from azure blob storage using shared key, the identity name must be *SHARED ACCESS SIGNATURE*.** And for secret contains the password need to access the external resource.

```sql
    CREATE EXTERNAL DATA SOURCE log_data
    WITH (    LOCATION   = 'https://datalakegen21adw.blob.core.windows.net/data',
              CREDENTIAL = token_name
    )
```

- ``CREATE EXTERNAL DATA SOURCE`` command creates an extrenal data source for polybase queries. Here we should provide the credential that we create at step 1 and location is the location for external file.

- Upto now we have configure our poly base now we will create external table as our data are defined. In this case we have csv data so configuring according to that.

```sql 
CREATE EXTERNAL FILE FORMAT TextFileFormat WITH (  
      FORMAT_TYPE = DELIMITEDTEXT,  
    FORMAT_OPTIONS (  
        FIELD_TERMINATOR = ',',
        FIRST_ROW = 2))
```


```sql
CREATE EXTERNAL TABLE [logdata]
(
    [Id] [int],
	[Correlationid] [varchar](200),
	[Operationname] [varchar](200),
	[Status] [varchar](100),
	[Eventcategory] [varchar](100),
	[Level] [varchar](100),
	[Time] [datetime],
	[Subscription] [varchar](200),
	[Eventinitiatedby] [varchar](1000),
	[Resourcetype] [varchar](1000),
	[Resourcegroup] [varchar](1000))
WITH (
 LOCATION = '/LogExtranalTable.csv',
    DATA_SOURCE = log_data,  
    FILE_FORMAT = TextFileFormat
)
```


Common errors

1. External table 'logdata' is not accessible because location does not exist or it is used by another process. 
Here your Shared Access Siganture is an issue. Ensure to create the right Shared Access Siganture

2. Msg 16544, Level 16, State 3, Line 34
The maximum reject threshold is reached.
This happens when you try to select the rows of data from the table. This can happen if the rows are not matching the schema defined for the table

